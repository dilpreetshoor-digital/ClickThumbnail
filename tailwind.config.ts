import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-ibm-plex-mono)", "var(--font-inconsolata)", "monospace"],
      },
      colors: {
        canvas: "var(--bg-canvas)",
        surface: "var(--bg-surface)",
        hover: "var(--bg-hover)",
        ink: "var(--text-primary)",
        muted: "var(--text-secondary)",
        subtle: "var(--text-muted)",
        line: "var(--border-color)",
        accent: "var(--accent-green)",
        danger: "var(--accent-red)",
      },
    },
  },
  plugins: [],
};

export default config;
