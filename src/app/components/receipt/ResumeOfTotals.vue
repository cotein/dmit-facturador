<template>
    <div v-if="totalsDocumetsCancelation.length > 0">
        <h1>Resumen de pago</h1>
        <a-list
            :grid="{ gutter: 16, column: 4 }"
            :data-source="totalsDocumetsCancelation"
        >
            <template #renderItem="{ item }">
                <a-list-item>
                    <a-card
                        :title="getPaymentTypeName(item.payment_type_id)"
                        :bodyStyle="{
                            padding: '0px',
                            'background-color': 'orange',
                            'text-align': 'center',
                            'font-size': '18px',
                        }"
                    >
                        <p>{{ $filters.formatCurrency(item.total) }}</p>
                    </a-card>
                </a-list-item>
            </template>
        </a-list>
        <div id="to-pay-container">
            <div id="to-pay-info">
                <p>
                    Total comprobantes de ventas:
                    {{ $filters.formatCurrency(totalInvoicedAmountToCancel) }}.--, total
                    importe a pagar por el cliente:
                    {{ $filters.formatCurrency(TotalToPay) }}.--
                </p>
            </div>
            <div id="to-pay-results">
                <p>
                    {{
                        Diff > 0
                            ? `El cliente debe ${$filters.formatCurrency(Diff)}.--`
                            : `El cliente tiene un saldo a favor de ${$filters.formatCurrency(
                                  Diff * -1
                              )}.--`
                    }}
                </p>
            </div>
        </div>
        <div id="to-pay-action">
            <a-button
                :size="'large'"
                type="primary"
                @click="openModalAsignPaymentToInvoicesComponent"
                >Generar recibo de pago</a-button
            >
        </div>
    </div>
    <AsignPaymentToInvoices />

    <a-modal
        :visible="openModalToPrintReceipt"
        title="Confirmar"
        @ok="printReceipt"
        @cancel="cancelPrintReceipt"
        okText="Imprimir"
        cancelText="No"
    >
        <p id="print-message">¿Imprimir recibo de pago?</p>
    </a-modal>
</template>

<script setup lang="ts">
import { useReceiptComposable } from "@/app/composables/receipt/useReceiptComposable";
import { useQueryClient } from "@tanstack/vue-query";
import { computed, watch, ref } from "vue";
import AsignPaymentToInvoices from "./AsignPaymentToInvoices.vue";
import { useCompanyComposable } from "@/app/composables/company/useCompanyComposable";
import { fetchReport } from "@/api-reports/api-reports-base";
import { useInvoiceSorting } from "@/app/composables/receipt/useInvoiceSorting";
import { showMessage } from "@/app/helpers/mesaages";
import { zeroLeft } from "@/app/helpers/zero-left";

const {
    invoicesToCancel,
    totalsDocumetsCancelation,
    totalInvoicedAmountToCancel,
    documentsCancelation,
    openModalToPrintReceipt,
    openModalAsignPaymentToInvoices,
    selectedInvoiceIds,
    invoices,
    printeableReceiptData,
    setNullPrinteableReceiptData,
} = useReceiptComposable();

const { CompanyGetter } = useCompanyComposable();
const queryClient = useQueryClient();

const { backUpInvoices, generateTableData, sortInvoices } = useInvoiceSorting(
    invoices,
    selectedInvoiceIds,
    totalsDocumetsCancelation
);

const getPaymentTypeName = (paymentTypeId: number) => {
    const paymentTypes = queryClient.getQueryData(["payment-types"]) as Array<{
        company_id: number;
        id: number;
        name: string;
        percentage: number;
    }>;
    if (paymentTypes) {
        const paymentType = paymentTypes.find((type) => type.id === paymentTypeId);

        return paymentType ? paymentType.name : "Unknown";
    }
    return "Unknown";
};

const TotalToPay = computed(() => {
    return totalsDocumetsCancelation.value.reduce((acc, item) => {
        return acc + item.total;
    }, 0);
});

const Diff = computed(() => {
    return totalInvoicedAmountToCancel.value - TotalToPay.value;
});

const loadingPrintReceipt = ref<boolean>(false);

const cancelPrintReceipt = () => {
    openModalToPrintReceipt.value = false;
    setNullPrinteableReceiptData();
};

const openModalAsignPaymentToInvoicesComponent = () => {
    openModalAsignPaymentToInvoices.value = true;
    invoicesToCancel.value = generateTableData();
    backUpInvoices.value = JSON.parse(JSON.stringify(invoicesToCancel.value));
    sortInvoices("asc");

    const copy_company = JSON.parse(JSON.stringify(CompanyGetter.value));
    const copy_invoicesToCancel = JSON.parse(JSON.stringify(invoicesToCancel.value));
    const copy_documentsCancelation = JSON.parse(
        JSON.stringify(documentsCancelation.value)
    );
    const copy_saldo = parseFloat(Diff.value.toFixed(2));

    printeableReceiptData.value = {
        company: copy_company,
        invoicesToCancel: copy_invoicesToCancel,
        documentsCancelation: copy_documentsCancelation,
        saldo: copy_saldo,
    };
};

const printReceipt: Function = async () => {
    loadingPrintReceipt.value = true;

    if (!printeableReceiptData.value) {
        showMessage("error", "Error al generar el recibo de pago", 2);
        return;
    }

    const receiptNumber: string = `${zeroLeft(
        printeableReceiptData.value.receipt.pto_vta_receipt,
        4
    )}-${zeroLeft(printeableReceiptData.value.receipt.number, 8)}`;

    const fileName = `${printeableReceiptData.value.company.name}-RECIBO DE PAGO ${receiptNumber}.pdf`;
    if (printeableReceiptData.value) {
        const receitpPdf = await fetchReport(
            "receipt-report",
            fileName,
            printeableReceiptData.value
        );

        if (receitpPdf) {
            setNullPrinteableReceiptData();
        }
    } else {
        showMessage("error", "Error al generar el recibo de pago", 2);
    }

    loadingPrintReceipt.value = false;

    cancelPrintReceipt();
};
</script>

<style scoped>
#to-pay-info,
#to-pay-results {
    display: flex;
    align-items: center;
    font-size: 18px;
    background-color: #c9d2d7;
    padding: 0 1rem;
    width: 70%;
}

#to-pay-info p,
#to-pay-results p {
    padding-top: 1rem;
    margin-right: 1rem;
}
#to-pay-container {
    display: flex;
    justify-content: space-between;
}
#to-pay-results {
    width: 30%;
    justify-content: flex-end;
}

#to-pay-action {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
}
#print-message {
    font-size: 18px;
}
</style>
