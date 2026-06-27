import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Copy,
  Check,
  RefreshCw,
  ChevronDown,
  History as HistoryIcon,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGeneratedEmails } from "@/hooks/useGeneratedEmails";
import { copyToClipboard, formatDate, cn } from "@/lib/utils";
import { CATEGORY_LABEL, ROUTES } from "@/lib/constants";

function HistoryRow({ email, expanded, onToggle }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    if (await copyToClipboard(email.generated_text)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleRegenerate = (e) => {
    e.stopPropagation();
    navigate(`${ROUTES.generate}/${email.template_id}`, {
      state: { inputValues: email.input_values },
    });
  };

  return (
    <Card className="overflow-hidden">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <Badge variant="outline" className="shrink-0">
          {CATEGORY_LABEL[email.category] ?? email.category}
        </Badge>
        <p className="min-w-0 flex-1 truncate text-sm text-foreground">
          {email.generated_text}
        </p>
        <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
          {formatDate(email.created_at)}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            expanded && "rotate-180",
          )}
        />
      </button>

      {expanded && (
        <div className="border-t border-border px-5 py-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {email.generated_text}
          </p>
          <div className="mt-4 flex gap-2">
            <Button variant="subtle" size="sm" onClick={handleCopy} className="gap-1.5">
              {copied ? <Check className="h-4 w-4 text-sage" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            {email.template_id && (
              <Button variant="subtle" size="sm" onClick={handleRegenerate} className="gap-1.5">
                <RefreshCw className="h-4 w-4" /> Regenerate
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

export default function HistoryPage() {
  const { data: emails, isLoading } = useGeneratedEmails();
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const filtered = useMemo(() => {
    if (!emails) return [];
    const q = query.trim().toLowerCase();
    if (!q) return emails;
    return emails.filter(
      (e) =>
        e.generated_text.toLowerCase().includes(q) ||
        (CATEGORY_LABEL[e.category] ?? "").toLowerCase().includes(q) ||
        JSON.stringify(e.input_values).toLowerCase().includes(q),
    );
  }, [emails, query]);

  return (
    <>
      <PageHeader
        title="Email History"
        description="Every email you've generated, searchable."
      />

      {isLoading ? (
        <div className="grid place-items-center py-20">
          <Spinner />
        </div>
      ) : !emails || emails.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title="No emails yet"
          description="Generate your first email from a template and it'll show up here."
        />
      ) : (
        <>
          <div className="relative mb-6 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by content, client, or category…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No matches"
              description="Try a different search term."
            />
          ) : (
            <div className="space-y-3">
              {filtered.map((email) => (
                <HistoryRow
                  key={email.id}
                  email={email}
                  expanded={expandedId === email.id}
                  onToggle={() =>
                    setExpandedId(expandedId === email.id ? null : email.id)
                  }
                />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
