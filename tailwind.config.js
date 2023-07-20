/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'input': ['']
      }
    },
  },
  daisyui: {
    themes: [
      {
        red: {
        
          "primary": "#F22B29",
                  
          "secondary": "#3F88C5",
                  
          "accent": "#D72638",
                  
          "neutral": "#D3D5D4",
                  
          "base-100": "#140F2D",
                  
          "info": "#F59290",
                  
          "success": "#FFFFFF",
                  
          "warning": "#000000",
                  
          "error": "#76B3E6",
        },

        methyleneBlue: {
        
          "primary": "#1d4ed8",
                  
          "secondary": "#7dd3fc",
                  
          "accent": "#bae6fd",
                  
          "neutral": "#1e40af",
                  
          "base-100": "#1e3a8a",
                  
          "info": "#93c5fd",
                  
          "success": "#0284c7",
                  
          "warning": "#1e3a8a",
                  
          "error": "#38bdf8",
        },
      },
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
  plugins: [require('daisyui')],
}

