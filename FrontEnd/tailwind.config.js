// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
      mono: ['"Fira Code"', '"Fira Mono"', 'monospace'],
    },
    },
  },
  plugins: [],
}