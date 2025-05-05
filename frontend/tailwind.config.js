module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8A2BE2', 
          light: '#9D4EDD',
          dark: '#6A0DAD',
        },
        secondary: {
          DEFAULT: '#1E1E1E',
          light: '#2D2D2D',
          dark: '#121212',
        },
        white: {
          DEFAULT: '#FFFFFF',
          off: '#F5F5F5',
        }
      },
    },
  },
  plugins: [],
};