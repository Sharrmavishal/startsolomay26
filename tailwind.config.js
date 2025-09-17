/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1D3A6B',
        },
        cta: {
          DEFAULT: '#EEB44E', /* Golden Yellow - primary CTA */
          dark: '#D49E3C',
          text: '#333333',
          secondary: '#1D3A6B', /* Navy - secondary CTA */
          'secondary-dark': '#152A4F',
          accent: '#5FA6A0', /* Teal - accent CTA */
          'accent-dark': '#4A8B85',
        },
        yellow: {
          DEFAULT: '#EEB44E',
          dark: '#D49E3C',
        },
        teal: {
          DEFAULT: '#5FA6A0',
        },
        sky: {
          DEFAULT: '#8FC2F2',
        },
        steel: {
          DEFAULT: '#607D8B',
        },
        white: {
          DEFAULT: '#FFFFFF',
        },
        gray: {
          50: '#F8F9FA',
          100: '#E4E5E7',
          200: '#C7CBD3',
          900: '#333333',
        },
        orange: {
          DEFAULT: '#e57341',
        },
        red: {
          DEFAULT: '#e44041',
        },
        'dark-green': {
          DEFAULT: '#009762',
        },
        'olive-green': {
          DEFAULT: '#6c936a',
        },
        'dark-brown': {
          DEFAULT: '#3e1311',
        },
      },
      fontFamily: {
        heading: 'var(--font-heading, sans-serif)',
        body: 'var(--font-body, sans-serif)',
      },
      textDecoration: {
        'line-through': 'line-through 2px',
      },
      textDecorationThickness: {
        2: '2px',
        3: '3px',
      },
      textDecorationColor: {
        gray: {
          400: '#9ca3af',
          500: '#6b7280',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'inherit',
            a: {
              color: 'var(--color-primary)',
              '&:hover': {
                color: 'var(--color-primary-dark)',
              },
            },
            h1: {
              fontFamily: 'var(--font-heading)',
            },
            h2: {
              fontFamily: 'var(--font-heading)',
            },
            h3: {
              fontFamily: 'var(--font-heading)',
            },
            h4: {
              fontFamily: 'var(--font-heading)',
            },
          },
        },
      },
    },
  },
  plugins: [],
};