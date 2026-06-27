import { supabase } from "@/lib/supabase";

/** Current user's saved templates (RLS scopes to the owner). */
export async function listCustomTemplates(userId) {
  const { data, error } = await supabase
    .from("custom_templates")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getCustomTemplate(id) {
  const { data, error } = await supabase
    .from("custom_templates")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createCustomTemplate(userId, fields) {
  const { data, error } = await supabase
    .from("custom_templates")
    .insert({ user_id: userId, ...fields })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCustomTemplate(id) {
  const { error } = await supabase.from("custom_templates").delete().eq("id", id);
  if (error) throw error;
}
