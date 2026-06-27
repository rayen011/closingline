import { Link } from "react-router-dom";
import {
  Sparkles,
  PencilLine,
  Clock,
  Check,
  ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES, PLAN, CATEGORIES } from "@/lib/constants";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI built for real estate",
    body: "Pick a template, add the property details, and get a ready-to-send email tuned to your tone and brokerage.",
  },
  {
    icon: PencilLine,
    title: "Your templates, your voice",
    body: "Edit any generated email and save it as a reusable template. Your sign-off and style, every time.",
  },
  {
    icon: Clock,
    title: "Seconds, not mornings",
    body: "The ten emails you write every day — follow-ups, listings, price drops — drafted in one click.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo to="/" />
        <div className="flex items-center gap-2">
          <Link to={ROUTES.login}>
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link to={ROUTES.signup}>
            <Button size="sm">Start free</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-16 text-center sm:pt-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-brass/40 bg-white px-3 py-1 text-xs font-semibold text-brass-700">
          <Sparkles className="h-3.5 w-3.5" /> Powered by Claude
        </span>
        <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-navy sm:text-6xl">
          Every real estate email,
          <br />
          <span className="text-brass">ready in seconds.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-ink/70">
          ClosingLine drafts the follow-ups, listings, and negotiation emails
          you write every day — in your voice, ready to send.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to={ROUTES.signup}>
            <Button size="lg" className="gap-2">
              Start free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="text-sm text-ink/60">
            {PLAN.trialGenerations} free generations · no credit card
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="bg-white">
              <CardContent>
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-navy text-brass">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm text-ink/70">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Template categories */}
      <section className="mx-auto max-w-6xl px-6 py-12 text-center">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink/50">
          Templates for every moment in the deal
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          {CATEGORIES.map((c) => (
            <span
              key={c.key}
              className="rounded-full border border-navy/10 bg-white px-4 py-2 text-sm font-medium text-navy"
            >
              {c.label}
            </span>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-md px-6 py-16">
        <Card className="overflow-hidden border-navy/10 bg-white">
          <div className="bg-navy px-6 py-5 text-center text-cream">
            <p className="text-sm font-medium text-cream/70">ClosingLine Pro</p>
            <p className="mt-1 text-4xl font-extrabold">
              ${PLAN.price}
              <span className="text-base font-medium text-cream/60">/mo</span>
            </p>
          </div>
          <CardContent className="pt-6">
            <ul className="space-y-3 text-sm">
              {[
                "Unlimited email generation",
                "All template categories",
                "Save your own reusable templates",
                "Searchable email history",
                "Your signature & brokerage, baked in",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 shrink-0 text-sage" />
                  <span className="text-ink/80">{f}</span>
                </li>
              ))}
            </ul>
            <Link to={ROUTES.signup}>
              <Button className="mt-6 w-full" size="lg">
                Start with {PLAN.trialGenerations} free
              </Button>
            </Link>
            <p className="mt-3 text-center text-xs text-ink/50">
              No credit card required to try.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <Logo to="/" />
          <p className="text-sm text-ink/50">
            © {new Date().getFullYear()} ClosingLine. Every real estate email,
            ready in seconds.
          </p>
        </div>
      </footer>
    </div>
  );
}
