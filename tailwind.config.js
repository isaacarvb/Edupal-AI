/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1E242E",
        body: "#333A45",
        muted: "#5F6E7F",
        teal: { DEFAULT: "#0F766E" },
        warmblue: "#2F5D7C"
      }
    }
  },
  plugins: []
};
