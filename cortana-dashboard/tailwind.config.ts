import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#050510",
        obsidian: "#0a0b18",
        plasma: "#8f5cff",
        aurora: "#37c8ff",
        starlight: "#f4f7ff",
        mist: "#9aa4c7",
      },
      boxShadow: {
        glow: "0 0 60px rgba(143, 92, 255, 0.35)",
        cyan: "0 0 48px rgba(55, 200, 255, 0.24)",
      },
      backgroundImage: {
        "cosmic-radial":
          "radial-gradient(circle at 20% 20%, rgba(143, 92, 255, 0.28), transparent 28%), radial-gradient(circle at 82% 8%, rgba(55, 200, 255, 0.22), transparent 24%), radial-gradient(circle at 50% 88%, rgba(255, 255, 255, 0.08), transparent 22%)",
      },
    },
  },
  plugins: [],
};

export default config;
