/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: { 900: "#040810", 800: "#0A0F1E", 700: "#0F1729", 600: "#141F38" },
        cyan: "#00D4FF",
        bio: "#00FF9D",
        alert: "#FF4444",
        amber: "#FFB800",
        glass: "rgba(255,255,255,0.04)",
        border: "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        mono: ["IBM Plex Mono", "monospace"],
        display: ["Syne", "sans-serif"],
        body: ["Inter", "sans-serif"],
      }
    },
  },
  plugins: [],
}
