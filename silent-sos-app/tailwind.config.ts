import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0B0F17",
        charcoal: "#131B2E",
        slateCard: "#1A233A",
        crimson: {
          DEFAULT: "#E11D48",
          dark: "#9F1239",
        },
      },
    },
  },
  plugins: [],
};
export default config;

