"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getExpenses(month: number, year: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Calculate start and end date for the month
  const startDate = new Date(Date.UTC(year, month - 1, 1)).toISOString().split('T')[0];
  const endDate = new Date(Date.UTC(year, month, 0)).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from("expense_claims")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching expenses:", error);
    throw new Error("Failed to fetch expenses");
  }

  return data;
}

export async function submitExpense(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const description = formData.get("description") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const date = formData.get("date") as string;
  const category = formData.get("category") as "travel" | "equipment" | "meals" | "training" | "other";

  if (!description || !amount || !date || !category) {
    throw new Error("Missing required fields");
  }

  const { error } = await supabase.from("expense_claims").insert({
    user_id: user.id,
    description,
    amount_cents: Math.round(amount * 100),
    date,
    category,
    status: "pending",
  });

  if (error) {
    console.error("Error submitting expense:", error);
    throw new Error("Failed to submit expense");
  }

  revalidatePath("/dashboard/employee/expenses");
  redirect("/dashboard/employee/expenses");
}
