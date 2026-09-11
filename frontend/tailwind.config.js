/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090d16",
        surface: "#0d1322",
        surfaceHover: "#121a2e",
        borderDark: "#1e293b",
        tacticalCyan: "#06b6d4",
        tacticalBlue: "#3b82f6",
        tacticalAmber: "#f59e0b",
        tacticalRed: "#ef4444",
        tacticalGreen: "#10b981",
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
};
