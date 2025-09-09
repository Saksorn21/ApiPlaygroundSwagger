export default {
  content: ['index.html', './src/**/*.{js,jsx,ts,tsx,vue,html}', "node_modules/@rjsf/shadcn/src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: ['class'],
  theme: {
     extend: {
          screens: {
            portrait: { raw: "(orientation: portrait)" },
            landscape: { raw: "(orientation: landscape)" },
          },
        }
  },
  plugins: [require('tailwindcss-textshadow'), require('tailwind-scrollbar'),],
};
