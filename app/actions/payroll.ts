"use server";

import { createClient } from "@/lib/supabase/server";

export async function generatePayrollData(year: number, month: number) {
  const supabase = await createClient();

  // Month is 1-12
  const startDate = new Date(year, month - 1, 1).toISOString();
  const endDate = new Date(year, month, 0).toISOString(); // Last day of month

  // 1. New Hires (Contracts starting in month)
  const { data: newHires } = await supabase
    .from("contracts")
    .select(`
      *,
      profiles:user_id (full_name, email, role)
    `)
    .gte("start_date", startDate)
    .lte("start_date", endDate);

  // 2. Terminations (Contracts ending in month)
  const { data: terminations } = await supabase
    .from("contracts")
    .select(`
      *,
      profiles:user_id (full_name, email)
    `)
    .gte("end_date", startDate)
    .lte("end_date", endDate);

  // 3. Sickness Mutations (Reported or Recovered in month)
  // - Reported in month OR
  // - Recovered in month
  const { data: sicknessReports } = await supabase
    .from("sickness_logs")
    .select(`
      *,
      profiles:user_id (full_name, email)
    `)
    .gte("report_date", startDate)
    .lte("report_date", endDate);

  const { data: sicknessRecoveries } = await supabase
    .from("sickness_logs")
    .select(`
      *,
      profiles:user_id (full_name, email)
    `)
    .gte("recovery_date", startDate)
    .lte("recovery_date", endDate);

  return {
    period: `${year}-${month.toString().padStart(2, '0')}`,
    newHires: newHires || [],
    terminations: terminations || [],
    sickness: [...(sicknessReports || []), ...(sicknessRecoveries || [])]
  };
}
