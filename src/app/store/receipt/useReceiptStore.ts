import type { DocumentCancelation, InvoicesToCancel, PrinteableReceiptData } from '@/app/types/Receipt';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useReceiptStore = defineStore('receipt', () => {
    type SourceData = {
        key: string;
        title: string;
        description: string;
        saldo: string;
        disabled: boolean;
    };

    const drawerVisible = ref<boolean>(false);

    const enableButtonOpenDocumentCancelationDrawer = ref<boolean>(false);

    const isEditingDocumentCancelation = ref<boolean>(false);

    const sourceData = ref<SourceData[]>([]);

    const invoices = ref<InvoicesToCancel[]>([]);

    const documentsCancelation = ref<DocumentCancelation[]>([]);

    const dataDocumentCancelation = ref<{ data: DocumentCancelation | null; index: number | null }>();

    const totalInvoicedAmountToCancel = ref<number>(0);

    const selectedInvoiceIds = ref<number[]>([]);

    const invoicesToCancel = ref<any[]>([]);

    const isCreatedReceipt = ref<boolean>(false);

    const openModalToPrintReceipt = ref<boolean>(false);

    const openModalAsignPaymentToInvoices = ref<boolean>(false);

    const printeableReceiptData = ref<PrinteableReceiptData | null>(null);

    const setinitialDataAtReceipt = () => {
        sourceData.value = [];
        invoices.value = [];
        documentsCancelation.value = [];
        enableButtonOpenDocumentCancelationDrawer.value = false;
        isEditingDocumentCancelation.value = false;
        dataDocumentCancelation.value = { data: null, index: null };
        totalInvoicedAmountToCancel.value = 0;
        selectedInvoiceIds.value = [];
        invoicesToCancel.value = [];
        isCreatedReceipt.value = false;
        //openModalToPrintReceipt.value = false;
        openModalAsignPaymentToInvoices.value = false;
        //printeableReceiptData.value = null;
    };

    const setNullPrinteableReceiptData = () => {
        printeableReceiptData.value = null;
    };

    return {
        sourceData,
        invoices,
        setinitialDataAtReceipt,
        totalInvoicedAmountToCancel,
        documentsCancelation,
        drawerVisible,
        isEditingDocumentCancelation,
        dataDocumentCancelation,
        enableButtonOpenDocumentCancelationDrawer,
        selectedInvoiceIds,
        invoicesToCancel,
        isCreatedReceipt,
        openModalToPrintReceipt,
        openModalAsignPaymentToInvoices,
        printeableReceiptData,
        setNullPrinteableReceiptData,
    };
});
