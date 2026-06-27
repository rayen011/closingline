// Creates a Stripe Checkout Session to upgrade the current user to Pro.
// Deploy: supabase functions deploy stripe-checkout
// Secrets: STRIPE_SECRET_KEY, STRIPE_PRICE_ID, APP_URL

import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), {
    status: s,
    headers: { ...cors, "Content-Type": "application/json" },
  });

async function stripe(path: string, params: Record<string, string>) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("STRIPE_SECRET_KEY")}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(params),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message ?? "stripe_error");
  return data;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } },
  );
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return json({ error: "unauthorized" }, 401);

  const appUrl = Deno.env.get("APP_URL") ?? "http://localhost:5173";

  try {
    const { data: sub } = await admin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    let customerId = sub?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe("customers", {
        email: user.email ?? "",
        "metadata[user_id]": user.id,
      });
      customerId = customer.id;
      await admin
        .from("subscriptions")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", user.id);
    }

    const session = await stripe("checkout/sessions", {
      mode: "subscription",
      customer: customerId,
      "line_items[0][price]": Deno.env.get("STRIPE_PRICE_ID")!,
      "line_items[0][quantity]": "1",
      success_url: `${appUrl}/app/settings?checkout=success`,
      cancel_url: `${appUrl}/app/settings?checkout=cancel`,
      "metadata[user_id]": user.id,
      "subscription_data[metadata][user_id]": user.id,
    });

    return json({ url: session.url });
  } catch (err) {
    console.error("checkout_error", err); // server-side only
    return json({ error: "checkout_failed" }, 500);
  }
});
