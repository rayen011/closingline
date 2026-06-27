import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { GoogleButton } from "@/features/auth/components/GoogleButton";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label, FieldError } from "@/components/ui/label";
import { ROUTES, PLAN } from "@/lib/constants";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters"),
});

export default function SignupPage() {
  const { signUpWithPassword } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");
  const [needsConfirm, setNeedsConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email, password }) => {
    setFormError("");
    const { data, error } = await signUpWithPassword(email, password);
    if (error) {
      setFormError(error.message);
      return;
    }
    // If email confirmation is required, there's no active session yet.
    if (!data.session) {
      setNeedsConfirm(true);
      return;
    }
    navigate(ROUTES.onboarding, { replace: true });
  };

  if (needsConfirm) {
    return (
      <AuthLayout title="Check your inbox">
        <p className="text-sm text-muted-foreground">
          We sent a confirmation link to your email. Click it to finish setting
          up your account, then sign in.
        </p>
        <Link to={ROUTES.login}>
          <Button className="mt-6 w-full">Back to sign in</Button>
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Start free"
      subtitle={`${PLAN.trialGenerations} free generations. No credit card required.`}
      footer={
        <>
          Already have an account?{" "}
          <Link to={ROUTES.login} className="font-semibold text-navy dark:text-brass">
            Sign in
          </Link>
        </>
      }
    >
      <GoogleButton label="Sign up with Google" />

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        OR
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {formError && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </div>
        )}
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@brokerage.com"
            {...register("email")}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            {...register("password")}
          />
          <FieldError>{errors.password?.message}</FieldError>
        </div>
        <Button type="submit" className="w-full" loading={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
