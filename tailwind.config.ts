import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
  mode: "jit",
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        rubik: ["Rubik Iso", "sans-serif"],
        serif: ["Noto Serif Georgian", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-img": "url('../assets/images/auth-background.png')",
      },
    },
  },
  plugins: [
    nextui({
      themes: {
        light: {
          layout: {},
          colors: {
            primary: {
              DEFAULT: "#005898",
              foreground: "#FFFFFF",
            },
            secondary:{
              DEFAULT: "#000000"
            }
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#005898",
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#FFF",
            },
          },
        },
      },
    }),
  ],
};
export default config;
