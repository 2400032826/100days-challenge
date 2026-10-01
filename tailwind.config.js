/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        arc: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          'card-hover': '#F1F5F9',
          border: '#E2E8F0',
          'border-light': '#F1F5F9',
          primary: '#2563EB',
          'primary-hover': '#1D4ED8',
          'primary-light': '#EFF6FF',
          text: '#0F172A',
          muted: '#64748B',
          subtle: '#94A3B8',
          success: '#16A34A',
          'success-light': '#F0FDF4',
          warning: '#F59E0B',
          'warning-light': '#FFFBEB',
          danger: '#DC2626',
          'danger-light': '#FEF2F2',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'arc': '0.75rem',    // 12px
        'arc-lg': '1rem',    // 16px
        'arc-xl': '1.25rem', // 20px
      },
      boxShadow: {
        'arc-card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'arc-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'arc-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      },
    },
  },
  plugins: [],
};
