import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#4A90E2',
          light: '#6BA3E8',
          dark: '#3A7BC8',
        },
        success: {
          DEFAULT: '#50C878',
          light: '#7DD99E',
          dark: '#3DA55E',
        },
        warning: {
          DEFAULT: '#FFB347',
          light: '#FFC670',
          dark: '#E69A2E',
        },
        error: {
          DEFAULT: '#E74C3C',
          light: '#EC7063',
          dark: '#C0392B',
        },
        background: {
          DEFAULT: '#F0F0F3',
          light: '#F8F8FA',
          dark: '#E8E8EB',
        },
      },
      boxShadow: {
        'neu-raised': '8px 8px 16px #d1d1d4, -8px -8px 16px #ffffff',
        'neu-pressed': 'inset 4px 4px 8px #d1d1d4, inset -4px -4px 8px #ffffff',
        'neu-flat': '4px 4px 8px #d1d1d4, -4px -4px 8px #ffffff',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
