"
import scrollbar from "tailwind-scrollbar"
import animate from "tailwindcss-animate"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue,html}",
    "node_modules/@rjsf/shadcn/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto Variable", "sans-serif"],
        prompt: ["Prompt", "sans-serif"],
      },
      
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [ require('tailwind-scrollbar')({
                nocompatible: true,
                preferredStrategy: 'pseudoelements',
            }),, animate],
} 