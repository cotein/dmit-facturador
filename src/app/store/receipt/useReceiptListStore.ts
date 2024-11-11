import type { PrinteableReceiptData } from '@/app/types/Receipt';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useReceiptListStore = defineStore('receipt-list', () => {
    const receiptList = ref<PrinteableReceiptData[]>([]);

    const currentPage = ref<number>();

    const itemsPerPage = ref<number>();

    const totalPages = ref<number>();

    const totalItems = ref<number>();

    const status_id = ref<number | null>(null);

    const setinitialDataAtReceiptList = () => {
        receiptList.value = [];
    };

    return {
        receiptList,
        currentPage,
        itemsPerPage,
        totalPages,
        status_id,
        totalItems,
        setinitialDataAtReceiptList,
    };
});
