/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Segoe UI', 'sans-serif'],
        forum: ['Segoe UI', 'sans-serif'],
        poppins: ['Segoe UI', 'sans-serif'],
        segoe: ['Segoe UI', 'sans-serif'],
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      colors: {
        'hotel': {
          'dark': '#2D2C2C',
          'input': '#575656',
          'gold': '#BF9766',
          // Booking bar (Figma-style luxury hotel)
          'booking-card': '#2b2727',
          'booking-field': '#3a1b1b',
          'booking-field-border': '#5c2e2e',
        }
      }
    },
  },
  plugins: [],
};
