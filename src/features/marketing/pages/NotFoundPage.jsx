import { Link } from "react-router-dom";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <div className="animate-fade-in">
        <Logo to="/" />
        <p className="mt-10 text-6xl font-extrabold tracking-tight text-navy dark:text-brass">
          404
        </p>
        <h1 className="mt-2 text-xl font-bold">Page not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button className="mt-6">Back home</Button>
        </Link>
      </div>
    </div>
  );
}
