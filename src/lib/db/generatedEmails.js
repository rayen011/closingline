import { supabase } from "@/lib/supabase";

/** Current user's generated-email history, newest first. */
export async function listGeneratedEmails(userId) {
  const { data, error } = await supabase
    .from("generated_emails")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

/** Count for the current user — drives the trial counter in the UI. */
export async function countGeneratedEmails(userId) {
  const { count, error } = await supabase
    .from("generated_emails")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  if (error) throw error;
  return count ?? 0;
}
