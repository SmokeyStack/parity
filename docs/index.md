---
title: Features Missing From Java
aside: false
---

This page is to document how long since Java Edition got a feature and Bedrock Edition is still waiting for.

<v-chip-group v-model="filters" column multiple>
    <v-chip text="Add-Ons" variant="outlined" filter></v-chip>
    <v-chip text="Commands" variant="outlined" filter></v-chip>
    <v-chip text="General" variant="outlined" filter></v-chip>
</v-chip-group>

<span v-if="filters.some((value) => ['General'].includes(getTagName(value)))">

## Entities With Passengers Can Use Portals <Badge type="info" text="General" />

<smokeystackDaysSince :date="new Date('2024-05-29T10:03:00')" /> since Java got the ability for entities with passengers to use portals and Bedrock has not.
</span>

<span v-if="filters.some((value) => ['Add-Ons'].includes(getTagName(value)))">

## Custom Records Playing Custom Sounds <Badge type="info" text="Add-Ons" />

<smokeystackDaysSince :date="new Date('2024-05-22T10:47:00')" /> since Java's record component can play custom sounds and Bedrock cannot. It is good to note that the record component has existed in Bedrock since 1.16.100, but only limited to vanilla sounds.
</span>

<span v-if="filters.some((value) => ['Add-Ons'].includes(getTagName(value)))">

## Data Driven Enchantments <Badge type="info" text="Add-Ons" />

<smokeystackDaysSince :date="new Date('2024-05-03')" /> since Java got data driven enchantments and Bedrock has not.
</span>

<span v-if="filters.some((value) => ['Add-Ons'].includes(getTagName(value)))">

## Data Driven Painting Variants <Badge type="info" text="Add-Ons" />

<smokeystackDaysSince :date="new Date('2024-05-03')" /> since Java got data driven painting variants and Bedrock has not.
</span>

<span v-if="filters.some((value) => ['Add-Ons'].includes(getTagName(value)))">

## Data Driven Vanilla Items <Badge type="info" text="Add-Ons" />

<smokeystackDaysSince :date="new Date('2024-02-28')" /> since Java got data driven vanilla items and Bedrock has not. It is good to note that vanilla food items are data driven on Bedrock.
</span>

<span v-if="filters.some((value) => ['Add-Ons'].includes(getTagName(value)))">

## Data Driven Banner Patterns <Badge type="info" text="Add-Ons" />

<smokeystackDaysSince :date="new Date('2024-03-06')" /> since Java got data driven banner patterns and Bedrock has not.
</span>

<span v-if="filters.some((value) => ['Commands'].includes(getTagName(value)))">

## `/tick` <Badge type="info" text="Commands" />

<smokeystackDaysSince :date="new Date('2023-10-25')" /> since Java got the `/tick` command and Bedrock has not.
</span>

<span v-if="filters.some((value) => ['Add-Ons'].includes(getTagName(value)))">

## Data Driven Damage Types <Badge type="info" text="Add-Ons" />

<smokeystackDaysSince :date="new Date('2023-02-08')" /> since Java got data driven damage types and Bedrock has not.
</span>

<span v-if="filters.some((value) => ['Add-Ons'].includes(getTagName(value)))">

## Data Driven Armour Trims and Materials <Badge type="info" text="Add-Ons" />

<smokeystackDaysSince :date="new Date('2023-01-24')" /> since Java got data driven armour trims and materials and Bedrock has not.
</span>

<span v-if="filters.some((value) => ['Commands'].includes(getTagName(value)))">

## `/ride` Disparity <Badge type="info" text="Commands" />

<smokeystackDaysSince :date="new Date('2023-01-18')" /> since Java got the `/ride` command and disparity occurred. In Java, all types of entities can ride and be ridden by other entities of any types. In Bedrock, an entity cannot ride entities which are not normally rideable for it in vanilla game.
</span>

<span v-if="filters.some((value) => ['Add-Ons'].includes(getTagName(value)))">

## Useable Jigsaw Blocks <Badge type="info" text="Add-Ons" />

<smokeystackDaysSince :date="new Date('2022-03-16')" /> since Java got useable Jigsaw blocks for creators and Bedrock has not.
</span>

<span v-if="filters.some((value) => ['Commands'].includes(getTagName(value)))">

## `/placefeature` <Badge type="info" text="Commands" />

<smokeystackDaysSince :date="new Date('2022-01-19')" /> since Java got the `/placefeature` command and Bedrock has not. It is good to note that this command showed up in `1.18.20.25` but removed in `1.18.20.28`.
</span>

<span v-if="filters.some((value) => ['Add-Ons'].includes(getTagName(value)))">

## Custom Biomes <Badge type="info" text="Add-Ons" />

<smokeystackDaysSince :date="new Date('2020-09-21')" /> since custom biome support was removed from Bedrock.
</span>

<span v-if="filters.some((value) => ['Add-Ons'].includes(getTagName(value)))">

## Custom Dimensions <Badge type="info" text="Add-Ons" />

<smokeystackDaysSince :date="new Date('2020-06-03')" /> since Java got custom dimension support and Bedrock has not.
</span>

<span v-if="filters.some((value) => ['Add-Ons'].includes(getTagName(value)))">

## Data Driven Vanilla Block Loot Tables <Badge type="info" text="Add-Ons" />

<smokeystackDaysSince :date="new Date('2018-10-24')" /> since Java got data driven vanilla block loot tables and Bedrock has not.
</span>

<span v-if="filters.some((value) => ['Add-Ons'].includes(getTagName(value)))">

## Data Driven Vanilla Tags <Badge type="info" text="Add-Ons" />

<smokeystackDaysSince :date="new Date('2017-12-06')" /> since Java got data driven vanilla tags and Bedrock has not.
</span>

<span v-if="filters.some((value) => ['Add-Ons'].includes(getTagName(value)))">

## Custom Vanilla Block Models <Badge type="info" text="Add-Ons" />

<smokeystackDaysSince :date="new Date('2014-02-06')" /> since Java got custom vanilla block models and Bedrock has not.
</span>

<script setup>
    const tagMapping = {
        0: 'Add-Ons',
        1: 'Commands',
        2: 'General'
        // Add more mappings as needed
    };

    // Map tag IDs to tag names
    function getTagName(tagId) {
        return tagMapping[tagId] || ''; // Default to empty string if not found
    }
</script>

<script>
    export default {
        data: () => ({
            filters: [0,1,2,3,4,5]
        })
    };
</script>
