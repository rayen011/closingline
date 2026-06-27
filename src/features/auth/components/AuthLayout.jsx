import { Logo } from "@/components/shared/Logo";

/** Split-screen auth shell: brand panel + form column. */
export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between bg-navy p-12 text-cream lg:flex">
        <Logo to="/" />
        <div className="max-w-md">
          <p className="text-2xl font-semibold leading-snug">
            "I used to spend half my mornings rewriting the same follow-ups.
            Now it's one click and I'm back to selling."
          </p>
          <p className="mt-4 text-sm text-cream/70">
            — Maria T., Residential Agent
          </p>
        </div>
        <p className="text-sm text-cream/50">
          Every real estate email, ready in seconds.
        </p>
        <div className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-brass/20 blur-3xl" />
      </div>

      {/* Form column */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm animate-fade-in">
          <div className="lg:hidden">
            <Logo to="/" />
          </div>
          <div className="mt-8 lg:mt-0">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="mt-8">{children}</div>
          {footer && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {footer}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
