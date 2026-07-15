<script setup lang="ts">
    import { computed } from 'vue';

    const props = defineProps<{ text: string }>();

    // Apparently rendering raw, arbitrary HTML is bad practice! We only need <code> anyways.
    const parts = computed(() =>
        props.text
            .split(/<code>(.*?)<\/code>/gs)
            .map((text, index) => ({ text, isCode: index % 2 === 1 }))
            .filter((part) => part.text !== '')
    );
</script>

<template>
    <template v-for="(part, index) in parts" :key="index">
        <code v-if="part.isCode">{{ part.text }}</code>
        <template v-else>{{ part.text }}</template>
    </template>
</template>
