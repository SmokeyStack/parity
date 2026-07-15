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
    import { ClipboardCopy, Check } from 'lucide-vue-next';
    import data from '../assets/tags-blocks.json';

    import moment from 'moment';
    import countdown from '../lib/countdown';

    const cellRefs = ref<Record<string, HTMLElement>>({});
    const { copyAsImage, copiedKey } = useCopyAsImage();

    const allIssues = ref(data);
    const searchQuery = ref('');

    // --- Filtered Articles (based on search) ---
    const filteredIssues = computed(() => {
        if (!searchQuery.value) {
            return allIssues.value;
        }
        const lowerCaseQuery = searchQuery.value.toLowerCase();
        return allIssues.value.filter((issues: any) => {
            // Check if title includes the query (existing logic)
            if (issues.title.toLowerCase().includes(lowerCaseQuery)) {
                return true;
            }

            // *** NEW LOGIC for description ***
            if (typeof issues.description === 'string') {
                // If it's a string, just check directly
                return issues.description
                    .toLowerCase()
                    .includes(lowerCaseQuery);
            } else if (Array.isArray(issues.description)) {
                // If it's an array, use .some() to check if ANY element includes the query
                return issues.description.some((desc: string) =>
                    desc.toLowerCase().includes(lowerCaseQuery)
                );
            }
            return false; // Return false if description is neither a string nor an array
        });
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
        if (!article.date || article.date === 'Invalid Date') {
            issueTimeDiffs.value.set(
                article.title + article.date,
                'UNKNOWN - This is due to it not being documented via the Minecraft Wiki'
            );
            return;
        }

        const startDate = moment(new Date(article.date)).toDate();
        const endDate = moment(new Date()).toDate();
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
        issueTimeDiffs.value.set(article.title + article.date, diff.toString());
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
            placeholder="Search articles by title or description..."
            class="w-full max-w-md bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
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
            :key="issue.title + issue.date"
            :ref="(el) => { if (el) cellRefs[issue.title + issue.date] = el as HTMLElement }"
            class="relative border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
            <button
                @click="copyAsImage(cellRefs[issue.title + issue.date], issue.title + issue.date)"
                class="absolute top-3 right-3 p-1.5 rounded-lg opacity-50 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                :title="copiedKey === issue.title + issue.date ? 'Copied!' : 'Copy as image'">
                <Check v-if="copiedKey === issue.title + issue.date" class="w-4 h-4 text-green-500" />
                <ClipboardCopy v-else class="w-4 h-4" />
            </button>
            <div class="flex flex-col sm:flex-row sm:items-center mb-2">
                <h2 class="text-xl sm:text-2xl font-bold mr-3 mb-2 sm:mb-0">
                    <code>
                        {{ issue.title }}
                    </code>
                </h2>
            </div>
            <h1
                class="counter-colour text-3xl md:text-4xl font-[Mojangles] my-4 tracking-wide text-center sm:text-left">
                <template v-if="issueTimeDiffs.get(issue.title + issue.date)">
                    {{ issueTimeDiffs.get(issue.title + issue.date) }}
                </template>
                <template v-else-if="issue.date"> Calculating... </template>
                <template v-else>
                    UNKNOWN - This is due to it not being documented via the
                    Minecraft Wiki
                </template>
            </h1>
            <p
                v-if="typeof issue.description == 'string'"
                class="leading-relaxed">
                <CodeText :text="issue.description" />
            </p>
            <ul
                v-else-if="Array.isArray(issue.description)"
                class="leading-relaxed list-disc list-inside">
                <li v-for="i in issue.description" :key="i">
                    <CodeText :text="i" />
                </li>
            </ul>
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
