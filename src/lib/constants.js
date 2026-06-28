// ── Routes ────────────────────────────────────────────────────────────────
export const ROUTES = {
  landing: "/",
  login: "/login",
  signup: "/signup",
  onboarding: "/onboarding",
  app: "/app",
  generate: "/app/generate", // + /:templateId
  templates: "/app/templates",
  history: "/app/history",
  settings: "/app/settings",
};

// ── Template categories (mirrors the DB enum) ───────────────────────────────
export const CATEGORIES = [
  { key: "buyer_followup", label: "Buyer Follow-Up" },
  { key: "listing", label: "Listing Description" },
  { key: "negotiation", label: "Negotiation" },
  { key: "open_house", label: "Open House Invite" },
  { key: "price_reduction", label: "Price Reduction" },
  { key: "closing", label: "Closing / Congrats" },
  { key: "cold_outreach", label: "Cold Outreach" },
];

export const CATEGORY_LABEL = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.label]),
);

// ── Specialties (onboarding) ────────────────────────────────────────────────
export const SPECIALTIES = [
  { key: "residential", label: "Residential" },
  { key: "commercial", label: "Commercial" },
  { key: "luxury", label: "Luxury" },
  { key: "rental", label: "Rental" },
];

// ── Tone options (generator) ────────────────────────────────────────────────
export const TONES = [
  { key: "professional", label: "Professional" },
  { key: "warm", label: "Warm & Friendly" },
  { key: "concise", label: "Concise & Direct" },
  { key: "enthusiastic", label: "Enthusiastic" },
  { key: "formal", label: "Formal" },
];

// ── Plan / billing ──────────────────────────────────────────────────────────
export const PLAN = {
  price: 29,
  currency: "USD",
  interval: "month",
  trialGenerations: 5, // free generations per user during early access
  fairUseCap: 1000, // soft cap per billing period (Pro — dormant during early access)
};
