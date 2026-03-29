/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        blackbase: "#000000",
        accent: "#d2691e",
        card: "#111111",
        darkline: "#2a2a2a",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Manrope'", "sans-serif"],
      },
      boxShadow: {
        accent: "0 0 30px rgba(210, 105, 30, 0.32)",
        card: "0 18px 50px rgba(0, 0, 0, 0.45)",
      },
      backgroundImage: {
        "accent-radial": "radial-gradient(circle at center, rgba(210, 105, 30, 0.22) 0%, rgba(210, 105, 30, 0) 70%)",
      },
    },
  },
  plugins: [],
};
