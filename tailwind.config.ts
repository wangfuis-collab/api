import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
      boxShadow: {
        neon: "0 0 24px rgba(99,102,241,.45), 0 0 80px rgba(168,85,247,.25)",
        glass: "inset 0 1px 0 rgba(255,255,255,.12), 0 24px 80px rgba(0,0,0,.45)",
      },
      keyframes: {
        aurora: { "0%,100%": { transform: "translate3d(0,0,0) rotate(0deg)" }, "50%": { transform: "translate3d(4%, -3%, 0) rotate(10deg)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } },
        grid: { "0%": { transform: "translateY(0)" }, "100%": { transform: "translateY(48px)" } },
      },
      animation: { aurora: "aurora 14s ease-in-out infinite", shimmer: "shimmer 2.2s linear infinite", float: "float 6s ease-in-out infinite", grid: "grid 3s linear infinite" },
    },
  },
  plugins: [animate],
};
export default config;
