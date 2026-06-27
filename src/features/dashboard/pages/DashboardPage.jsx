import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCheck,
  Home,
  Handshake,
  CalendarClock,
  TrendingDown,
  PartyPopper,
  Send,
  Search,
  FileText,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import { useTemplates } from "@/hooks/useTemplates";
import { useGenerationCount } from "@/hooks/useGeneratedEmails";
import { useSubscription } from "@/hooks/useSubscription";
import { CATEGORY_LABEL, PLAN, ROUTES } from "@/lib/constants";

const CATEGORY_ICON = {
  buyer_followup: UserCheck,
  listing: Home,
  negotiation: Handshake,
  open_house: CalendarClock,
  price_reduction: TrendingDown,
  closing: PartyPopper,
  cold_outreach: Send,
};

function TrialBanner() {
  const { isPro } = useSubscription();
  const { data: count = 0 } = useGenerationCount();
  if (isPro) return null;

  const remaining = Math.max(0, PLAN.trialGenerations - count);
  const pct = Math.min(100, (count / PLAN.trialGenerations) * 100);

  return (
    <Card className="mb-6 border-brass/30 bg-brass-50/60">
      <CardContent className="py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-navy">
            {remaining} of {PLAN.trialGenerations} free generations left
          </span>
          <span className="text-muted-foreground">Upgrade for unlimited</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-brass-100">
          <div
            className="h-full rounded-full bg-brass transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: profile } = useProfile();
  const { data: templates, isLoading } = useTemplates();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  const filtered = useMemo(() => {
    if (!templates) return [];
    const q = query.trim().toLowerCase();
    if (!q) return templates;
    return templates.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (CATEGORY_LABEL[t.category] ?? "").toLowerCase().includes(q),
    );
  }, [templates, query]);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Pick a template to generate your next email."
      />

      <TrialBanner />

      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search templates…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent>
                <div className="skeleton mb-4 h-11 w-11 rounded-lg" />
                <div className="skeleton mb-2 h-4 w-2/3" />
                <div className="skeleton h-3 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No templates match"
          description="Try a different search term."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => {
            const Icon = CATEGORY_ICON[t.category] ?? FileText;
            return (
              <button
                key={t.id}
                onClick={() => navigate(`${ROUTES.generate}/${t.id}`)}
                className="text-left"
              >
                <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-elevated">
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="grid h-11 w-11 place-items-center rounded-lg bg-brass/15 text-brass">
                        <Icon className="h-5 w-5" />
                      </span>
                      <Badge variant="outline">
                        {CATEGORY_LABEL[t.category]}
                      </Badge>
                    </div>
                    <h3 className="mt-4 font-semibold">{t.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t.placeholder_fields?.length ?? 0} quick fields →
                      ready-to-send email.
                    </p>
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
