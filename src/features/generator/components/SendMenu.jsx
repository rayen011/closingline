import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Opens the generated email prefilled in the user's mail compose window.
 * No OAuth — just deep-links to Gmail / Outlook web, or the default mail app.
 * The agent fills in the recipient and hits Send.
 */
function composeUrls(body) {
  const b = encodeURIComponent(body ?? "");
  return {
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&body=${b}`,
    outlook: `https://outlook.office.com/mail/deeplink/compose?body=${b}`,
    mailto: `mailto:?body=${b}`,
  };
}

const ITEMS = [
  { key: "gmail", label: "Gmail" },
  { key: "outlook", label: "Outlook" },
  { key: "mailto", label: "Default mail app" },
];

export function SendMenu({ text }) {
  const [open, setOpen] = useState(false);
  const urls = composeUrls(text);

  const go = (which) => {
    setOpen(false);
    if (which === "mailto") {
      window.location.href = urls.mailto;
    } else {
      window.open(urls[which], "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="relative">
      <Button
        variant="brass"
        size="sm"
        className="gap-1.5"
        onClick={() => setOpen((o) => !o)}
      >
        <Send className="h-4 w-4" /> Send
      </Button>
      {open && (
        <>
          <button
            aria-hidden
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-card shadow-elevated">
            <div className="border-b border-border px-4 py-2 text-xs text-muted-foreground">
              Opens with the email prefilled
            </div>
            {ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => go(item.key)}
                className="block w-full px-4 py-2.5 text-left text-sm hover:bg-muted"
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
