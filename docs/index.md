---
title: Features Missing From Java
aside: false
---

This page is to document how long since Java Edition got a feature and Bedrock Edition is still waiting for. Select the buttons below to filter each parity category:

<v-card flat color="var(--v-background)">
    <v-card-text>
        <v-row>
            <v-col cols="12" md="4">
                <v-switch v-model="filters" color="primary" :label="`Add-Ons (${calculateTotalEntry('add-ons')})`" value="add-ons" hide-details>></v-switch>
            </v-col>
            <v-col cols="12" md="4">
                <v-switch v-model="filters" color="primary" :label="`Commands (${calculateTotalEntry('commands')})`" value="commands" hide-details></v-switch>
            </v-col>
            <v-col cols="12" md="4">
                <v-switch v-model="filters" color="primary" :label="`General (${calculateTotalEntry('general')})`" value="general" hide-details></v-switch>
            </v-col>
        </v-row>
    </v-card-text>
</v-card>

<span v-for="i in data.length">
    <span v-if="filters.some((value) => [data[i-1].category].includes(value))">
        <smokeystackDaysSince :date="new Date(data[i-1].date)" :title="data[i-1].title" :description="data[i-1].description" :category="capitalizeFirstLetter(data[i-1].category)" />
    </span>
</span>

<script setup>
    function capitalizeFirstLetter(string) {
        return string.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('-');
    }
</script>

<script>
    import data from './assets/data.json';

    function calculateTotalEntry(filter){
        let sum = 0;
        data.forEach((parity) => {
            if(parity.category==filter) sum++;
        });
        return sum;
    }

    export default {
        data: () => ({
            filters: ['add-ons', 'commands', 'general']
        })
    };
</script>

<style>
    .v-label{
        color: var(--vp-c-text-1)
    }
</style>
