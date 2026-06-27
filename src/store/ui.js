import { create } from "zustand";

/**
 * Global UI state only — never server data (that lives in React Query).
 * Sidebar collapse + theme, persisted to localStorage.
 */
const readTheme = () => {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem("cl-theme") ?? "light";
};

export const useUIStore = create((set, get) => ({
  sidebarOpen: false, // mobile drawer
  theme: readTheme(),

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebar: (open) => set({ sidebarOpen: open }),

  setTheme: (theme) => {
    localStorage.setItem("cl-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    set({ theme });
  },
  toggleTheme: () => get().setTheme(get().theme === "dark" ? "light" : "dark"),
}));

/** Apply the stored theme to <html> on first load. */
export function initTheme() {
  const theme = readTheme();
  document.documentElement.classList.toggle("dark", theme === "dark");
}
