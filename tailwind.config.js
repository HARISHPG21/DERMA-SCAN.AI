/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'selector', // support data-theme / class switching
  theme: {
    extend: {
      colors: {
        clinical: {
          darkBg: '#060913',
          lightBg: '#f8fafc',
          primary: '#0ea5e9',
          secondary: '#10b981',
          warning: '#f59e0b',
          danger: '#f43f5e'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
