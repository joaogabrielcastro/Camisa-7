import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        /** Verde campo do logo (mais saturado que o pinheiro anterior) */
        primary: {
          DEFAULT: "#008F5A",
          dark: "#006845",
          light: "#00B87A"
        },
        /** Prata / reflexo do logo — destaques, badges */
        secondary: {
          DEFAULT: "#BFC8D4",
          dark: "#9AA8B8",
          light: "#E8EEF3"
        },
        /** Realce em links e estados ativos */
        accent: "#00C46A",
        neutral: {
          100: "#FFFFFF",
          200: "#F3F5F7",
          300: "#D9DEE5",
          800: "#2A2A2A",
          900: "#0A0A0A"
        },
        success: "#008F5A",
        error: "#C45C62"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 1px 3px rgb(0 0 0 / 0.07), 0 1px 2px rgb(0 0 0 / 0.05)",
        glow: "0 0 40px rgb(0 179 120 / 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
