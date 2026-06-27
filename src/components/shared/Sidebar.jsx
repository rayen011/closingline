import { NavLink } from "react-router-dom";
import { LayoutGrid, BookMarked, History, Settings, X } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { useUIStore } from "@/store/ui";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

const NAV = [
  { to: ROUTES.app, label: "Dashboard", icon: LayoutGrid, end: true },
  { to: ROUTES.templates, label: "My Templates", icon: BookMarked },
  { to: ROUTES.history, label: "History", icon: History },
  { to: ROUTES.settings, label: "Settings", icon: Settings },
];

function NavItems({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-brass/15 text-navy dark:text-brass"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )
          }
        >
          <Icon className="h-[18px] w-[18px]" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export function Sidebar() {
  const { sidebarOpen, setSidebar } = useUIStore();

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card px-4 py-6 lg:flex">
        <div className="px-2">
          <Logo to={ROUTES.app} />
        </div>
        <div className="mt-8">
          <NavItems />
        </div>
      </aside>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
            onClick={() => setSidebar(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-border bg-card px-4 py-6">
            <div className="flex items-center justify-between px-2">
              <Logo to={ROUTES.app} />
              <button
                aria-label="Close menu"
                onClick={() => setSidebar(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-8">
              <NavItems onNavigate={() => setSidebar(false)} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
