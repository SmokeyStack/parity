<script setup lang="ts">
    import { computed } from 'vue';
    import { Link } from '@lucide/vue';
    import {
        Tooltip,
        TooltipContent,
        TooltipProvider,
        TooltipTrigger
    } from '@/components/ui/tooltip';
    import { normalizeSources } from '@/lib/source';

    const props = defineProps<{ source?: string | string[] }>();
    const sources = computed(() => normalizeSources(props.source));
</script>

<template>
    <!-- data-no-export: useCopyAsImage filters this node out of the PNG.
         TooltipContent is portaled to <body>, so it never sits inside the card. -->
    <TooltipProvider v-if="sources.length" :delay-duration="200">
        <Tooltip>
            <TooltipTrigger as-child>
                <span
                    data-no-export
                    class="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Link class="w-3 h-3 shrink-0" aria-hidden="true" />
                    <span>
                        via
                        <template v-for="(s, i) in sources" :key="s.url">
                            <template v-if="i > 0">, </template>
                            <a
                                :href="s.url"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="underline underline-offset-2 hover:text-foreground">
                                {{ s.label }}
                            </a>
                        </template>
                    </span>
                </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
                Where this date is sourced from
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
</template>
