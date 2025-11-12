/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx}',
    './public/**/*.html'
  ],
  theme: {
    extend: {
      colors: {
        'magenta': {
          DEFAULT: '#C926F2',
          dark: '#A01EC8',
          darker: '#8B1FA8',
        },
        'mint': {
          DEFAULT: '#5EFFD8',
          dark: '#4DE5C5',
        },
        'lavender': {
          DEFAULT: '#9A94E7',
          light: '#B5B0F2',
        },
        'grey': {
          DEFAULT: '#949494',
          dark: '#2A2A2A',
          light: '#D4D4D4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter Tight', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'magenta': '0 6px 20px rgba(201, 38, 242, 0.4)',
        'mint': '0 6px 20px rgba(94, 255, 216, 0.4)',
      },
    },
  },
  plugins: [],
}
