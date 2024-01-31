import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            keyframes: {
                flip: {
                    '50%': { transform: 'rotateX(90deg)' },
                    '0%, 100%': { transform: 'rotateX(0)' },
                },
                pop: {
                    '20%': { transform: 'scale(1.08)' },
                    '0%, 100%': { transform: 'scale(1)' },
                },
            },
            animation: {
                flip: 'flip 500ms ease-in-out',
                pop: 'pop 130ms ease-in-out',
            },
            borderColor: {
                'zinc-light': 'rgb(86 87 88);',
                'zinc-dark': 'rgb(58 58 60);',
            },
            screens: {
                sm: '500px',
            },
        },
    },
    plugins: [
        plugin(function ({ matchUtilities, theme }) {
            matchUtilities(
                {
                    'animate-delay': value => ({
                        animationDelay: value,
                    }),
                },
                { values: theme('transitionDelay') }
            )
        }),
    ],
}
export default config
