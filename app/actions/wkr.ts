"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getWKRStatus() {
  const supabase = await createClient();

  // 1. Calculate Estimated Fiscal Wage Bill
  // Fetch all active contracts
  const { data: contracts } = await supabase
    .from("contracts")
    .select("salary_gross_cents")
    .is("end_date", null); // Active only (simplified)

  let totalWageBillCents = 0;
  if (contracts) {
    // Estimate: Monthly * 12.96 (12 months + 8% holiday allowance)
    totalWageBillCents = contracts.reduce((acc, curr) => acc + (curr.salary_gross_cents * 12.96), 0);
  }

  const totalWageBill = totalWageBillCents / 100;

  // 2. Calculate Budget (2026 Rules)
  // 2.0% up to €400,000
  // 1.18% above €400,000
  let budget = 0;
  if (totalWageBill <= 400000) {
    budget = totalWageBill * 0.02; // 2.0%
  } else {
    budget = (400000 * 0.02) + ((totalWageBill - 400000) * 0.0118);
  }

  // 3. Sum Taxable Expenses
  const { data: expenses } = await supabase
    .from("wkr_expenses")
    .select("amount_cents")
    .eq("category", "taxable")
    .gte("date", `${new Date().getFullYear()}-01-01`); // Current year only

  const spentCents = expenses?.reduce((acc, curr) => acc + curr.amount_cents, 0) || 0;
  const spent = spentCents / 100;

  return {
    wageBill: totalWageBill,
    budget: budget,
    spent: spent,
    remaining: budget - spent,
    percentageUsed: budget > 0 ? (spent / budget) * 100 : 0
  };
}

export async function addWKRExpense(formData: FormData) {
  const supabase = await createClient();
  
  const description = formData.get("description") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const category = formData.get("category") as "taxable" | "targeted_exemption";
  const date = formData.get("date") as string;

  if (!description || !amount || !category || !date) {
    throw new Error("Missing required fields");
  }

  const { error } = await supabase.from("wkr_expenses").insert({
    description,
    amount_cents: Math.round(amount * 100),
    category,
    date
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/hr");
}
