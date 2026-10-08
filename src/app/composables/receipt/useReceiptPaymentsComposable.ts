import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useCompanyComposable } from '../company/useCompanyComposable';
import { usePaymentsReceivedStore } from '@/app/store/receipt/usePaymentsReceivedStore';
import { cancelReceipt, createAccountPayment, getReceiptPayments } from '@/api/receipt-payment/receipt-payment-api';
import type { AccountPaymentDocument } from '@/api/receipt-payment/receipt-payment-api';

/**
 * Listado de pagos recibidos y sus acciones: anular un recibo y registrar un
 * pago a cuenta.
 */
export const useReceiptPaymentsComposable = () => {
    const { CompanyGetter } = useCompanyComposable();
    const queryClient = useQueryClient();

    const store = usePaymentsReceivedStore();
    const {
        payments,
        currentPage,
        itemsPerPage,
        totalItems,
        from,
        to,
        customerId,
        paymentTypeId,
        status,
        amountFrom,
        amountTo,
    } = storeToRefs(store);

    const { isLoading, data, isFetching } = useQuery(
        [
            'receipt-payments',
            currentPage,
            itemsPerPage,
            from,
            to,
            customerId,
            paymentTypeId,
            status,
            amountFrom,
            amountTo,
        ],
        async () => {
            const companyId = CompanyGetter.value?.id;

            if (!companyId) {
                return null;
            }

            return await getReceiptPayments({
                company_id: companyId,
                from: from.value,
                to: to.value,
                customer_id: customerId.value,
                payment_type_id: paymentTypeId.value,
                status: status.value,
                amount_from: amountFrom.value,
                amount_to: amountTo.value,
                page: currentPage.value,
                per_page: itemsPerPage.value,
            });
        },
    );

    watch(data, (response) => {
        if (!response?.data) {
            payments.value = [];
            return;
        }

        const { data: list, pagination } = response.data;

        payments.value = list ?? [];

        if (pagination) {
            currentPage.value = pagination.current_page;
            itemsPerPage.value = pagination.per_page;
            totalItems.value = pagination.total;
        }
    });

    // Anular un recibo: pide el motivo, revierte la imputación en el API y
    // recarga el listado, así el estado del pago se ve al instante.
    const { mutateAsync: anularRecibo, isLoading: isCancelling } = useMutation(
        (payload: { receiptId: number; reason: string | null }) => cancelReceipt(payload.receiptId, payload.reason),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['receipt-payments']);
            },
        },
    );

    // Pago a cuenta: sin comprobantes imputados, a favor del cliente.
    const { mutateAsync: registrarPagoACuenta, isLoading: isCreating } = useMutation(
        (payload: { companyId: number; customerId: number; amount: number; document: AccountPaymentDocument }) =>
            createAccountPayment(payload.companyId, payload.customerId, payload.document, payload.amount * -1),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['receipt-payments']);
            },
        },
    );

    return {
        payments,
        isLoading: isLoading.value || isFetching.value,
        currentPage,
        itemsPerPage,
        totalItems,
        anularRecibo,
        isCancelling,
        registrarPagoACuenta,
        isCreating,
    };
};
