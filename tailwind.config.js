/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf6f3',
          100: '#f3e8e0',
          200: '#e6d0c2',
          300: '#d4b09a',
          400: '#c08d70',
          500: '#a76f52',
          600: '#8f5a42',
          700: '#754838',
          800: '#613d32',
          900: '#52352c',
        },
        ink: '#1a1412',
        cream: '#14110f',
        sand: '#1b1714',
        ivory: '#f4ece4',
        panel: '#241f1b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        script: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 20px 50px -24px rgba(26, 20, 18, 0.45)',
      },
    },
  },
  plugins: [],
}
