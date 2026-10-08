import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ReceiptPaymentRow } from '@/api/receipt-payment/receipt-payment-api';

/**
 * Filtros y paginación de la pantalla de pagos recibidos.
 *
 * Es un store propio a propósito: los filtros de la pantalla de recibos viven
 * en stores compartidos y no quiero que una pantalla mueva la otra.
 */
export const usePaymentsReceivedStore = defineStore('payments-received', () => {
    const payments = ref<ReceiptPaymentRow[]>([]);
    const currentPage = ref<number>(1);
    const itemsPerPage = ref<number>(25);
    const totalItems = ref<number>(0);

    const from = ref<string | null>(null);
    const to = ref<string | null>(null);
    const customerId = ref<number | null>(null);
    const paymentTypeId = ref<number | null>(null);
    const status = ref<string | null>(null);
    const amountFrom = ref<number | null>(null);
    const amountTo = ref<number | null>(null);

    const resetFilters = () => {
        from.value = null;
        to.value = null;
        customerId.value = null;
        paymentTypeId.value = null;
        status.value = null;
        amountFrom.value = null;
        amountTo.value = null;
        currentPage.value = 1;
    };

    return {
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
        resetFilters,
    };
});
