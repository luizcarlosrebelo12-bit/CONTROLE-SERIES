import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        base: {
          bg: "#0b0e14",
          card: "#12161f",
          border: "#1f2530",
        },
        accent: {
          luiz: "#4d8dff",
          kaly: "#e85d9c",
        },
      },
    },
  },
  plugins: [],
};
export default config;
