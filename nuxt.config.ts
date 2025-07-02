import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
    compatibilityDate: '2025-05-15',
    devtools: { enabled: true },
    css: ['~/assets/css/tailwind.css'],
    vite: {
        plugins: [tailwindcss()]
    },
    modules: ['shadcn-nuxt', '@nuxtjs/color-mode'],
    colorMode: {
        classSuffix: ''
    }
});
