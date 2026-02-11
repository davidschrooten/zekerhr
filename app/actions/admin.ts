"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAllUsers() {
  const supabase = await createClient();
  
  // Verify Admin (Simplified)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // In real app, check role strictly
  
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("full_name", { ascending: true });

  return users || [];
}

export async function getComplianceAlerts() {
  const supabase = await createClient();
  
  // Fetch active sickness cases
  const { data: logs } = await supabase
    .from("sickness_logs")
    .select(`
      *,
      profiles:user_id (full_name, email)
    `)
    .is("recovery_date", null);

  if (!logs) return [];

  const now = new Date();
  const alerts = [];

  for (const log of logs) {
    const reportDate = new Date(log.report_date);
    const weeksSick = Math.floor((now.getTime() - reportDate.getTime()) / (1000 * 3600 * 24 * 7));

    // Poortwachter Logic
    if (weeksSick >= 5 && weeksSick < 6) {
      alerts.push({
        id: log.id,
        type: "Week 6: Probleemanalyse Deadline",
        user: log.profiles?.full_name || "Unknown",
        dueDate: new Date(reportDate.getTime() + (6 * 7 * 24 * 3600 * 1000)).toISOString()
      });
    } else if (weeksSick >= 7 && weeksSick < 8) {
      alerts.push({
        id: log.id,
        type: "Week 8: Plan van Aanpak Deadline",
        user: log.profiles?.full_name || "Unknown",
        dueDate: new Date(reportDate.getTime() + (8 * 7 * 24 * 3600 * 1000)).toISOString()
      });
    } else if (weeksSick >= 40 && weeksSick < 42) {
      alerts.push({
        id: log.id,
        type: "Week 42: UWV Notification Required",
        user: log.profiles?.full_name || "Unknown",
        dueDate: new Date(reportDate.getTime() + (42 * 7 * 24 * 3600 * 1000)).toISOString()
      });
    }
  }

  return alerts;
}
