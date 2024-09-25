import { storeToRefs } from 'pinia';
import { useReceiptStore } from '@/app/store/receipt/useReceiptStore';
import type { DocumentCancelation } from '@/app/types/Receipt';
import { ref } from 'vue';

const {
    sourceData,
    invoices,
    totalInvoicedAmountToCancel,
    documentsCancelation,
    drawerVisible,
    isEditingDocumentCancelation,
    dataDocumentCancelation,
    enableButtonOpenDocumentCancelationDrawer,
} = storeToRefs(useReceiptStore());

const { setinitialData } = useReceiptStore();

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
        sourceData,
        invoices,
        setinitialData,
        totalInvoicedAmountToCancel,
        documentsCancelation,
        totalsDocumetsCancelation,
        drawerVisible,
        isEditingDocumentCancelation,
        dataDocumentCancelation,
        enableButtonOpenDocumentCancelationDrawer,
    };
};
