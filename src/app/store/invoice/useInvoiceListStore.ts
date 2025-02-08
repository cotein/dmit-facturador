import type { individualInvoice, InvoiceList } from '@/app/types/Invoice';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useInvoiceListStore = defineStore('invoice-list', () => {
    const invoiceList = ref<InvoiceList[]>([]);

    const currentPage = ref<number>();

    const itemsPerPage = ref<number>();

    const totalPages = ref<number>();

    const totalItems = ref<number>();

    const status_id = ref<number | null>(1); //adeudada

    const individualInvoice = ref<individualInvoice | null>(null);

    return {
        invoiceList,
        currentPage,
        itemsPerPage,
        totalPages,
        status_id,
        totalItems,
        individualInvoice,
    };
});
