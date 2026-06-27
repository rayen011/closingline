import { supabase } from "@/lib/supabase";

/** Normalize a functions.invoke error into an Error with `.code` and `.detail`. */
async function toError(error, fallback) {
  let code = fallback;
  let detail = "";
  try {
    const body = await error.context?.json?.();
    if (body?.error) code = body.error;
    if (body?.detail) detail = body.detail;
  } catch {
    /* non-JSON response (e.g. function not deployed) — keep fallback */
  }
  const e = new Error(code);
  e.code = code;
  e.detail = detail;
  return e;
}

/** Start Stripe Checkout to upgrade to Pro. Redirects the browser to Stripe. */
export async function startCheckout() {
  const { data, error } = await supabase.functions.invoke("stripe-checkout", {
    body: {},
  });
  if (error) throw await toError(error, "checkout_failed");
  if (!data?.url) throw new Error("checkout_failed");
  window.location.href = data.url;
}

/** Open the Stripe Customer Portal to manage an existing subscription. */
export async function openBillingPortal() {
  const { data, error } = await supabase.functions.invoke("stripe-portal", {
    body: {},
  });
  if (error) throw await toError(error, "portal_failed");
  if (!data?.url) throw new Error("portal_failed");
  window.location.href = data.url;
}
