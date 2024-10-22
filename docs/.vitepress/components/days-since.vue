<template>
    <h2 v-html="title_modified"></h2>
    <h1 :style="{ color: textColor, fontFamily: 'Mojangles' }">
        {{ timeDifference }}
    </h1>
    <span v-html="description"></span>
</template>

<script setup>
    import { ref, watch } from 'vue';
    import { useData } from 'vitepress';

    const isDark = useData().isDark;
    const textColor = ref(isDark.value ? 'yellow' : 'darkblue');

    watch(isDark, (newVal) => {
        textColor.value = newVal ? 'yellow' : 'darkblue';
    });
</script>

<script>
    import moment from 'moment';
    import * as countdown from 'countdown';

    export default {
        data() {
            return {
                timeDifference: 0,
                title_modified: `${this.title} <span class="VPBadge info">${this.category}</span>`
            };
        },
        props: {
            date: {
                required: true
            },
            title: {
                required: true
            },
            description: {
                required: true
            },
            category: {
                required: true
            }
        },
        mounted() {
            this.interval = setInterval(() => {
                this.updateDiffs();
            }, 1000);

            this.updateDiffs();
        },
        destroyed() {
            clearInterval(this.interval);
        },
        methods: {
            updateDiffs() {
                //lets figure out our diffs
                this.timeDifference = countdown.default(
                    moment(new Date(this.date)).toDate(),
                    moment(new Date()).toDate(),
                    countdown.YEARS |
                        countdown.MONTHS |
                        countdown.DAYS |
                        countdown.HOURS |
                        countdown.MINUTES |
                        countdown.SECONDS
                );
            }
        }
    };
</script>

<style>
    @font-face {
        font-family: 'Mojangles';
        src: url('/Mojangles.ttf') format('truetype');
    }
</style>
