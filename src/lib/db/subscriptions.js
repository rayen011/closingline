import { supabase } from "@/lib/supabase";

/** Current user's subscription row, or null (treated as trial). */
export async function getSubscription(userId) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}
