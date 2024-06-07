import type { InvoiceList } from '@/app/types/Invoice';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useInvoiceChartStore = defineStore('invoice-chart', () => {
    const invoices = ref<InvoiceList[]>([]);
    const totalInvoiced = ref<InvoiceList[]>([]);

    return {
        //State properties
        invoices,
        totalInvoiced,
        //Actions
        //Getters
    };
});
