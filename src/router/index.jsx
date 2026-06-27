import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import {
  RequireAuth,
  RequireOnboarded,
  RedirectIfAuthed,
} from "@/features/auth/ProtectedRoute";
import { AppShell } from "@/components/shared/AppShell";

// Lazy-loaded route pages → each becomes its own chunk (smaller initial load).
const LandingPage = lazy(() => import("@/features/marketing/pages/LandingPage"));
const NotFoundPage = lazy(() => import("@/features/marketing/pages/NotFoundPage"));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const SignupPage = lazy(() => import("@/features/auth/pages/SignupPage"));
const OnboardingPage = lazy(() => import("@/features/onboarding/pages/OnboardingPage"));
const DashboardPage = lazy(() => import("@/features/dashboard/pages/DashboardPage"));
const GeneratorPage = lazy(() => import("@/features/generator/pages/GeneratorPage"));
const MyTemplatesPage = lazy(() => import("@/features/templates/pages/MyTemplatesPage"));
const HistoryPage = lazy(() => import("@/features/history/pages/HistoryPage"));
const SettingsPage = lazy(() => import("@/features/settings/pages/SettingsPage"));

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  {
    element: <RedirectIfAuthed />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      { path: "/onboarding", element: <OnboardingPage /> },
      {
        element: <RequireOnboarded />,
        children: [
          {
            path: "/app",
            element: <AppShell />,
            children: [
              { index: true, element: <DashboardPage /> },
              { path: "generate", element: <GeneratorPage /> },
              { path: "generate/:templateId", element: <GeneratorPage /> },
              { path: "templates", element: <MyTemplatesPage /> },
              { path: "history", element: <HistoryPage /> },
              { path: "settings", element: <SettingsPage /> },
            ],
          },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
