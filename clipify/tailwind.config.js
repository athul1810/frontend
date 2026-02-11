/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          purple: '#7F30D8',
          'purple-dark': '#6A3DD2',
          'purple-light': '#A98EDF',
          lime: '#CFFF00',
          'lime-dim': '#94F200',
          coral: '#FF5B4D',
          red: '#FF4000',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
