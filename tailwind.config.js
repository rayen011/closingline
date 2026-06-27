/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        // Brand palette — "established brokerage", not "AI startup"
        navy: {
          DEFAULT: "#16243D",
          50: "#EEF1F6",
          100: "#D5DDE9",
          200: "#A9B9D0",
          300: "#7C92B4",
          400: "#506C97",
          500: "#324B73",
          600: "#243758",
          700: "#16243D",
          800: "#101B2E",
          900: "#0A1220",
        },
        brass: {
          DEFAULT: "#C9A24B",
          50: "#FBF6EA",
          100: "#F4E8C8",
          200: "#E9D193",
          300: "#DDBA60",
          400: "#C9A24B",
          500: "#AE8838",
          600: "#8A6B2C",
          700: "#664E20",
          800: "#433414",
          900: "#221A0A",
        },
        cream: "#F8F6F1",
        ink: "#1A1A1A",
        sage: {
          DEFAULT: "#6B8F71",
          light: "#E3ECE4",
        },
        // Semantic tokens (drive light/dark via CSS vars in index.css)
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: "hsl(var(--card) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        "muted-foreground": "hsl(var(--muted-foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,27,46,0.04), 0 8px 24px rgba(16,27,46,0.06)",
        elevated: "0 12px 40px rgba(16,27,46,0.12)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
