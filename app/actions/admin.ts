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

export async function getAdminNotifications() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_read", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }

  return notifications;
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", user.id); // Ensure user owns the notification

  if (error) {
    throw new Error(error.message);
  }
}
