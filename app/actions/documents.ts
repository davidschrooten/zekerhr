"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getUploadUrl(sicknessLogId: string, filename: string, fileType: string) {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  // 1. Check Permissions
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role === 'employee')) {
      // Employees cannot upload documents? Usually they can upload 'Self-declarations'.
      // For Poortwachter, usually HR uploads.
      // Let's restrict to manager/hr for now.
      throw new Error("Insufficient permissions");
  }

  // 2. Get Sickness Log to determine User ID (path structure)
  const { data: log } = await supabase
    .from("sickness_logs")
    .select("user_id")
    .eq("id", sicknessLogId)
    .single();

  if (!log) throw new Error("Sickness log not found");

  const path = `${log.user_id}/${sicknessLogId}/${filename}`;

  // 3. Ensure bucket exists (Lazy create)
  const { error: bucketError } = await supabaseAdmin.storage.getBucket('sickness-documents');
  if (bucketError) {
      await supabaseAdmin.storage.createBucket('sickness-documents', { public: false });
  }

  // 4. Create Signed Upload URL
  const { data, error } = await supabaseAdmin.storage
    .from('sickness-documents')
    .createSignedUploadUrl(path);

  if (error) throw new Error("Failed to create upload URL: " + error.message);

  return { signedUrl: data.signedUrl, path, token: data.token };
}

export async function saveDocumentRef(sicknessLogId: string, name: string, path: string, type: string) {
  const supabase = await createClient();
  // We use normal client here as RLS on sickness_logs allows update?
  // Check RLS policies. Manager/HR should be able to update.
  // Actually, we might need to update RLS or use Admin client if RLS restricts 'documents' column update.
  // Let's use Admin client to be safe for this specific column update if policies aren't granular.
  
  const supabaseAdmin = createAdminClient();

  const { data: log } = await supabaseAdmin
    .from("sickness_logs")
    .select("documents")
    .eq("id", sicknessLogId)
    .single();

  if (!log) throw new Error("Log not found");

  const currentDocs = (log.documents as any[]) || [];
  const newDoc = { name, path, type, uploadedAt: new Date().toISOString() };
  
  const { error } = await supabaseAdmin
    .from("sickness_logs")
    .update({ documents: [...currentDocs, newDoc] })
    .eq("id", sicknessLogId);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/manager");
}
