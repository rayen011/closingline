import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { ROUTES } from "@/lib/constants";

/** Gate: requires an authenticated session. */
export function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <LoadingScreen />;
  if (!user) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />;
  }
  return <Outlet />;
}

/** Gate: requires a completed onboarding profile (for /app/*). */
export function RequireOnboarded() {
  const { data: profile, isLoading } = useProfile();
  if (isLoading) return <LoadingScreen />;
  if (!profile?.onboarded) return <Navigate to={ROUTES.onboarding} replace />;
  return <Outlet />;
}

/** Gate: bounce already-authenticated users away from auth pages. */
export function RedirectIfAuthed() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to={ROUTES.app} replace />;
  return <Outlet />;
}
