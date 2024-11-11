<template>
    <a-modal
        v-model:visible="openModalAsignPaymentToInvoices"
        @ok="handleCreateReceipt"
        @cancel="cancelModalAsignPaymentToInvoices"
        okText="Generar recibo de pago"
        width="75%"
        :wrap-style="{ overflow: 'hidden' }"
        :confirmLoading="isLoading"
    >
        <template #title>
            <div class="title">
                <h3>Distribuir pago</h3>
                <span>{{ $filters.formatCurrency(TotalToPay) }}</span>
            </div>
        </template>
        <a-radio-group v-model:value="distributeTotal" name="radioGroup" class="radio-group">
            <a-radio value="lowestToHighest">Ordenar saldo de menor a mayor y procesar</a-radio>
            <a-radio value="highestToLowest">Ordenar saldo de mayor a menor y procesar</a-radio>
        </a-radio-group>

        <a-table
            :columns="columns"
            :dataSource="invoicesToCancel"
            :bordered="true"
            size="small"
            :pagination="false"
            :scroll="{ y: 400 }"
        >
            <template #headerCell="{ title }">
                <div style="text-align: center">{{ title }}</div>
            </template>

            <template #bodyCell="{ column, text, index }">
                <template v-if="column.key === 'numero'">
                    {{ index + 1 }}
                </template>
                <template v-if="column.key === 'comprobante'">
                    {{ text }}
                </template>
                <template v-if="column.key === 'importe'">
                    {{ $filters.formatCurrency(text) }}
                </template>

                <template v-if="column.key === 'importe_previo_pagado'">
                    {{ invoicesToCancel[index].importe_previo_pagado }}
                </template>
                <template v-if="column.key === 'saldo'">
                    {{ $filters.formatCurrency(invoicesToCancel[index].saldo) }}
                </template>
                <template v-if="column.key === 'toPayNow'">
                    <input-currency v-model="invoicesToCancel[index].toPayNowDisplay" />
                </template>
            </template>

            <template #footer="{ title }">
                <div style="text-align: center">{{ title }}</div>
            </template>
        </a-table>
    </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useReceiptComposable } from '@/app/composables/receipt/useReceiptComposable';
import { useInvoiceSorting } from '@/app/composables/receipt/useInvoiceSorting';
import type { TableColumnsType } from 'ant-design-vue';
import InputCurrency from '@/app/componentsBase/InputCurrency.vue';
import { useCreateReceiptMutation } from '@/app/composables/receipt/useCreateReceiptMutation';

const {
    invoices,
    selectedInvoiceIds,
    totalsDocumetsCancelation,
    openModalAsignPaymentToInvoices,
    totalInvoicedAmountToCancel,
    documentsCancelation,
} = useReceiptComposable();

const { invoicesToCancel, sortInvoices, TotalToPay } = useInvoiceSorting(
    invoices,
    selectedInvoiceIds,
    totalsDocumetsCancelation,
);

const distributeTotal = ref<string>('');

watch(distributeTotal, (newValue) => {
    if (newValue === 'lowestToHighest') {
        sortInvoices('asc');
    }
    if (newValue === 'highestToLowest') {
        sortInvoices('desc');
    }
});

const Diff = computed(() => {
    return totalInvoicedAmountToCancel.value - TotalToPay.value;
});

const { mutate: createReceipt, isLoading } = useCreateReceiptMutation();

const handleCreateReceipt = async () => {
    createReceipt({
        invoicesToCancel: invoicesToCancel.value,
        documentsCancelation: documentsCancelation.value,
        saldo: parseFloat(Diff.value.toFixed(2)),
    });
};

const columns: TableColumnsType = [
    { title: '#', dataIndex: 'numero', key: 'numero', width: 50, align: 'center' },
    {
        title: 'Comprobante',
        dataIndex: 'comprobante',
        key: 'comprobante',
        width: 300,
    },
    {
        title: 'Importe original',
        dataIndex: 'importe',
        key: 'importe',
        width: 250,
        align: 'right',
    },
    {
        title: 'Pagada previamente',
        dataIndex: 'importe_previo_pagado',
        key: 'importe_previo_pagado',
        align: 'right',
    },
    { title: 'Saldo', dataIndex: 'saldo', key: 'saldo', align: 'right' },
    { title: 'A pagar', dataIndex: 'toPayNow', key: 'toPayNow', align: 'right' },
];

const cancelModalAsignPaymentToInvoices = () => {
    openModalAsignPaymentToInvoices.value = false;
};
</script>

<style scoped>
.highlight {
    font-weight: bold;
    color: red;
}
.radio-group {
    margin-bottom: 2rem;
}
.title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 3rem;
}
.ant-table-thead > tr > th {
    text-align: center;
}
</style>
