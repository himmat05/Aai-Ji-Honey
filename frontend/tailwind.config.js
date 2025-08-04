/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                'fly-bee': 'flyBee 6s ease-in-out infinite',
            },
            keyframes: {
                flyBee: {
                    '0%': { transform: 'translate(0px, 0px) rotate(0deg)' },
                    '25%': { transform: 'translate(30px, -10px) rotate(10deg)' },
                    '50%': { transform: 'translate(0px, 10px) rotate(-10deg)' },
                    '75%': { transform: 'translate(-30px, -10px) rotate(5deg)' },
                    '100%': { transform: 'translate(0px, 0px) rotate(0deg)' },
                },
            },
        },
    },
    plugins: [],
}
