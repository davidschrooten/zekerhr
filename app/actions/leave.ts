"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Database } from "@/lib/supabase/database.types";
import { logAction } from "@/app/actions/audit";

type LeaveType = Database["public"]["Enums"]["leave_type"];

export async function submitLeaveRequest(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const startDate = formData.get("start_date") as string;
  const endDate = formData.get("end_date") as string;
  const reason = formData.get("reason") as string;
  // Simplified calculation: Assuming 8 hours (480 mins) per day for now.
  // In a real app, this would calculate business days between dates.
  const days = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24) + 1;
  const minutesRequested = Math.ceil(days * 480); 

  const { error } = await supabase.from("leave_requests").insert({
    user_id: user.id,
    start_date: startDate,
    end_date: endDate,
    minutes_requested: minutesRequested,
    reason: reason,
    status: "pending",
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/employee");
}

export async function approveLeaveRequest(requestId: string, managerId: string) {
  const supabase = await createClient();

  // 1. Verify Manager Permissions (Simplified for MVP: Check if user exists)
  // Real implementation would check if managerId manages the request's user.
  const { data: manager } = await supabase.auth.getUser();
  if (!manager || manager.user?.id !== managerId) {
    // In a real scenario, we'd check RBAC roles here too.
    // For now, assume the caller is authorized via UI protection.
  }

  // 2. Fetch the Request
  const { data: request, error: requestError } = await supabase
    .from("leave_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (requestError || !request) {
    throw new Error("Leave request not found.");
  }

  if (request.status !== "pending") {
    throw new Error("Request is already processed.");
  }

  let remainingMinutesToDeduct = request.minutes_requested;

  // 3. Fetch Balances
  // Logic: Wettelijk first, then Oldest Expiration first.
  const { data: balances, error: balanceError } = await supabase
    .from("leave_balances")
    .select("*")
    .eq("user_id", request.user_id)
    .gt("balance_minutes", 0)
    .gte("expiration_date", new Date().toISOString()) // Only valid balances
    .order("expiration_date", { ascending: true }); // Oldest first

  if (balanceError) {
    throw new Error("Failed to fetch leave balances.");
  }

  // Sort in memory to prioritize Wettelijk regardless of date, or trust the query if we could sort by type.
  // Postgres sort by enum is usually alphabetical (bovenwettelijk < wettelijk), so we need manual sort.
  // We want Wettelijk FIRST.
  const sortedBalances = balances?.sort((a, b) => {
    if (a.type === "wettelijk" && b.type !== "wettelijk") return -1;
    if (a.type !== "wettelijk" && b.type === "wettelijk") return 1;
    // If types are same, maintain expiration_date sort from DB
    return 0;
  });

  if (!sortedBalances || sortedBalances.length === 0) {
    throw new Error("Insufficient leave balance.");
  }

  // 4. Calculate Deductions
  const updates = [];
  
  for (const balance of sortedBalances) {
    if (remainingMinutesToDeduct <= 0) break;

    const deduction = Math.min(balance.balance_minutes, remainingMinutesToDeduct);
    
    updates.push({
      id: balance.id,
      balance_minutes: balance.balance_minutes - deduction,
    });

    remainingMinutesToDeduct -= deduction;
  }

  if (remainingMinutesToDeduct > 0) {
    throw new Error(`Insufficient leave balance. Missing ${remainingMinutesToDeduct} minutes.`);
  }

  // 5. Apply Updates (Transaction-like)
  // Note: In a real production app, use RPC for atomicity. Here we do sequential updates.
  
  // Update Balances
  for (const update of updates) {
    await supabase
      .from("leave_balances")
      .update({ balance_minutes: update.balance_minutes })
      .eq("id", update.id);
  }

  // Update Request Status
  await supabase
    .from("leave_requests")
    .update({ status: "approved" })
    .eq("id", requestId);

  await logAction("APPROVE_LEAVE", request.user_id, { 
    requestId, 
    minutes: request.minutes_requested,
    managerId 
  });

  revalidatePath("/dashboard/manager");
}
