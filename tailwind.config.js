/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary, #e57341)',
          light: 'var(--color-primary-light, #f8a47f)',
          dark: 'var(--color-primary-dark, #c45a2f)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary, #0097b2)',
          light: 'var(--color-secondary-light, #33b3ca)',
          dark: 'var(--color-secondary-dark, #007a8f)',
        },
        accent: {
          DEFAULT: 'var(--color-accent, #eeb44e)',
          light: 'var(--color-accent-light, #f4c87a)',
          dark: 'var(--color-accent-dark, #d9a13c)',
        },
        tertiary: {
          DEFAULT: 'var(--color-tertiary, #6e936a)',
          light: 'var(--color-tertiary-light, #8aaa87)',
          dark: 'var(--color-tertiary-dark, #5a7857)',
        },
        highlight: {
          DEFAULT: 'var(--color-highlight, #e44041)',
          light: 'var(--color-highlight-light, #ea6c6d)',
          dark: 'var(--color-highlight-dark, #c13334)',
        },
        rich: {
          DEFAULT: 'var(--color-rich, #3e1311)',
          light: 'var(--color-rich-light, #5a2d2b)',
          dark: 'var(--color-rich-dark, #2a0d0c)',
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