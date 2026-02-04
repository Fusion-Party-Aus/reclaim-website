/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}', './public/**/*.html'],
  theme: {
    extend: {
      colors: {
        magenta: {
          DEFAULT: '#C926F2',
          dark: '#A01EC8',
          darker: '#8B1FA8',
          bright: '#E91E63',
        },
        mint: {
          DEFAULT: '#5EFFD8',
          dark: '#4DE5C5',
          bright: '#00E5FF',
        },
        lavender: {
          DEFAULT: '#9A94E7',
          light: '#B5B0F2',
          bright: '#E1BEE7',
        },
        grey: {
          DEFAULT: '#949494',
          dark: '#2A2A2A',
          light: '#D4D4D4',
        },
        yellow: {
          DEFAULT: '#FFED00',
          bright: '#FFEB3B',
        },
        red: '#FF3B30',
        orange: '#FF9500',
        blue: '#007AFF',
        green: '#34C759',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Archivo Black', 'Anton', 'Impact', 'sans-serif'],
        display: ['Space Grotesk', 'Bebas Neue', 'Archivo Black', 'sans-serif'],
        accent: ['Chakra Petch', 'Inter', 'sans-serif'],
        ultra: ['Anton', 'Bebas Neue', 'Impact', 'sans-serif'],
      },
      boxShadow: {
        brutal: '10px 10px 0px 0px #000000',
        'brutal-sm': '5px 5px 0px 0px #000000',
        'brutal-lg': '15px 15px 0px 0px #000000',
        'brutal-xl': '20px 20px 0px 0px #000000',
        'brutal-magenta': '10px 10px 0px 0px #C926F2',
        'brutal-mint': '10px 10px 0px 0px #5EFFD8',
        'brutal-yellow': '10px 10px 0px 0px #FFED00',
      },
    },
  },
  plugins: [],
}
