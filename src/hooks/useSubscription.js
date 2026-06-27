import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getSubscription } from "@/lib/db/subscriptions";

/**
 * Returns the subscription plus derived `isPro` / `plan` helpers.
 * No row, or a non-active status, means the user is on the free trial.
 */
export function useSubscription() {
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: () => getSubscription(user.id),
    enabled: !!user,
  });

  const sub = query.data;
  const isPro = sub?.plan === "pro" && sub?.status === "active";

  return { ...query, subscription: sub, isPro, plan: isPro ? "pro" : "trial" };
}
