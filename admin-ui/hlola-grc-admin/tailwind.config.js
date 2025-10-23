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
        'hlola-blue': '#26558e',
        'hlola-cyan': '#41c3d6',
        'glass-bg': 'rgba(38, 85, 142, 0.1)',
        'glass-border': 'rgba(65, 195, 214, 0.2)',
        'glass-bg-dark': 'rgba(65, 195, 214, 0.1)',
        'glass-border-dark': 'rgba(38, 85, 142, 0.2)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hlola-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(65, 195, 214, 0.2) 25%, rgba(255, 255, 255, 0.7) 50%, rgba(38, 85, 142, 0.15) 100%)',
        'hlola-gradient-strong': 'linear-gradient(135deg, #26558e 0%, #41c3d6 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
