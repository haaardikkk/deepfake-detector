/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        primary:     '#070c1a',
        surface:     '#0d1224',
        secondary:   '#111827',
        accent:      '#6366f1',
        accentHover: '#4f46e5',
        neonBlue:    '#00d4ff',
        neonPurple:  '#a855f7',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      transitionDuration: {
        '400': '400ms',
      },
      /* Explicitly define which properties may animate to suppress layout-trigger warnings */
      transitionProperty: {
        'colors-shadow': 'color, background-color, border-color, box-shadow',
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
}
