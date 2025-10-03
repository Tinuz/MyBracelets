import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FAF5F0',   // Zeer licht champagne
          100: '#F7E7CE',  // Licht champagne
          200: '#EDD9BF',  // Champagne
          300: '#E4CAA7',  // Zacht beige
          400: '#D4AF7E',  // Rose gold light
          500: '#C19368',  // Rose gold (main)
          600: '#A87D5A',  // Rose gold dark
          700: '#8C6848',  // Bronze
          800: '#6F5238',  // Deep bronze
          900: '#4A3625',  // Chocolate
        },
        secondary: {
          50: '#FDF9F7',   // Bijna wit
          100: '#FAF6F3',  // Warm white
          200: '#F5F3F0',  // Off white
          300: '#EBE8E5',  // Light grey
          400: '#D6D3CF',  // Soft grey
          500: '#B8B5B1',  // Medium grey
          600: '#938F8B',  // Dark grey
          700: '#6E6A66',  // Charcoal
          800: '#4A4744',  // Dark charcoal
          900: '#2C2418',  // Warm black
        },
        accent: {
          rose: '#B76E79',      // Deep rose
          gold: '#C9A05F',      // Gold
          copper: '#C87359',    // Copper
          pearl: '#F0EBE6',     // Pearl white
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'Times New Roman', 'serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        'brand': '1.5rem',
        'brand-sm': '1rem',
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(0, 0, 0, 0.08)',
        'medium': '0 20px 40px rgba(0, 0, 0, 0.12)',
        'strong': '0 25px 50px rgba(0, 0, 0, 0.15)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #F7E7CE 0%, #D4AF7E 50%, #B76E79 100%)',
        'gradient-warm': 'linear-gradient(135deg, #F7E7CE 0%, #EDD9BF 100%)',
        'gradient-rose': 'linear-gradient(135deg, #D4AF7E 0%, #C19368 100%)',
        'bg-warm': 'linear-gradient(135deg, #FAF5F0 0%, #F7E7CE 100%)',
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backgroundColor: {
        'soft': '#FAF5F0',
      }
    },
  },
  plugins: [
    function ({ addComponents }: any) {
      addComponents({
        ".btn": {
          "@apply inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50": {},
        },
        ".btn-primary": {
          "@apply bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 border-transparent shadow-md hover:shadow-lg transition-all": {},
        },
        ".btn-secondary": {
          "@apply bg-white text-primary-700 hover:bg-primary-50 border-2 border-primary-400 hover:border-primary-500 transition-all": {},
        },
      });
    },
  ],
};

export default config;