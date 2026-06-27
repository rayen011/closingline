import { useQuery } from "@tanstack/react-query";
import { getTemplate, listTemplates } from "@/lib/db/templates";
import { getCustomTemplate } from "@/lib/db/customTemplates";

export function useTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: listTemplates,
    staleTime: 5 * 60_000, // system templates rarely change
  });
}

export function useTemplate(id) {
  return useQuery({
    queryKey: ["template", id],
    queryFn: () => getTemplate(id),
    enabled: !!id,
  });
}

/**
 * Resolve a template id to either a system or a custom template.
 * Ids are unique across both tables, so we try system first, then custom.
 * Returns `{ template, isCustom }` or null if neither exists.
 */
export function useResolvedTemplate(id) {
  return useQuery({
    queryKey: ["resolved_template", id],
    enabled: !!id,
    queryFn: async () => {
      const system = await getTemplate(id);
      if (system) return { template: system, isCustom: false };
      const custom = await getCustomTemplate(id);
      if (custom) return { template: custom, isCustom: true };
      return null;
    },
  });
}
