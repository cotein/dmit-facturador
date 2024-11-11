// src/composables/useInvoiceSorting.ts
import { ref, computed } from 'vue';
import { ZERO } from '@/app/types/Constantes';
import { useReceiptComposable } from './useReceiptComposable';

export function useInvoiceSorting(invoices: any, selectedInvoiceIds: any, totalsDocumetsCancelation: any) {
    const { invoicesToCancel } = useReceiptComposable();

    const backUpInvoices = ref<any>([]);

    const generateTableData = () => {
        const sortedInvoices = invoices.value
            .filter((invoice: any) => selectedInvoiceIds.value.includes(invoice.id.toString()))
            .map((invoice: any, index: any) => {
                const importe_previo_pagado =
                    Array.isArray(invoice.previousPayment) && invoice.previousPayment.length > ZERO
                        ? invoice.previousPayment.reduce(
                            (acc: number, item: any) => acc + parseFloat(item.importPayment),
                            0,
                        )
                        : '0';

                return {
                    key: invoice.id,
                    numero: index + 1,
                    comprobante: `${invoice.number}`,
                    importe: invoice.import,
                    importe_previo_pagado: parseFloat(importe_previo_pagado),
                    saldo: invoice.import - parseFloat(importe_previo_pagado),
                    touched: false,
                    touchedTime: ZERO,
                    canceled: false,
                    toPayNow: ZERO,
                    toPayNowDisplay: ZERO,
                };
            })
            .sort((a: any, b: any) => a.importe - b.importe);

        // Loop to cancel invoices and credit notes with the same importe
        for (let i = 0; i < sortedInvoices.length; i++) {
            for (let j = i + 1; j < sortedInvoices.length; j++) {
                if (sortedInvoices[i].importe === sortedInvoices[j].importe * -1) {
                    sortedInvoices[i].toPayNow = sortedInvoices[i].saldo;
                    sortedInvoices[j].toPayNow = sortedInvoices[j].saldo;

                    sortedInvoices[i].toPayNowDisplay = sortedInvoices[i].saldo;
                    sortedInvoices[j].toPayNowDisplay = sortedInvoices[j].saldo;

                    sortedInvoices[i].canceled = true;
                    sortedInvoices[j].canceled = true;

                    sortedInvoices[i].touched = true;
                    sortedInvoices[j].touched = true;

                    sortedInvoices[i].touchedTime++;
                    sortedInvoices[j].touchedTime++;

                    sortedInvoices[i].saldo = ZERO;
                    sortedInvoices[j].saldo = ZERO;
                    break;
                }
            }
        }

        return sortedInvoices;
    };

    const sortInvoices = (order: any) => {
        const totalInvoices = backUpInvoices.value.length;

        if (totalInvoices === 0) return;

        invoicesToCancel.value = JSON.parse(JSON.stringify(backUpInvoices.value));

        invoicesToCancel.value.sort((a: any, b: any) => (order === 'asc' ? a.saldo - b.saldo : b.saldo - a.saldo));

        let remainingTotalToPay = TotalToPay.value;

        while (remainingTotalToPay > ZERO) {
            const hasNonCanceledInvoice = invoicesToCancel.value.some((invoice: any) => !invoice.canceled);

            if (!hasNonCanceledInvoice) {
                console.warn('No hay facturas no canceladas disponibles para procesar.');
                break;
            }

            invoicesToCancel.value.forEach((invoice: any) => {
                if (!invoice.canceled) {
                    if (remainingTotalToPay >= invoice.saldo) {
                        invoice.touchedTime++;
                        invoice.toPayNow = invoice.saldo;
                        invoice.toPayNowDisplay = invoice.saldo.toFixed(2);
                        invoice.saldo = ZERO;
                        invoice.touched = true;
                        remainingTotalToPay -= invoice.toPayNow;
                        invoice.canceled = true;
                    } else {
                        invoice.touchedTime++;
                        invoice.toPayNow = remainingTotalToPay;
                        invoice.toPayNowDisplay = remainingTotalToPay.toFixed(2);
                        invoice.saldo -= remainingTotalToPay;
                        invoice.touched = true;
                        remainingTotalToPay = ZERO;
                    }
                }
            });

            if (remainingTotalToPay <= ZERO) break;
        }
    };

    const TotalToPay = computed(() => {
        return totalsDocumetsCancelation.value.reduce((acc: any, item: any) => {
            return acc + item.total;
        }, 0);
    });

    return {
        invoicesToCancel,
        backUpInvoices,
        generateTableData,
        sortInvoices,
        TotalToPay,
    };
}
