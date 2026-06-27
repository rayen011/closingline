import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Logo } from "@/components/shared/Logo";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label, FieldError } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { SPECIALTIES, ROUTES } from "@/lib/constants";

const schema = z.object({
  full_name: z.string().min(2, "Tell us your name"),
  brokerage_name: z.string().min(2, "Enter your brokerage"),
  specialty: z.enum(["residential", "commercial", "luxury", "rental"]),
  signature_block: z.string().max(600).optional().or(z.literal("")),
});

export default function OnboardingPage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { specialty: "residential" },
  });

  if (isLoading) return <LoadingScreen />;
  if (profile?.onboarded) return <Navigate to={ROUTES.app} replace />;

  const onSubmit = async (values) => {
    setFormError("");
    try {
      await updateProfile.mutateAsync({ ...values, onboarded: true });
      navigate(ROUTES.app, { replace: true });
    } catch (err) {
      setFormError(err.message ?? "Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto w-full max-w-xl animate-fade-in">
        <Logo to={null} />
        <div className="mt-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Let's personalize your emails
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            We use this to tailor every generated email to you — your name,
            brokerage, and sign-off.
          </p>
        </div>

        <Card className="mt-8">
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              {formError && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {formError}
                </div>
              )}
              <div>
                <Label htmlFor="full_name">Full name</Label>
                <Input
                  id="full_name"
                  placeholder="Jordan Rivera"
                  {...register("full_name")}
                />
                <FieldError>{errors.full_name?.message}</FieldError>
              </div>
              <div>
                <Label htmlFor="brokerage_name">Brokerage</Label>
                <Input
                  id="brokerage_name"
                  placeholder="Rivera & Co. Realty"
                  {...register("brokerage_name")}
                />
                <FieldError>{errors.brokerage_name?.message}</FieldError>
              </div>
              <div>
                <Label htmlFor="specialty">Specialty</Label>
                <Select id="specialty" {...register("specialty")}>
                  {SPECIALTIES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </Select>
                <FieldError>{errors.specialty?.message}</FieldError>
              </div>
              <div>
                <Label htmlFor="signature_block">Email signature</Label>
                <Textarea
                  id="signature_block"
                  rows={4}
                  placeholder={
                    "Jordan Rivera\nRivera & Co. Realty\n(555) 123-4567"
                  }
                  {...register("signature_block")}
                />
                <FieldError>{errors.signature_block?.message}</FieldError>
              </div>
              <Button
                type="submit"
                className="w-full"
                loading={updateProfile.isPending}
              >
                Finish setup
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
