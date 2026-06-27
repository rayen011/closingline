import { useNavigate } from "react-router-dom";
import { BookMarked, Trash2, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  useCustomTemplates,
  useDeleteCustomTemplate,
} from "@/hooks/useCustomTemplates";
import { CATEGORY_LABEL, ROUTES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default function MyTemplatesPage() {
  const { data: templates, isLoading } = useCustomTemplates();
  const deleteTemplate = useDeleteCustomTemplate();
  const navigate = useNavigate();

  const handleDelete = (id) => {
    if (window.confirm("Delete this template? This can't be undone.")) {
      deleteTemplate.mutate(id);
    }
  };

  return (
    <>
      <PageHeader
        title="My Templates"
        description="Your saved, reusable email templates."
      />

      {isLoading ? (
        <div className="grid place-items-center py-20">
          <Spinner />
        </div>
      ) : !templates || templates.length === 0 ? (
        <EmptyState
          icon={BookMarked}
          title="No saved templates yet"
          description="Generate an email, then hit Save to turn it into a reusable template you can run with one click."
          action={
            <Button onClick={() => navigate(ROUTES.app)}>Browse templates</Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <Card key={t.id} className="flex flex-col">
              <CardContent className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="outline">
                    {CATEGORY_LABEL[t.category] ?? t.category}
                  </Badge>
                  <button
                    onClick={() => handleDelete(t.id)}
                    aria-label="Delete template"
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="mt-3 font-semibold">{t.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Saved {formatDate(t.created_at)}
                </p>
                <div className="flex-1" />
                <Button
                  className="mt-4 w-full gap-2"
                  variant="subtle"
                  onClick={() => navigate(`${ROUTES.generate}/${t.id}`)}
                >
                  Use template <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
