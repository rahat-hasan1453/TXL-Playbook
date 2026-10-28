import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        txl: {
          dark: "#0b0f19",
          card: "#111827",
          border: "#1f2937",
          accent: "#3b82f6",
          emerald: "#10b981",
          amber: "#f59e0b",
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
