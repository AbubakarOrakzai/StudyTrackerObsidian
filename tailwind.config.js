/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Base surfaces — warm charcoal, not pure black.
        bg: "#14151A",
        surface: "#1C1E24",
        "surface-hover": "#23262E",
        border: "#2A2D35",
        // Text
        ink: "#EDEBE6",
        "ink-muted": "#8B8D98",
        // Primary accent — muted avocado, not neon.
        avocado: {
          DEFAULT: "#8FAE6E",
          soft: "#6F8A57",
          bright: "#A9CC85",
        },
        // Secondary accent — warm coral, used for timer/break state.
        coral: {
          DEFAULT: "#E8875B",
          soft: "#C96D45",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.55 },
        },
        popIn: {
          "0%": { transform: "scale(0.9)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
      },
      animation: {
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "pop-in": "popIn 0.15s ease-out",
      },
    },
  },
  plugins: [],
};
