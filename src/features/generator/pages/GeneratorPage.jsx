import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  BookmarkPlus,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label, FieldError } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useResolvedTemplate } from "@/hooks/useTemplates";
import { useCreateCustomTemplate } from "@/hooks/useCustomTemplates";
import { generateEmail, generationErrorMessage } from "@/features/generator/api";
import { SendMenu } from "@/features/generator/components/SendMenu";
import { copyToClipboard } from "@/lib/utils";
import { TONES, LANGUAGES, ROUTES } from "@/lib/constants";

export default function GeneratorPage() {
  const { templateId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: resolved, isLoading } = useResolvedTemplate(templateId);
  const template = resolved?.template;
  const isCustom = resolved?.isCustom ?? false;
  const createCustom = useCreateCustomTemplate();

  const [preview, setPreview] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [errorDetail, setErrorDetail] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const fields = template?.placeholder_fields ?? [];

  const { register, handleSubmit, getValues, formState: { errors } } = useForm({
    defaultValues: {
      tone: TONES[0].key,
      language: LANGUAGES[0].key,
      ...(location.state?.inputValues ?? {}),
    },
  });

  const generate = useMutation({
    mutationFn: generateEmail,
    onSuccess: (data) => {
      setPreview(data.text);
      setErrorCode("");
      setErrorDetail("");
      qc.invalidateQueries({ queryKey: ["generated_emails", user?.id] });
      qc.invalidateQueries({ queryKey: ["generation_count", user?.id] });
    },
    onError: (err) => {
      setErrorCode(err.code ?? "generation_failed");
      setErrorDetail(
        [err.status && `HTTP ${err.status}`, err.detail]
          .filter(Boolean)
          .join(" · "),
      );
    },
  });

  const onSubmit = (values) => {
    const inputValues = {};
    for (const f of fields) inputValues[f.key] = values[f.key];
    generate.mutate({
      ...(isCustom
        ? { customTemplateId: template.id }
        : { templateId: template.id }),
      category: template.category,
      inputValues,
      tone: values.tone,
      language: values.language,
    });
  };

  const handleCopy = async () => {
    if (await copyToClipboard(preview)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleSaveTemplate = async () => {
    await createCustom.mutateAsync({
      based_on_template_id: template.id,
      title: `${template.title} (my version)`,
      category: template.category,
      prompt_structure: template.prompt_structure,
      placeholder_fields: template.placeholder_fields,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  if (isLoading) return <LoadingScreen />;
  if (!template) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Template not found"
        description="It may have been removed. Head back and pick another."
        action={
          <Link to={ROUTES.app}>
            <Button>Back to templates</Button>
          </Link>
        }
      />
    );
  }

  return (
    <>
      <Link
        to={ROUTES.app}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to templates
      </Link>
      <PageHeader
        title={template.title}
        description="Fill in the details, generate, and copy your email."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {fields.map((f) => (
                <div key={f.key}>
                  <Label htmlFor={f.key}>{f.label}</Label>
                  {f.type === "textarea" ? (
                    <Textarea
                      id={f.key}
                      rows={3}
                      {...register(f.key, { required: "Required" })}
                    />
                  ) : (
                    <Input
                      id={f.key}
                      {...register(f.key, { required: "Required" })}
                    />
                  )}
                  <FieldError>{errors[f.key]?.message}</FieldError>
                </div>
              ))}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <Select id="tone" {...register("tone")}>
                    {TONES.map((t) => (
                      <option key={t.key} value={t.key}>
                        {t.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select id="language" {...register("language")}>
                    {LANGUAGES.map((l) => (
                      <option key={l.key} value={l.key}>
                        {l.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                loading={generate.isPending}
              >
                <Sparkles className="h-4 w-4" />
                {preview ? "Regenerate" : "Generate email"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <span className="text-sm font-semibold">Preview</span>
            {preview && (
              <div className="flex items-center gap-1">
                <SendMenu text={preview} />
                <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1.5">
                  {copied ? <Check className="h-4 w-4 text-sage" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSubmit(getValues())}
                  loading={generate.isPending}
                  className="gap-1.5"
                >
                  <RefreshCw className="h-4 w-4" /> Regenerate
                </Button>
                {!isCustom && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveTemplate}
                    loading={createCustom.isPending}
                    className="gap-1.5"
                  >
                    {saved ? <Check className="h-4 w-4 text-sage" /> : <BookmarkPlus className="h-4 w-4" />}
                    {saved ? "Saved" : "Save"}
                  </Button>
                )}
              </div>
            )}
          </div>

          <CardContent className="flex-1">
            {errorCode && (
              <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p>{generationErrorMessage(errorCode)}</p>
                  {errorDetail && (
                    <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded bg-red-100/60 p-2 text-xs">
                      {errorDetail}
                    </pre>
                  )}
                </div>
              </div>
            )}

            {generate.isPending ? (
              <div className="space-y-2.5">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-5/6" />
                <div className="skeleton h-4 w-2/3" />
              </div>
            ) : preview ? (
              <p
                dir="auto"
                className="whitespace-pre-wrap text-sm leading-relaxed text-foreground"
              >
                {preview}
              </p>
            ) : (
              !errorCode && (
                <div className="grid h-full min-h-[200px] place-items-center text-center">
                  <p className="max-w-xs text-sm text-muted-foreground">
                    Fill in the details and hit{" "}
                    <span className="font-medium text-foreground">Generate</span>{" "}
                    — your email appears here, ready to copy.
                  </p>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
