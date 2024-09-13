import { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';

import smokeystackDaysSince from '../components/days-since.vue';
import smokeystackDaysSinceTags from '../components/days-since-tags.vue';

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi
        }
    }
});

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.use(vuetify);
        app.component('smokeystackDaysSince', smokeystackDaysSince);
        app.component('smokeystackDaysSinceTags', smokeystackDaysSinceTags);
    }
} satisfies Theme;
