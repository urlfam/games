/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gaming: {
          dark: '#1a1a2e',
          darker: '#16162a',
          purple: '#8b5cf6',
          'purple-light': '#a78bfa',
          'purple-dark': '#7c3aed',
        },
        news: {
          light: '#ffffff',
          gray: '#f5f5f5',
          'text-dark': '#1f2937',
          'text-light': '#6b7280',
        },
      },
    },
  },
  plugins: [],
};
