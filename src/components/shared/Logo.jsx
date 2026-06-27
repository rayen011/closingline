import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/** ClosingLine wordmark. `to` makes it a link; omit for a plain mark. */
export function Logo({ className, to = "/", showText = true }) {
  const mark = (
    <span className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy text-brass shadow-sm">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          <path
            d="M4 7.5 12 13l8-5.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="4"
            y="5"
            width="16"
            height="14"
            rx="2.5"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </span>
      {showText && (
        <span className="text-lg font-extrabold tracking-tight text-foreground">
          Closing<span className="text-brass">Line</span>
        </span>
      )}
    </span>
  );

  if (!to) return <span className={cn("inline-flex", className)}>{mark}</span>;
  return (
    <Link to={to} className={cn("inline-flex", className)}>
      {mark}
    </Link>
  );
}
