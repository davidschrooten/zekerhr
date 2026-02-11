"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { logAction } from "@/app/actions/audit";
import { Database } from "@/lib/supabase/database.types";

type UserRole = Database["public"]["Enums"]["user_role"];

export async function inviteUser(formData: FormData) {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  // 1. Verify Permissions
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (!currentUser) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", currentUser.id)
    .single();

  if (!profile || (profile.role !== "super_admin" && profile.role !== "hr_admin")) {
    throw new Error("Insufficient permissions");
  }

  // 2. Extract Data
  const email = formData.get("email") as string;
  const fullName = formData.get("full_name") as string;
  const role = formData.get("role") as UserRole;
  const bsn = formData.get("bsn") as string;
  const iban = formData.get("iban") as string;
  const salary = parseFloat(formData.get("salary") as string);
  const fte = parseFloat(formData.get("fte") as string);
  const startDate = formData.get("start_date") as string;

  // 3. Invite User (Auth)
  const { data: authData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);
  
  if (inviteError) {
    throw new Error("Failed to invite user: " + inviteError.message);
  }

  const newUserId = authData.user.id;

  // 4. Create Profile (Public)
  // Note: We use Admin client here to bypass potential RLS if the new user isn't logged in, 
  // though typically INSERT on profiles is restricted. Admin client ensures it works.
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .insert({
      id: newUserId,
      email: email,
      full_name: fullName,
      role: role,
      is_owner: false
    });

  if (profileError) throw new Error("Failed to create profile: " + profileError.message);

  // 5. Create Contract
  const { error: contractError } = await supabaseAdmin
    .from("contracts")
    .insert({
      user_id: newUserId,
      start_date: startDate,
      fte: fte,
      salary_gross_cents: Math.round(salary * 100),
      vacation_hours_statutory: Math.round(fte * 4 * 40), // Approx 4 weeks * 40h * FTE
      vacation_hours_non_statutory: 0 // Default
    });

  if (contractError) throw new Error("Failed to create contract: " + contractError.message);

  // 6. Store Sensitive Data
  // We must use the `store_sensitive_data` RPC. 
  // However, that RPC checks `auth.uid()`.
  // If we call it via `supabaseAdmin`, `auth.uid()` might be null or service role.
  // The RPC implementation checks: `IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() ...)`
  // Service role bypasses RLS, but RPC logic (PL/pgSQL) typically enforces checks unless we handle 'service_role' specifically.
  // The RPC I wrote has `SECURITY DEFINER`, so it runs as owner.
  // But the check `WHERE id = auth.uid()` will fail for service role if `auth.uid()` is null.
  
  // FIX: We should call the RPC using the `currentUser` context (the Admin user), NOT the service role client.
  // The Admin user HAS permission to call it.
  
  const { error: secureError } = await supabase.rpc("store_sensitive_data", {
    target_user_id: newUserId,
    plain_bsn: bsn,
    plain_iban: iban
  });

  if (secureError) throw new Error("Failed to store sensitive data: " + secureError.message);

  // 7. Audit Log
  await logAction("CREATE_USER", newUserId, { role, email });

  revalidatePath("/dashboard/admin");
}
