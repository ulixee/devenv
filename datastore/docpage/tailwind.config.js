module.exports = {
    content: ['./index.html', './src/**/*.{vue,js,ts}'],
    theme: {
        extend: {
            colors: {
                'ulixee-normal': '#AE33B0',
                'ulixee-verylight': '#F6EDF7',
            }
        }
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
};
//# sourceMappingURL=tailwind.config.js.map