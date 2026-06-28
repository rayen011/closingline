import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { User, PenLine, CreditCard, Lock, Check, Crown } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label, FieldError } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useSubscription } from "@/hooks/useSubscription";
import { openBillingPortal } from "@/features/billing/api";
import { supabase } from "@/lib/supabase";
import { SPECIALTIES, PLAN } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";

const TABS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "signature", label: "Signature", icon: PenLine },
  { key: "billing", label: "Billing", icon: CreditCard },
  { key: "security", label: "Security", icon: Lock },
];

function SavedFlash({ show }) {
  if (!show) return null;
  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-sage">
      <Check className="h-4 w-4" /> Saved
    </span>
  );
}

function ProfileTab({ profile }) {
  const update = useUpdateProfile();
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      full_name: profile?.full_name ?? "",
      brokerage_name: profile?.brokerage_name ?? "",
      specialty: profile?.specialty ?? "residential",
    },
  });

  const onSubmit = async (values) => {
    await update.mutateAsync(values);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="full_name">Full name</Label>
        <Input id="full_name" {...register("full_name", { required: "Required" })} />
        <FieldError>{errors.full_name?.message}</FieldError>
      </div>
      <div>
        <Label htmlFor="brokerage_name">Brokerage</Label>
        <Input id="brokerage_name" {...register("brokerage_name", { required: "Required" })} />
        <FieldError>{errors.brokerage_name?.message}</FieldError>
      </div>
      <div>
        <Label htmlFor="specialty">Specialty</Label>
        <Select id="specialty" {...register("specialty")}>
          {SPECIALTIES.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </Select>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" loading={update.isPending}>Save changes</Button>
        <SavedFlash show={saved} />
      </div>
    </form>
  );
}

function SignatureTab({ profile }) {
  const update = useUpdateProfile();
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: { signature_block: profile?.signature_block ?? "" },
  });

  const onSubmit = async (values) => {
    await update.mutateAsync(values);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="signature_block">Email signature</Label>
        <Textarea
          id="signature_block"
          rows={5}
          placeholder={"Jordan Rivera\nRivera & Co. Realty\n(555) 123-4567"}
          {...register("signature_block")}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Appended to every generated email.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" loading={update.isPending}>Save signature</Button>
        <SavedFlash show={saved} />
      </div>
    </form>
  );
}

function BillingTab() {
  const { isPro, subscription, isLoading } = useSubscription();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handlePortal = async () => {
    setBusy(true);
    setError("");
    try {
      await openBillingPortal();
    } catch (err) {
      setError(
        err.detail ? `${err.code}: ${err.detail}` : "Couldn't open the billing portal.",
      );
      setBusy(false);
    }
  };

  if (isLoading) return <Spinner />;

  // Pro is dormant during early access. This branch only shows if an account is
  // somehow already Pro (kept for when paid plans switch back on).
  if (isPro) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Current plan</span>
            <Badge variant="brass">Pro</Badge>
          </div>
          {subscription?.current_period_end && (
            <span className="text-xs text-muted-foreground">
              Renews {formatDate(subscription.current_period_end)}
            </span>
          )}
        </div>
        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <Button variant="outline" onClick={handlePortal} loading={busy}>
          Manage billing
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Current plan</span>
          <Badge variant="sage">Early access — free</Badge>
        </div>
      </div>
      <Card className="border-brass/30">
        <CardContent>
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-brass" />
            <h3 className="font-semibold">Pro is coming soon</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            ClosingLine is free while we're in early access — enjoy{" "}
            {PLAN.trialGenerations} email generations on us. Paid Pro plans with
            unlimited generation are on the way.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function SecurityTab() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ password }) => {
    setError("");
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) {
      setError(err.message);
      return;
    }
    reset();
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Email</Label>
        <Input value={user?.email ?? ""} disabled />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Signed in via {user?.app_metadata?.provider ?? "email"}.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register("password", {
              required: "Required",
              minLength: { value: 8, message: "Use at least 8 characters" },
            })}
          />
          <FieldError>{errors.password?.message}</FieldError>
        </div>
        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="flex items-center gap-3">
          <Button type="submit" loading={isSubmitting}>Update password</Button>
          <SavedFlash show={saved} />
        </div>
      </form>
    </div>
  );
}

export default function SettingsPage() {
  const { data: profile, isLoading } = useProfile();
  const [params, setParams] = useSearchParams();
  const active = params.get("tab") ?? (params.get("checkout") ? "billing" : "profile");

  const setTab = (key) => {
    const next = new URLSearchParams(params);
    next.set("tab", key);
    setParams(next, { replace: true });
  };

  return (
    <>
      <PageHeader
        title="Account Settings"
        description="Manage your profile, signature, billing, and security."
      />

      <div className="flex flex-wrap gap-1.5 border-b border-border">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              active === key
                ? "border-brass text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      <Card className="mt-6 max-w-2xl">
        <CardContent>
          {isLoading ? (
            <div className="grid place-items-center py-10">
              <Spinner />
            </div>
          ) : (
            <>
              {active === "profile" && <ProfileTab profile={profile} />}
              {active === "signature" && <SignatureTab profile={profile} />}
              {active === "billing" && <BillingTab />}
              {active === "security" && <SecurityTab />}
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
