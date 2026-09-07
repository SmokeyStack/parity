<script setup lang="ts">
    import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
    import {
        Pagination,
        PaginationContent,
        PaginationEllipsis,
        PaginationItem,
        PaginationNext,
        PaginationPrevious
    } from '@/components/ui/pagination';
    import { Input } from '@/components/ui/input';
    import { Badge } from '@/components/ui/badge';
    import { ClipboardCopy, Check } from '@lucide/vue';

    import moment from 'moment';
    import countdown from '../lib/countdown';

    const cellRefs = ref<Record<string, HTMLElement>>({});
    const { copyAsImage, copiedKey } = useCopyAsImage();

    const allIssues = ref(useContent('implemented', 'introduced'));
    const searchQuery = ref('');

    // --- Filtered Articles (based on search) ---
    const filteredIssues = computed(() => {
        if (!searchQuery.value) {
            return allIssues.value;
        }
        const lowerCaseQuery = searchQuery.value.toLowerCase();
        return allIssues.value.filter(
            (
                issues: any // Use any if type not fully defined yet
            ) => issues.title.toLowerCase().includes(lowerCaseQuery)
        );
    });

    const itemsPerPage = 10;
    const currentPage = ref(1);
    const totalItems = computed(() => filteredIssues.value.length);

    watch(searchQuery, () => {
        currentPage.value = 1;
    });
    const handlePageUpdate = (newPage: number) => {
        currentPage.value = newPage;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const displayedIssues = computed(() => {
        const startIndex = (currentPage.value - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredIssues.value.slice(startIndex, endIndex);
    });
    const issueTimeDiffs = ref(new Map<string, string>());
    let countdownInterval: NodeJS.Timeout | null = null;
    const updateDiffs = (article: any) => {
        if (!article.introduced || article.introduced === 'Invalid Date') {
            issueTimeDiffs.value.set(
                article.id,
                'UNKNOWN - This is due to it not being documented via the Minecraft Wiki'
            );
            return;
        }

        const startDate = moment(new Date(article.introduced)).toDate();
        const endDate = moment(new Date(article.implemented)).toDate();
        const diff = countdown(
            startDate,
            endDate,
            countdown.YEARS |
                countdown.MONTHS |
                countdown.DAYS |
                countdown.HOURS |
                countdown.MINUTES |
                countdown.SECONDS
        );
        issueTimeDiffs.value.set(article.id, diff.toString());
    };
    const updateAllDisplayedIssuesDiffs = () => {
        displayedIssues.value.forEach((article) => {
            updateDiffs(article);
        });
    };
    onMounted(() => {
        updateAllDisplayedIssuesDiffs();
        countdownInterval = setInterval(updateAllDisplayedIssuesDiffs, 1000);
    });
    onUnmounted(() => {
        if (countdownInterval) clearInterval(countdownInterval);
    });
    watch(displayedIssues, () => {
        updateAllDisplayedIssuesDiffs();
    });

    const colorMode = useColorMode();
</script>
<template>
    <h1
        class="title-colour text-4xl font-extrabold mb-8 text-center tracking-wide">
        How Long Since...?
    </h1>
    <div class="mb-10 flex justify-center">
        <Input
            v-model="searchQuery"
            placeholder="Search articles by title or category..."
            class="w-full max-w-md bg-gray-800 border-gray-700 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
            :class="{
                'bg-[#FAFAFA] text-gray-900 placeholder-gray-500':
                    colorMode.value === 'light',
                'bg-gray-800 text-gray-200 placeholder-gray-500':
                    colorMode.value === 'dark'
            }" />
    </div>
    <div class="space-y-6 mb-12">
        <div
            v-for="issue in displayedIssues"
            :key="issue.id"
            :ref="
                (el) => {
                    if (el) cellRefs[issue.id] = el as HTMLElement;
                }
            "
            class="relative border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
            <div class="absolute top-3 right-3 flex items-center gap-2">
                <SourceNote :source="issue.source" />
                <button
                    data-no-export
                    @click="copyAsImage(cellRefs[issue.id], issue.id)"
                    class="p-1.5 rounded-lg opacity-50 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                    :title="
                        copiedKey === issue.id ? 'Copied!' : 'Copy as image'
                    ">
                    <Check
                        v-if="copiedKey === issue.id"
                        class="w-4 h-4 text-green-500" />
                    <ClipboardCopy v-else class="w-4 h-4" />
                </button>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center mb-2">
                <h2 class="text-xl sm:text-2xl font-bold mr-3 mb-2 sm:mb-0">
                    <CodeText :text="issue.title" />
                </h2>
                <span class="px-2 py-0.5 font-semibold">
                    <Badge>
                        {{
                            issue.category
                                .split('-')
                                .map(
                                    (part) =>
                                        part.charAt(0).toUpperCase() +
                                        part.slice(1)
                                )
                                .join('-')
                        }}
                    </Badge>
                </span>
            </div>
            <h1
                class="counter-colour text-3xl md:text-4xl font-[Mojangles] my-4 tracking-wide text-center sm:text-left">
                <template v-if="issueTimeDiffs.get(issue.id)">
                    {{ issueTimeDiffs.get(issue.id) }}
                </template>
                <template v-else-if="issue.introduced">
                    Calculating...
                </template>
                <template v-else>
                    UNKNOWN - This is due to it not being documented via the
                    Minecraft Wiki
                </template>
            </h1>
        </div>
        <p
            v-if="displayedIssues.length === 0 && !searchQuery"
            class="text-center text-gray-500 text-lg py-10">
            No disparity items available.
        </p>
        <p
            v-else-if="displayedIssues.length === 0 && searchQuery"
            class="text-center text-gray-500 text-lg py-10">
            No items found for "{{ searchQuery }}". Try a different search.
        </p>
    </div>
    <div class="flex justify-center mt-12 pb-8">
        <Pagination
            v-if="totalItems > 0"
            :items-per-page="itemsPerPage"
            :total="totalItems"
            :default-page="currentPage"
            @update:page="handlePageUpdate"
            v-slot="{ page }">
            <PaginationContent v-slot="{ items }">
                <PaginationPrevious />
                <template v-for="(item, index) in items" :key="index">
                    <PaginationItem
                        v-if="item.type === 'page'"
                        :value="item.value"
                        :is-active="item.value === page"
                        class="hover:bg-gray-700 data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:hover:bg-blue-700 transition-colors duration-200">
                        {{ item.value }}
                    </PaginationItem>
                    <PaginationEllipsis
                        v-else-if="item.type === 'ellipsis'"
                        class="text-gray-500" />
                </template>
                <PaginationNext />
            </PaginationContent>
        </Pagination>
    </div>
</template>
