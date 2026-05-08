/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fbi-black': '#0a0a0a',
        'fbi-gray': '#1a1a1a',
        'fbi-dark': '#111111',
        'fbi-red': '#8b0000',
        'fbi-red-light': '#b30000',
        'fbi-blue': '#00ffff',
        'fbi-blue-dark': '#008b8b',
      },
      backgroundImage: {
        'cyber-grid': "radial-gradient(circle, rgba(0, 255, 255, 0.1) 1px, transparent 1px)",
      },
      boxShadow: {
        'neon-blue': '0 0 5px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.2)',
        'neon-red': '0 0 5px rgba(139, 0, 0, 0.5), 0 0 20px rgba(139, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}
