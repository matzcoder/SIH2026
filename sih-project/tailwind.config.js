/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Spec Warm Terracotta & Rust Palette
        'bg-base': '#FBF3EC',
        'bg-surface': '#F5E6D8',
        'bg-surface-raised': '#FFF9F2',
        'border-warm': '#E4CBB4',
        'border': '#E4CBB4',
        'text-primary': '#3B2A22',
        'text-secondary': '#7A5C48',
        'primary': {
          DEFAULT: '#C1502D',
          hover: '#A63F22',
        },
        'accent': '#B7410E',
        'success-warm': '#7A8450',
        'warning-warm': '#D98E04',
        'error-warm': '#A63A32',
        'info-warm': '#8A6D57',
        // Dark theme tokens from spec
        'dark-bg-base': '#1F1512',
        'dark-bg-surface': '#2A1F1A',
        'dark-text-primary': '#F5E9DD',
        'dark-primary': '#E2725B',
        'dark-accent': '#D9773F',
      },
      borderRadius: {
        'card': '10px',
        'btn': '8px',
        'input': '8px',
      },
      boxShadow: {
        'warm-sm': '0 2px 6px rgba(139, 69, 19, 0.08)',
        'warm': '0 2px 8px rgba(139, 69, 19, 0.12)',
        'warm-md': '0 4px 14px rgba(139, 69, 19, 0.10)',
        'warm-lg': '0 8px 24px rgba(139, 69, 19, 0.14)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Lora', 'Georgia', 'serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}
