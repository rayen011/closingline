import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  createCustomTemplate,
  deleteCustomTemplate,
  listCustomTemplates,
} from "@/lib/db/customTemplates";

export function useCustomTemplates() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["custom_templates", user?.id],
    queryFn: () => listCustomTemplates(user.id),
    enabled: !!user,
  });
}

export function useCreateCustomTemplate() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fields) => createCustomTemplate(user.id, fields),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["custom_templates", user?.id] }),
  });
}

export function useDeleteCustomTemplate() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteCustomTemplate(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["custom_templates", user?.id] }),
  });
}
