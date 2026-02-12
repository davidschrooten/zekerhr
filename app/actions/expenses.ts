"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getExpenses() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("expense_claims")
    .select("*")
    .eq("user_id", user.id)
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
}
