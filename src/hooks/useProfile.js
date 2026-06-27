import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getProfile, upsertProfile } from "@/lib/db/profiles";

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfile(user.id),
    enabled: !!user,
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fields) => upsertProfile(user.id, fields),
    onSuccess: (data) => qc.setQueryData(["profile", user?.id], data),
  });
}
