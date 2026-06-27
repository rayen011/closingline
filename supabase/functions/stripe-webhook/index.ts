// Stripe webhook — keeps the subscriptions table in sync with Stripe.
// IMPORTANT: deploy WITHOUT JWT verification (Stripe sends no Supabase token):
//   supabase functions deploy stripe-webhook --no-verify-jwt
// Secrets: STRIPE_WEBHOOK_SECRET (+ SUPABASE_SERVICE_ROLE_KEY is auto-provided)

import { createClient } from "npm:@supabase/supabase-js@2";

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

/** Verify the Stripe-Signature header (HMAC-SHA256 of `${t}.${body}`). */
async function verifySignature(body: string, header: string, secret: string) {
  const parts = Object.fromEntries(
    header.split(",").map((kv) => kv.split("=")),
  );
  const t = parts.t;
  const v1 = parts.v1;
  if (!t || !v1) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(`${t}.${body}`));
  const hex = [...new Uint8Array(mac)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return timingSafeEqual(hex, v1);
}

/** Constant-time string comparison to avoid signature timing leaks. */
function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function mapStatus(stripeStatus: string) {
  if (stripeStatus === "active" || stripeStatus === "trialing") return "active";
  if (stripeStatus === "past_due") return "past_due";
  return "canceled";
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("method_not_allowed", { status: 405 });

  const sig = req.headers.get("stripe-signature") ?? "";
  const body = await req.text();
  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

  if (!(await verifySignature(body, sig, secret))) {
    return new Response("invalid_signature", { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(body);
  } catch {
    return new Response("invalid_json", { status: 400 });
  }

  const obj = event.data?.object ?? {};

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const userId = obj.metadata?.user_id;
        const fields = {
          plan: "pro",
          status: "active",
          stripe_customer_id: obj.customer,
          stripe_subscription_id: obj.subscription,
        };
        if (userId) {
          await admin.from("subscriptions").update(fields).eq("user_id", userId);
        } else {
          await admin
            .from("subscriptions")
            .update(fields)
            .eq("stripe_customer_id", obj.customer);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const status = mapStatus(obj.status);
        await admin
          .from("subscriptions")
          .update({
            plan: status === "canceled" ? "trial" : "pro",
            status,
            stripe_subscription_id: obj.id,
            current_period_end: obj.current_period_end
              ? new Date(obj.current_period_end * 1000).toISOString()
              : null,
          })
          .eq("stripe_customer_id", obj.customer);
        break;
      }
      case "customer.subscription.deleted": {
        await admin
          .from("subscriptions")
          .update({ plan: "trial", status: "canceled" })
          .eq("stripe_customer_id", obj.customer);
        break;
      }
      default:
        // Unhandled event types are acknowledged so Stripe stops retrying.
        break;
    }
  } catch (err) {
    console.error("webhook_handler_error", event.type, err);
    return new Response("handler_error", { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
