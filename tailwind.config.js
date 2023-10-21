/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        'elven': ['elven', 'serif'],
        'gin': ['gin', 'serif'],
        'balboa': ['balboa', 'sans-serif'],
        'balboa-black': ['balboa-black', 'sans'],
        'haunted': ['haunted', 'serif'],
        'herb': ['herb', 'serif'],
        'herb-bold': ['herb-bold', 'serif'],
        'herb-condensed': ['herb-condensed', 'serif'],
        'herb-condensed-bold': ['herb-condensed-bold', 'serif'],
        'ink': ['ink', 'serif'],
        'legal-heading': ['legal-heading', 'serif'],
        'playwright': ['playwright', 'serif'],
        'spooky': ['spooky', 'serif'],
        'lithotype': ['lithotype', 'serif'],
        'fit': ['fit', 'sans'],
        'blix': ['blix', 'serif'],
        'oblique': ['oblique', 'sans'],
        'tech': ['tech', 'serif'],
        'tech-thin': ['tech-thin', 'serif'],
        'gerald': ['gerald', 'serif'],
        'gerald-italic': ['gerald-italic', 'serif'],
        'gerald-black': ['gerald-black', 'serif'],
        'gerald-black-italic': ['gerald-black-italic', 'serif'],
        'gerald-thin': ['gerald-thin', 'serif'],
        'gerald-thin-italic': ['gerald-thin-italic', 'serif'],
      },
    },
  },
  daisyui: {
    themes: [
      {
        red: {
          primary: "#F22B29",

          secondary: "#3F88C5",

          accent: "#D72638",

          neutral: "#D3D5D4",

          "base-100": "#140F2D",

          info: "#F59290",

          success: "#FFFFFF",

          warning: "#000000",

          error: "#76B3E6",
        },

        methyleneBlue: {
          primary: "#1d4ed8",

          secondary: "#7dd3fc",

          accent: "#bae6fd",

          neutral: "#1e40af",

          "base-100": "#1e3a8a",

          info: "#93c5fd",

          success: "#0284c7",

          warning: "#1e3a8a",

          error: "#38bdf8",
        },
      },
      "business",
      "cmyk",
      "dracula",
      "fantasy",
      "wireframe",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "valentine",
      "halloween",
      "lofi",
      "winter",
      "autumn",
      "pastel",
      "retro",
      "garden",
      "black",
      "luxury",
      "aqua",
      "night",
      "coffee",
      "acid",
      "forest",
      "cyberpunk",
      "lemonade",
    ],
  },
  plugins: [require("daisyui")],
};
