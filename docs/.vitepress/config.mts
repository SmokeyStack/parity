import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: 'Minecraft Parity Differences!',
    description:
        'A site for features available in Java Edition but not in Bedrock Edition',
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config

        socialLinks: [
            { icon: 'github', link: 'https://github.com/SmokeyStack' },
            { icon: 'twitter', link: 'https://x.com/SmokeyStack_' }
        ]
    },
    cleanUrls: true,
    vite: {
        ssr: {
            noExternal: ['vuetify']
        }
    }
});
