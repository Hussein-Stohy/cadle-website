/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'tajawal': ['Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [
    require("tailwindcss-rtl"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
}
