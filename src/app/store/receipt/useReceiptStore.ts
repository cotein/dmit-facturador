import type { InvoiceList } from '@/app/types/Invoice';
import type { DocumentCancelation } from '@/app/types/Receipt';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useReceiptStore = defineStore('receipt', () => {
    type SourceData = {
        key: string;
        title: string;
        description: string;
        disabled: boolean;
    };

    const drawerVisible = ref(false);

    const enableButtonOpenDocumentCancelationDrawer = ref(false);

    const isEditingDocumentCancelation = ref(false);

    const sourceData = ref<SourceData[]>([]);

    const invoices = ref<InvoiceList[]>([]);

    const documentsCancelation = ref<DocumentCancelation[]>([]);
    const dataDocumentCancelation = ref<{ data: DocumentCancelation | null; index: number | null }>();

    const totalInvoicedAmountToCancel = ref<number>(0);

    const setinitialData = () => {
        sourceData.value = [];
        invoices.value = [];
        documentsCancelation.value = [];
    };

    return {
        sourceData,
        invoices,
        setinitialData,
        totalInvoicedAmountToCancel,
        documentsCancelation,
        drawerVisible,
        isEditingDocumentCancelation,
        dataDocumentCancelation,
        enableButtonOpenDocumentCancelationDrawer,
    };
});
