import type { individualInvoice, InvoiceList, PaymentHistory } from '@/app/types/Invoice';
import { defineStore } from 'pinia';
import { ref } from 'vue';

type Comments = {
    comment: string;
};

export const useInvoiceCommentsStore = defineStore('invoice-comments', () => {
    const commentsList = ref<Comments[]>([]);

    const currentPage = ref<number>();

    const itemsPerPage = ref<number>();

    const totalPages = ref<number>();

    const totalItems = ref<number>();

    const status_id = ref<number | null>(null);

    return {
        commentsList,
        currentPage,
        itemsPerPage,
        totalPages,
        status_id,
        totalItems,
    };
});
