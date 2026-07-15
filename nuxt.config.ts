import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    colorMode: {
        classSuffix: ''
    },
    css: ['~/assets/css/tailwind.css'],
    devtools: { enabled: true },
    modules: ['shadcn-nuxt', '@nuxtjs/color-mode'],
    shadcn: {
        prefix: '',
        componentDir: '@/components/ui'
    },
    vite: {
        plugins: [tailwindcss()]
    }
});
