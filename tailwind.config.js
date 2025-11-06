/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2c3e50',
        secondary: '#3498db',
        accent: '#e74c3c',
        success: '#27ae60',
        'light-bg': '#ecf0f1',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(rgba(44, 62, 80, 0.9), rgba(52, 152, 219, 0.9))',
        'card-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'page-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}