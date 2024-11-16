// src/composables/usePagination.ts
import { computed } from 'vue';
import { usePaginationStore } from '@/app/store/pagination/usePaginationStore';

export const usePaginationComposable = () => {
    const paginationStore = usePaginationStore();

    const currentPage = computed(() => paginationStore.currentPage);
    const itemsPerPage = computed(() => paginationStore.itemsPerPage);
    const totalPages = computed(() => paginationStore.totalPages);
    const totalItems = computed(() => paginationStore.totalItems);

    const setCurrentPage = (page: number) => {
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
    };

    const prevPage = () => {
        if (paginationStore.currentPage > 1) {
            paginationStore.setCurrentPage(paginationStore.currentPage - 1);
        }
    };

    const nextPage = () => {
        if (paginationStore.currentPage < paginationStore.totalPages) {
            paginationStore.setCurrentPage(paginationStore.currentPage + 1);
        }
    };

    return {
        currentPage,
        itemsPerPage,
        totalPages,
        totalItems,
        setCurrentPage,
        setItemsPerPage,
        setTotalPages,
        setTotalItems,
        prevPage,
        nextPage,
    };
};
