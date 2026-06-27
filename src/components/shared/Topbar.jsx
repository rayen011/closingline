import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Moon, Sun, LogOut, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUIStore } from "@/store/ui";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useSubscription } from "@/hooks/useSubscription";
import { initials } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

export function Topbar() {
  const { toggleSidebar, theme, toggleTheme } = useUIStore();
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const { isPro } = useSubscription();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <button
        aria-label="Open menu"
        onClick={toggleSidebar}
        className="rounded-md p-2 text-muted-foreground hover:bg-muted lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="ml-auto flex items-center gap-3">
        <Badge variant={isPro ? "brass" : "outline"}>
          {isPro ? "Pro" : "Trial"}
        </Badge>

        <button
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="rounded-md p-2 text-muted-foreground hover:bg-muted"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-full bg-navy text-sm font-semibold text-cream"
          >
            {profile?.full_name ? initials(profile.full_name) : <User className="h-4 w-4" />}
          </button>

          {menuOpen && (
            <>
              <button
                aria-hidden
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-elevated">
                <div className="border-b border-border px-4 py-3">
                  <p className="truncate text-sm font-semibold">
                    {profile?.full_name ?? "Your account"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
                <Link
                  to={ROUTES.settings}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-muted"
                >
                  <User className="h-4 w-4" /> Account settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-muted"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
