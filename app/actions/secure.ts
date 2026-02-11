"use server";

import { createClient } from "@/lib/supabase/server";
import { logAction } from "@/app/actions/audit";

export async function storeSensitiveData(targetUserId: string, bsn: string, iban: string) {
  const supabase = await createClient();
  
  const { error } = await supabase.rpc("store_sensitive_data", {
    target_user_id: targetUserId,
    plain_bsn: bsn,
    plain_iban: iban
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function revealSensitiveData(targetUserId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("reveal_sensitive_data", {
    target_user_id: targetUserId
  });

  if (error) {
    throw new Error(error.message);
  }

  // Log the Reveal Action
  await logAction("VIEW_BSN", targetUserId);

  return data && data[0] ? data[0] : null;
}
