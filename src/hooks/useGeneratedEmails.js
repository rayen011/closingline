import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  countGeneratedEmails,
  listGeneratedEmails,
} from "@/lib/db/generatedEmails";

export function useGeneratedEmails() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["generated_emails", user?.id],
    queryFn: () => listGeneratedEmails(user.id),
    enabled: !!user,
  });
}

export function useGenerationCount() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["generation_count", user?.id],
    queryFn: () => countGeneratedEmails(user.id),
    enabled: !!user,
  });
}
