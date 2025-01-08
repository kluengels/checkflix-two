import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		height: {
  			innerfull: 'calc(100dvh - 9rem)'
  		},
  		minHeight: {
  			innerfull: 'calc(100dvh - 9rem)'
  		},
  		fontFamily: {
  			display: [
  				'Carter One',
  				'cursive'
  			],
  			sans: [
  				'Nunito',
  				'sans-serif'
  			]
  		},
  		colors: {
  			decorative: 'hsl(var(--decorative))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },

  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("tailwindcss-animate"),require('tailwindcss-motion'),
    plugin(function ({ addUtilities }) {
      const fallbackHeightUtilities = {
        "@supports not (height: 100dvh)": {
          ".h-dvh": { height: "100vh" },
          ".min-h-dvh": { "min-height": "100vh" },
          ".max-h-dvh": { "max-height": "100vh" },
        },
        "@supports not (height: 100lvh)": {
          ".h-lvh": { height: "100vh" },
          ".min-h-lvh": { "min-height": "100vh" },
          ".max-h-lvh": { "max-height": "100vh" },
        },
        "@supports not (height: 100svh)": {
          ".h-svh": { height: "100vh" },
          ".min-h-svh": { "min-height": "100vh" },
          ".max-h-svh": { "max-height": "100vh" },
        },
      };

      addUtilities(fallbackHeightUtilities);
    }),
  ],
} satisfies Config;
