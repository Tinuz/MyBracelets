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
          50: '#FFF4F1',
          100: '#FFE6DC', 
          200: '#FFCDB9',
          300: '#FFB396',
          400: '#FF8A65',
          500: '#FF6B35',
          600: '#E5552B',
          700: '#CC4020',
          800: '#B32A16',
          900: '#99140D',
        },
        secondary: {
          50: '#F0FDFC',
          100: '#CCFBF1',
          200: '#99F6E4', 
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#20B2AA',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        accent: {
          yellow: '#FFD700',
          red: '#DC2626',
          gold: '#F59E0B',
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
        'gradient-brand': 'linear-gradient(135deg, #FF8A65 0%, #2DD4BF 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FF8A65 0%, #FFB396 100%)',
        'gradient-cool': 'linear-gradient(135deg, #2DD4BF 0%, #5EEAD4 100%)',
        'bg-warm': 'linear-gradient(135deg, #FFF4F1 0%, #F0FDFC 100%)',
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backgroundColor: {
        'soft': '#FEFCFB',
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
          "@apply bg-black text-white hover:bg-gray-800 border-transparent": {},
        },
        ".btn-secondary": {
          "@apply bg-white text-gray-900 hover:bg-gray-50 border-gray-200": {},
        },
      });
    },
  ],
};

export default config;