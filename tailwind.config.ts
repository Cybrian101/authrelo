import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0D1117",
          card: "#1a2332",
          "card-hover": "#1e2a3d",
        },
        accent: {
          DEFAULT: "#F59E0B",
          muted: "rgba(245,158,11,0.15)",
          border: "rgba(245,158,11,0.25)",
        },
        text: {
          primary: "#F1F5F9",
          secondary: "rgba(241,245,249,0.6)",
          muted: "rgba(241,245,249,0.35)",
        },
        border: "rgba(255,255,255,0.08)",
        success: "#10B981",
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        button: "14px",
        pill: "12px",
        input: "12px",
      },
      maxWidth: {
        mobile: "480px",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "dot-bounce": {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: "0.4" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.3s ease-out forwards",
        "fade-in": "fade-in 0.3s ease-out forwards",
        "pulse-slow": "pulse 1.2s ease-in-out infinite",
        "dot-bounce": "dot-bounce 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
