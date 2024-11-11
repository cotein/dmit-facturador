import { storeToRefs } from 'pinia';
import { useReceiptStore } from '@/app/store/receipt/useReceiptStore';
import type { DocumentCancelation } from '@/app/types/Receipt';

import { useFilterSearchByBetweenDaysStore } from '@/app/store/filter-search/useFilterSearchByBetweenDaysStore';
import { useFilterSearchByCustomerStore } from '@/app/store/filter-search/useFilterSearchByCustomerStore';
import { ref } from 'vue';

const { from, to } = storeToRefs(useFilterSearchByBetweenDaysStore());
const { customer } = storeToRefs(useFilterSearchByCustomerStore());
const {
    sourceData,
    invoices,
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
} = storeToRefs(useReceiptStore());

const { setinitialDataAtReceipt, setNullPrinteableReceiptData } = useReceiptStore();

type Total = {
    payment_type_id: number;
    name: string;
    total: number;
};

const totalsDocumetsCancelation = ref<Total[]>([]);

export const useReceiptComposable = () => {
    useReceiptStore().$subscribe(() => {
        totalsDocumetsCancelation.value = [];

        documentsCancelation.value.reduce((acc: Record<number, Total>, doc: DocumentCancelation) => {
            if (doc.payment_type_id === null) {
                return acc;
            }

            const importValue = doc.import ?? 0;

            if (totalsDocumetsCancelation.value.length === 0) {
                totalsDocumetsCancelation.value.push({
                    payment_type_id: doc.payment_type_id,
                    name: '',
                    total: importValue,
                });
            } else {
                const index = totalsDocumetsCancelation.value.findIndex(
                    (total) => total.payment_type_id === doc.payment_type_id,
                );
                if (index !== -1) {
                    totalsDocumetsCancelation.value[index].total += importValue;
                } else {
                    totalsDocumetsCancelation.value.push({
                        payment_type_id: doc.payment_type_id,
                        name: '',
                        total: importValue,
                    });
                }
            }
            return acc;
        }, {});
    });

    return {
        customer,
        dataDocumentCancelation,
        documentsCancelation,
        drawerVisible,
        enableButtonOpenDocumentCancelationDrawer,
        from,
        invoices,
        invoicesToCancel,
        isEditingDocumentCancelation,
        selectedInvoiceIds,
        setinitialDataAtReceipt,
        sourceData,
        to,
        totalInvoicedAmountToCancel,
        totalsDocumetsCancelation,
        isCreatedReceipt,
        openModalToPrintReceipt,
        openModalAsignPaymentToInvoices,
        printeableReceiptData,
        setNullPrinteableReceiptData,
    };
};
