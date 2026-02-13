"use server";

import { createClient } from "@/lib/supabase/server";

export interface EmployeeMetricsData {
  leaveBalance: {
    wettelijk: number;
    bovenwettelijk: number;
    total: number;
    unit: 'hours' | 'days';
  };
  activeSickness: boolean;
  contractHours: number;
  documentsCount: number;
  profileComplete: boolean;
}

export interface ActivityItem {
  id: string;
  type: 'leave' | 'sickness' | 'document' | 'other';
  title: string;
  description: string;
  date: string;
  status?: string;
}

export async function getEmployeeMetrics(): Promise<EmployeeMetricsData> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // 1. Fetch Leave Balances
  const { data: balances } = await supabase
    .from("leave_balances")
    .select("balance_minutes, type")
    .eq("user_id", user.id)
    .gt("expiration_date", new Date().toISOString());

  let wettelijkMins = 0;
  let bovenwettelijkMins = 0;

  balances?.forEach(b => {
    if (b.type === 'wettelijk') wettelijkMins += b.balance_minutes;
    if (b.type === 'bovenwettelijk') bovenwettelijkMins += b.balance_minutes;
  });

  const totalMins = wettelijkMins + bovenwettelijkMins;
  // Convert to days (assuming 8h/day = 480 mins)
  const totalDays = Math.round((totalMins / 480) * 10) / 10;

  // 2. Fetch Active Sickness
  const { data: activeSickness } = await supabase
    .from("sickness_logs")
    .select("id")
    .eq("user_id", user.id)
    .is("recovery_date", null)
    .maybeSingle();

  // 3. Fetch Contract Hours & Profile
  const [contractRes, profileRes] = await Promise.all([
    supabase
      .from("contracts")
      .select("fte, salary_gross_cents")
      .eq("user_id", user.id)
      .order("start_date", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single()
  ]);

  const contract = contractRes.data;
  const profile = profileRes.data;

  // 4. Fetch Documents Count
  const { count: documentsCount } = await supabase
    .from("documents")
    .select("*", { count: 'exact', head: true })
    .eq("user_id", user.id);

  return {
    leaveBalance: {
      wettelijk: wettelijkMins,
      bovenwettelijk: bovenwettelijkMins,
      total: totalDays,
      unit: 'days'
    },
    activeSickness: !!activeSickness,
    contractHours: contract ? Math.round(contract.fte * 40) : 40, // Assuming 40h is 1.0 FTE
    documentsCount: documentsCount || 0,
    profileComplete: !!profile?.full_name
  };
}

export async function getRecentActivity(): Promise<ActivityItem[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const activities: ActivityItem[] = [];

  // 1. Recent Leave Requests
  // Only try if table exists (assuming it does based on migration check)
  const { data: leaveRequests } = await supabase
    .from("leave_requests" as any) 
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  if (leaveRequests) {
    leaveRequests.forEach((req: any) => {
      activities.push({
        id: `leave-${req.id}`,
        type: 'leave',
        title: 'Verlofaanvraag',
        description: `${req.status === 'approved' ? 'Goedgekeurd' : req.status === 'denied' ? 'Geweigerd' : 'In behandeling'} - ${(req.minutes_requested / 480).toFixed(1)} dagen`,
        date: req.created_at,
        status: req.status
      });
    });
  }

  // 2. Sickness Logs
  const { data: sicknessLogs } = await supabase
    .from("sickness_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("report_date", { ascending: false })
    .limit(5);

  if (sicknessLogs) {
    sicknessLogs.forEach((log: any) => {
      activities.push({
        id: `sick-${log.id}`,
        type: 'sickness',
        title: log.recovery_date ? 'Hersteld gemeld' : 'Ziek gemeld',
        description: log.recovery_date ? 'Herstel doorgegeven' : 'Ziekmelding actief',
        date: log.report_date, // or created_at if available
        status: log.status
      });
    });
  }

  // 3. Expense Claims
  const { data: expenseClaims } = await supabase
    .from("expense_claims")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  if (expenseClaims) {
    expenseClaims.forEach((claim: any) => {
      activities.push({
        id: `expense-${claim.id}`,
        type: 'other',
        title: 'Declaratie Ingediend',
        description: `${claim.description} - € ${(claim.amount_cents / 100).toFixed(2)}`,
        date: claim.date,
        status: claim.status
      });
    });
  }

  // 4. Recent Documents (Payslips)
  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .eq("type", "payslip")
    .order("created_at", { ascending: false })
    .limit(5);

  if (documents) {
    documents.forEach((doc) => {
      activities.push({
        id: `doc-${doc.id}`,
        type: 'document',
        title: 'Nieuwe Loonstrook',
        description: doc.name,
        date: doc.created_at!,
        status: 'available'
      });
    });
  }

  // Sort by date desc
  return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
}
