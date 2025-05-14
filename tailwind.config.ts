/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // ✅ App Router
    "./pages/**/*.{js,ts,jsx,tsx}", // (opsional)
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{css}" // jika CSS di /styles
  ],
  theme: {
    extend: {}
  },
  plugins: []
};
