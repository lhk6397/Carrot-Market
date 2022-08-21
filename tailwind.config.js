/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ], // 우리가 이 경로에서 tailwindcss를 사용할 것임을 암시
  theme: {
    extend: {},
  },
  darkMode: "media", // media || class
  plugins: [require("@tailwindcss/forms")],
};
