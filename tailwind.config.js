/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-fast': 'pulse 1s infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

