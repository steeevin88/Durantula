import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "white",
          "secondary": "#000000",
          "accent": "#000000",
          "neutral": "#000000",
          "base-100": "#000000",
          "info": "#67e8f9",
          "success": "#bef264",
          "warning": "#e29400",
          "error": "#e8195a",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
export default config;
