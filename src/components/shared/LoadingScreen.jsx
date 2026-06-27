import { Spinner } from "@/components/ui/spinner";

export function LoadingScreen({ label = "Loading…" }) {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="h-7 w-7" />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
