import { supabase } from "@/lib/supabase";

/** Fetch the current user's profile row (null if not created yet). */
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** Create or update the profile. Marks `onboarded` true on completion. */
export async function upsertProfile(userId, fields) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      ...fields,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
