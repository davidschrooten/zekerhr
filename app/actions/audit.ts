"use server";

import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/database.types";

type AuditAction = Database["public"]["Enums"]["audit_action"];

export async function logAction(
  action: AuditAction, 
  targetId?: string, 
  metadata: Record<string, any> = {}
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error("Failed to log audit action: No authenticated user");
    return;
  }

  try {
    const { error } = await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action: action,
      target_id: targetId,
      metadata: metadata
    });

    if (error) {
      console.error("Failed to insert audit log", error);
    }
  } catch (err) {
    console.error("Exception logging audit action", err);
  }
}
