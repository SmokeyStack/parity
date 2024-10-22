<template>
    <h2 v-html="title_modified"></h2>
    <h1 :style="{ color: textColor, fontFamily: 'Mojangles' }">
        {{ timeDifference }}
    </h1>
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
    import countdown from '../libs/countdown';

    export default {
        data() {
            return {
                timeDifference: 0,
                title_modified: `${this.title} <span class="VPBadge info">${this.category}</span>`
            };
        },
        props: {
            introduced: {
                required: true
            },
            implemented: {
                required: true
            },
            title: {
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
                this.timeDifference = countdown(
                    moment(new Date(this.implemented)).toDate(),
                    moment(new Date(this.introduced)).toDate(),
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
