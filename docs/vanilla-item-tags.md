---
title: Features Missing From Java
aside: false
---

This page is to document how long since Java Edition got a vanilla item tag and Bedrock Edition is still waiting for.

<span v-for="i in data.length">
    <smokeystackDaysSinceTags :date="new Date(data[i-1].date)" :title="data[i-1].title" :description="data[i-1].description" />
</span>

<script setup>
    function capitalizeFirstLetter(string) {
        return string.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('-');
    }
</script>

<script>
    import data from './assets/tags-items.json';

    function calculateTotalEntry(filter){
        let sum = 0;
        data.forEach((parity) => {
            if(parity.category==filter) sum++;
        });
        return sum;
    }

    export default {
        data: () => ({
            filters: []
        })
    };
</script>

<style>
    .v-label{
        color: var(--vp-c-text-1)
    }
</style>
