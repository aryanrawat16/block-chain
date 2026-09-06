/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          500: "#4f46e5",
          600: "#4338ca",
          700: "#3730a3",
        },
        tint: {
          violet: { bg: "#EEEDFE", text: "#3C3489", icon: "#534AB7" },
          aqua: { bg: "#E1F5EE", text: "#085041", icon: "#0F6E56" },
          magenta: { bg: "#FBEAF0", text: "#72243E", icon: "#993556" },
          orange: { bg: "#FAECE7", text: "#712B13", icon: "#993C1D" },
          green: { bg: "#EAF3DE", text: "#27500A", icon: "#3B6D11" },
        },
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(79, 70, 229, 0.25)",
        "soft-lg": "0 25px 50px -12px rgba(79, 70, 229, 0.35)",
        glow: "0 0 0 1px rgba(255,255,255,0.4) inset, 0 20px 40px -15px rgba(79, 70, 229, 0.4)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        "mesh": "radial-gradient(at 20% 20%, rgba(129,140,248,0.25) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(167,139,250,0.25) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(196,181,253,0.25) 0px, transparent 50%)",
      },
    },
  },
  plugins: [],
};
