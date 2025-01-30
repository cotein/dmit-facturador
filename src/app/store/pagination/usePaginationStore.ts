// src/store/usePaginationStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePaginationStore = defineStore('pagination', () => {
    const currentPage = ref<number>(1);
    const itemsPerPage = ref<number>(10);
    const totalPages = ref<number>(0);
    const totalItems = ref<number>(0);

    const setCurrentPage = (page: number) => {
        currentPage.value = page;
    };

    const setItemsPerPage = (items: number) => {
        itemsPerPage.value = items;
    };

    const setTotalPages = (pages: number) => {
        totalPages.value = pages;
    };

    const setTotalItems = (items: number) => {
        totalItems.value = items;
    };

    const resetPagination = () => {
        currentPage.value = 1;
        itemsPerPage.value = 10;
        totalPages.value = 0;
        totalItems.value = 0;
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
        resetPagination,
    };
});
