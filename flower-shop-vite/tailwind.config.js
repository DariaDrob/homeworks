@type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                beige: {
                    50: '#F5F5F5',
                    100: '#EDEDED',
                },
            },
        },
    },
    plugins: [],
};