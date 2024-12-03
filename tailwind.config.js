/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'rgb(55 65 81)',
            '[class~="lead"]': {
              color: 'rgb(75 85 99)',
            },
            a: {
              color: 'rgb(var(--primary))',
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                color: 'rgb(var(--primary) / 0.8)',
              },
            },
            strong: {
              color: 'rgb(31 41 55)',
            },
            'ol[type="A"]': {
              '--list-counter-style': 'upper-alpha',
            },
            'ol[type="a"]': {
              '--list-counter-style': 'lower-alpha',
            },
            'ol[type="A" s]': {
              '--list-counter-style': 'upper-alpha',
            },
            'ol[type="a" s]': {
              '--list-counter-style': 'lower-alpha',
            },
            'ol[type="I"]': {
              '--list-counter-style': 'upper-roman',
            },
            'ol[type="i"]': {
              '--list-counter-style': 'lower-roman',
            },
            'ol[type="I" s]': {
              '--list-counter-style': 'upper-roman',
            },
            'ol[type="i" s]': {
              '--list-counter-style': 'lower-roman',
            },
            'ol[type="1"]': {
              '--list-counter-style': 'decimal',
            },
            'ol > li': {
              paddingLeft: '1.625em',
            },
            'ol > li::before': {
              right: 'calc(100% - 1.25em)',
              width: '1.25em',
              height: '1.25em',
              textAlign: 'right',
              counterIncrement: 'list-number',
              content: 'counter(list-number, var(--list-counter-style, decimal)) "."',
              fontFamily: 'var(--font-serif)',
              color: 'rgb(107 114 128)',
              fontWeight: '400',
            },
            'ul > li': {
              paddingLeft: '1.625em',
            },
            'ul > li::before': {
              width: '0.375em',
              height: '0.375em',
              top: 'calc(0.875em - 0.1875em)',
              left: '0.25em',
              borderRadius: '50%',
              backgroundColor: 'rgb(156 163 175)',
            },
            hr: {
              borderColor: 'rgb(229 231 235)',
              borderTopWidth: 1,
              marginTop: '3em',
              marginBottom: '3em',
            },
            blockquote: {
              fontWeight: '500',
              fontStyle: 'italic',
              color: 'rgb(55 65 81)',
              borderLeftWidth: '0.25rem',
              borderLeftColor: 'rgb(229 231 235)',
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
              marginTop: '1.6em',
              marginBottom: '1.6em',
              paddingLeft: '1em',
            },
            h1: {
              color: 'rgb(17 24 39)',
              fontWeight: '800',
              fontSize: '2.25em',
              marginTop: '0',
              marginBottom: '0.8888889em',
              lineHeight: '1.1111111',
            },
            h2: {
              color: 'rgb(17 24 39)',
              fontWeight: '700',
              fontSize: '1.5em',
              marginTop: '2em',
              marginBottom: '1em',
              lineHeight: '1.3333333',
            },
            h3: {
              color: 'rgb(17 24 39)',
              fontWeight: '600',
              fontSize: '1.25em',
              marginTop: '1.6em',
              marginBottom: '0.6em',
              lineHeight: '1.6',
            },
            h4: {
              color: 'rgb(17 24 39)',
              fontWeight: '600',
              marginTop: '1.5em',
              marginBottom: '0.5em',
              lineHeight: '1.5',
            },
            img: {
              marginTop: '2em',
              marginBottom: '2em',
            },
            video: {
              marginTop: '2em',
              marginBottom: '2em',
            },
            figure: {
              marginTop: '2em',
              marginBottom: '2em',
            },
            'figure > *': {
              marginTop: '0',
              marginBottom: '0',
            },
            figcaption: {
              color: 'rgb(107 114 128)',
              fontSize: '0.875em',
              lineHeight: '1.4285714',
              marginTop: '0.8571429em',
            },
            code: {
              color: 'rgb(var(--primary))',
              fontWeight: '600',
              fontSize: '0.875em',
            },
            'code::before': {
              content: '"`"',
            },
            'code::after': {
              content: '"`"',
            },
            'a code': {
              color: 'rgb(var(--primary))',
            },
            pre: {
              color: 'rgb(229 231 235)',
              backgroundColor: 'rgb(31 41 55)',
              overflowX: 'auto',
              fontWeight: '400',
              fontSize: '0.875em',
              lineHeight: '1.7142857',
              marginTop: '1.7142857em',
              marginBottom: '1.7142857em',
              borderRadius: '0.375rem',
              paddingTop: '0.8571429em',
              paddingRight: '1.1428571em',
              paddingBottom: '0.8571429em',
              paddingLeft: '1.1428571em',
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              padding: '0',
              fontWeight: '400',
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              lineHeight: 'inherit',
            },
            'pre code::before': {
              content: 'none',
            },
            'pre code::after': {
              content: 'none',
            },
          },
        },
        custom: {
          css: {
            '--tw-prose-body': 'rgb(55 65 81)',
            '--tw-prose-headings': 'rgb(17 24 39)',
            '--tw-prose-lead': 'rgb(107 114 128)',
            '--tw-prose-links': 'rgb(124 58 237)',
            '--tw-prose-bold': 'rgb(17 24 39)',
            '--tw-prose-counters': 'rgb(55 65 81)',
            '--tw-prose-bullets': 'rgb(107 114 128)',
            '--tw-prose-hr': 'rgb(229 231 235)',
            '--tw-prose-quotes': 'rgb(17 24 39)',
            '--tw-prose-quote-borders': 'rgb(229 231 235)',
            '--tw-prose-captions': 'rgb(107 114 128)',
            '--tw-prose-code': 'rgb(17 24 39)',
            '--tw-prose-pre-code': 'rgb(229 231 235)',
            '--tw-prose-pre-bg': 'rgb(17 24 39)',
            '--tw-prose-th-borders': 'rgb(209 213 219)',
            '--tw-prose-td-borders': 'rgb(229 231 235)',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
