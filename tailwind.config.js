/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // This ensures Tailwind scans all JavaScript and TypeScript files inside the src folder
  ],
  theme: {
    extend: {}, // Add custom theme extensions if needed
  },
  plugins: [], // Add any Tailwind CSS plugins if needed
}
