import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { createReceipt } from '@/api/receipt/receipt-api';
import type { AxiosResponse } from 'axios';
import type { DocumentCancelation } from '@/app/types/Receipt';
import { showMessage } from '@/app/helpers/mesaages';
import { useReceiptComposable } from './useReceiptComposable';

interface CreateReceiptVariables {
    invoicesToCancel: any[];
    documentsCancelation: DocumentCancelation[];
    saldo: number;
}

export const useCreateReceiptMutation = () => {
    const queryClient = useQueryClient();

    const { isCreatedReceipt, openModalToPrintReceipt, printeableReceiptData } = useReceiptComposable();

    return useMutation<AxiosResponse<any>, Error, CreateReceiptVariables>(
        async (variables: CreateReceiptVariables) => {
            const { invoicesToCancel, documentsCancelation, saldo } = variables;
            return await createReceipt(invoicesToCancel, documentsCancelation, saldo);
        },
        {
            onSuccess: (data) => {
                // Invalidate and refetch any queries that might be affected by this mutation
                openModalToPrintReceipt.value = true;

                queryClient.invalidateQueries(['receipts']);

                printeableReceiptData.value.customer = data.data.customer;

                printeableReceiptData.value.receipt = data.data.receipt;

                printeableReceiptData.value.documentsCancelation = data.data.documentsCancelation;

                printeableReceiptData.value.invoicesToCancel = data.data.invoicesToCancel;

                isCreatedReceipt.value = true;

                showMessage('success', 'Recibo creado correctamente.', 3);

                console.log('🚀 ~ useCreateReceiptMutation ~ data:', data);
            },
            onError: (error: any) => {
                if (error.message.includes('No query results for model')) {
                    showMessage('error', 'No se encontraron resultados para las facturas seleccionadas.', 3);
                } else {
                    showMessage('error', 'Ocurrió un error al crear el recibo.', 3);
                }
            },
        },
    );
};
