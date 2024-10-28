/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}", // Search within the 'src' folder for .html and .js files
    "./*.html",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      backgroundColor: {
        "main-color": "#0D0D0D",
      },
      boxShadow: {
        "custom-shadow": "0 0 0 4px rgba(13, 110, 253, 0.25)",
      },
      fontSize: {
        titleSize: "28px",
      },
    },
  },
  plugins: [],
};
