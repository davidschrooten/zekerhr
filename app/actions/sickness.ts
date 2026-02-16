"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAction } from "./audit";

export async function reportSickness(userId: string) {
  const supabase = await createClient();
  
  // Verify the user is reporting for themselves (or check admin rights later)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    throw new Error("Unauthorized");
  }

  // Check for existing active sickness
  const { data: activeSickness } = await supabase
    .from("sickness_logs")
    .select("id")
    .eq("user_id", userId)
    .is("recovery_date", null)
    .single();

  if (activeSickness) {
    throw new Error("User is already reported as sick.");
  }

  const { error } = await supabase.from("sickness_logs").insert({
    user_id: userId,
    report_date: new Date().toISOString(),
    status: "reported",
  });

  if (error) {
    throw new Error(error.message);
  }

  await logAction("REPORT_SICKNESS", userId);

  revalidatePath("/dashboard/employee");
}

export async function reportRecovery(userId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    throw new Error("Unauthorized");
  }

  // Find the active sickness record
  const { data: activeSickness } = await supabase
    .from("sickness_logs")
    .select("id")
    .eq("user_id", userId)
    .is("recovery_date", null)
    .single();

  if (!activeSickness) {
    throw new Error("No active sickness record found.");
  }

  const { error } = await supabase
    .from("sickness_logs")
    .update({
      recovery_date: new Date().toISOString(),
      status: "recovered",
    })
    .eq("id", activeSickness.id);

  if (error) {
    throw new Error(error.message);
  }

  await logAction("REPORT_RECOVERY", userId);

  revalidatePath("/dashboard/employee");
}
