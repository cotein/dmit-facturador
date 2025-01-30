// src/composables/usePagination.ts
import { computed } from 'vue';
import { usePaginationStore } from '@/app/store/pagination/usePaginationStore';
import { storeToRefs } from 'pinia';

export const usePaginationComposable = () => {
    //const paginationStore = usePaginationStore();

    const { currentPage, itemsPerPage, totalPages, totalItems } = storeToRefs(usePaginationStore());

    const { setCurrentPage, setItemsPerPage, setTotalPages, setTotalItems, resetPagination } = usePaginationStore();

    /*     const currentPage = computed(() => paginationStore.currentPage);
    const itemsPerPage = computed(() => paginationStore.itemsPerPage);
    const totalPages = computed(() => paginationStore.totalPages);
    const totalItems = computed(() => paginationStore.totalItems); */

    /*  const setCurrentPage = (page: number) => {
        paginationStore.setCurrentPage(page);
    };

    const setItemsPerPage = (items: number) => {
        paginationStore.setItemsPerPage(items);
    };

    const setTotalPages = (pages: number) => {
        paginationStore.setTotalPages(pages);
    };

    const setTotalItems = (items: number) => {
        paginationStore.setTotalItems(items);
    }; */

    /* const prevPage = () => {
        console.log('🚀 ~ prevPage ~ paginationStore.totalPages:', totalPages);
        console.log('🚀 ~ prevPage ~ currentPage:', currentPage);
        if (currentPage.value > 1) {
            setCurrentPage(currentPage.value - 1);
        }
    };

    const nextPage = () => {
        console.log('🚀 ~ nextPage ~ totalPages:', totalPages);
        console.log('🚀 ~ nextPage ~ currentPage:', currentPage);
        if (currentPage.value < totalPages.value) {
            currentPage.value + 1;
        }
    }; */

    return {
        currentPage,
        itemsPerPage,
        totalPages,
        totalItems,
        setCurrentPage,
        setItemsPerPage,
        setTotalPages,
        setTotalItems,
        /* prevPage,
        nextPage, */
        resetPagination,
    };
};
