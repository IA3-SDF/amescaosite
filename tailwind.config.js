module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        app: "var(--bg-app)",
        card: "var(--bg-card)",
        surface: "var(--bg-secondary)",
        textMain: "var(--text-main)",
        textBody: "var(--text-body)",
        muted: "var(--text-muted)",
        borderSubtle: "var(--border-subtle)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.45s ease-in both",
        "slide-down": "slideDown 0.38s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};
