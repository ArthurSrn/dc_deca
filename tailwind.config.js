/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                'base-neue': ['"Base Neue Trial"', 'Arial', 'sans-serif'],
            },
            colors: {
                primary: '#3643BA',
            },
        },
    },
    plugins: [],
} 