"use server";

import { createClient } from "@/lib/supabase/server";

export async function getTeamLeaveRequests() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  // Get manager's profile to find their department (assuming managers manage their department)
  const { data: managerProfile } = await supabase
    .from("profiles")
    .select("department_id")
    .eq("id", user.id)
    .single();

  if (!managerProfile?.department_id) {
      // Fallback: If no department, maybe return nothing or all if super admin?
      // For MVP, let's return all requests if user is a manager role.
      const { data: roleData } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (roleData?.role !== 'manager' && roleData?.role !== 'hr_admin' && roleData?.role !== 'super_admin') {
          return [];
      }
      
      // Return all pending requests for now if department logic is loose
      const { data } = await supabase
        .from("leave_requests")
        .select(`
            *,
            profiles:user_id (full_name, email)
        `)
        .eq("status", "pending")
        .order("start_date", { ascending: true });
      
      return data || [];
  }

  // Filter by department
  const { data } = await supabase
    .from("leave_requests")
    .select(`
        *,
        profiles:user_id (full_name, email, department_id)
    `)
    .eq("status", "pending")
    .eq("profiles.department_id", managerProfile.department_id)
    .order("start_date", { ascending: true });

  return data || [];
}

export async function getTeamSickness() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

   // Similar logic: Check role
   const { data: roleData } = await supabase.from("profiles").select("role").eq("id", user.id).single();
   if (!roleData || (roleData.role === 'employee')) {
       return [];
   }

  const { data } = await supabase
    .from("sickness_logs")
    .select(`
        *,
        profiles:user_id (full_name, email)
    `)
    .is("recovery_date", null)
    .order("report_date", { ascending: false });

  return data || [];
}
