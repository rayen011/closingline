import { supabase } from "@/lib/supabase";

/**
 * Call the generate-email Edge Function. supabase-js automatically attaches the
 * user's session token, so the function can identify the user and enforce limits.
 * Throws an Error whose `.code` is the structured reason
 * ("trial_exhausted", "fair_use_exceeded", "generation_failed", …).
 */
export async function generateEmail(payload) {
  const { data, error } = await supabase.functions.invoke("generate-email", {
    body: payload,
  });

  if (error) {
    let code = "generation_failed";
    let detail = "";
    let status;
    try {
      const body = await error.context?.json?.();
      if (body?.error) code = body.error;
      if (body?.detail) detail = body.detail;
      if (body?.status) status = body.status;
    } catch {
      /* network/parse error — keep the default code */
    }
    const e = new Error(code);
    e.code = code;
    e.detail = detail;
    e.status = status;
    throw e;
  }

  return data; // { text }
}

/** Human-readable message for a generation error code. */
export function generationErrorMessage(code) {
  switch (code) {
    case "trial_exhausted":
      return "You've used all your free early-access generations. Thanks for trying ClosingLine!";
    case "daily_capacity":
      return "ClosingLine has hit today's free capacity. Please try again tomorrow.";
    case "fair_use_exceeded":
      return "You've hit this period's fair-use limit. Get in touch and we'll lift it.";
    case "template_not_found":
      return "That template couldn't be found. Try another.";
    case "unauthorized":
      return "Your session expired. Please sign in again.";
    default:
      return "Generation failed. Please try again in a moment.";
  }
}
