import type { CustomerSelectComponent } from '@/app/types/Customer';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFilterSearchByBetweenDaysStore = defineStore('filter-search-by-between-days', () => {
    const from = ref<String | null>();
    const to = ref<String | null>();

    return {
        from,
        to,
    };
});
