<template>
    <h1 style="color: yellow; font-family: Mojangles">
        <template v-if="years > 0"> {{ years }} years </template>
        <template v-if="months > 0"> {{ months }} months </template>
        <template v-if="days > 0"> {{ days }} days </template>
        <template v-if="hours > 0"> {{ hours }} hours </template>
        <template v-if="seconds == 0"> and </template>
        <template v-if="minutes > 0"> {{ minutes }} minutes </template>
        <template v-if="seconds > 0"> and {{ seconds }} seconds </template>
    </h1>
</template>

<script>
    export default {
        data() {
            return {
                interval: null,
                years: 0,
                months: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                intervals: {
                    second: 1000,
                    minute: 1000 * 60,
                    hour: 1000 * 60 * 60,
                    day: 1000 * 60 * 60 * 24,
                    month: 1000 * 60 * 60 * 24 * 30,
                    year: 1000 * 60 * 60 * 24 * 365
                }
            };
        },
        props: {
            date: {
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
                let diff = Math.abs(Date.now() - this.date.getTime());
                this.years = Math.floor(diff / this.intervals.year);
                diff -= this.years * this.intervals.year;
                this.months = Math.floor(diff / this.intervals.month);
                diff -= this.months * this.intervals.month;
                this.days = Math.floor(diff / this.intervals.day);
                diff -= this.days * this.intervals.day;
                this.hours = Math.floor(diff / this.intervals.hour);
                diff -= this.hours * this.intervals.hour;
                this.minutes = Math.floor(diff / this.intervals.minute);
                diff -= this.minutes * this.intervals.minute;
                this.seconds = Math.floor(diff / this.intervals.second);
            }
        }
    };
</script>

<style>
    @font-face {
        font-family: 'Mojangles';
        src: url('../../Mojangles.ttf') format('ttf');
    }
</style>
