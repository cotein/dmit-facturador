<template>
    <div>
        <a-modal
            v-model:visible="VisibleGetter"
            title="Detalle de pagos"
            @ok="onClose"
            width="75%"
            class="custom-modal"
        >
            <template v-if="individualInvoice === null">
                <div class="spin-container">
                    <a-spin size="large" />
                    <p>Buscando...</p>
                </div>
            </template>
            <template v-else>
                <div>
                    <h3 class="title">
                        {{ Title }}
                        <p>
                            Importe del comprobante:
                            {{ $filters.formatCurrency(individualInvoice.voucher?.total) }}.-
                        </p>
                    </h3>
                </div>

                <a-table
                    :columns="columns"
                    :dataSource="individualInvoice.paymentHistory"
                    rowKey="number"
                    :pagination="false"
                >
                    <template #headerCell="{ title }">
                        <div style="text-align: center">{{ title }}</div>
                    </template>

                    <template #bodyCell="{ column, record, index }">
                        <template v-if="column.key === 'row'">
                            {{ index + 1 }}
                        </template>
                        <template v-if="column.key === 'created_at'">
                            {{ record.created_at }}
                        </template>
                        <template v-if="column.key === 'receipt'">
                            {{ zeroLeft(record.number, 8) }}
                        </template>
                        <template v-if="column.key === 'import_payment'">
                            {{ $filters.formatCurrency(parseFloat(record.import_payment)) }}
                        </template>
                        <template v-if="column.key === 'percentage_payment'">
                            {{ record.percentage_payment }}%
                        </template>

                        <template v-if="column.key === 'import_paid_history'">
                            {{ $filters.formatCurrency(parseFloat(record.import_paid_history)) }}
                        </template>
                        <template v-if="column.key === 'percentage_paid_history'">
                            {{ record.percentage_paid_history }}%
                        </template>
                        <template v-if="column.key === 'saldo'">
                            {{ $filters.formatCurrency(parseFloat(record.saldo)) }}
                        </template>
                        <template v-if="column.key === 'actions'">
                            <ReceiptPrint :receipt_id="record.id" />
                        </template>
                    </template>
                </a-table>
            </template>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { onUnmounted, computed } from 'vue';
import { useVisibleComposable } from '@/app/composables/visible/useVisibleComposable';
import { useInvoiceListComposable } from '@/app/composables/invoice/useInvoiceListComposable';
import { zeroLeft } from '@/app/helpers/zero-left';
import { ColumnProps } from 'ant-design-vue/lib/table';
import type { PreviousPayment } from '@/app/types/Receipt';
import ReceiptPrint from '../../receipt/list/ReceiptPrint.vue';

const { setVisible, VisibleGetter } = useVisibleComposable();

const { individualInvoice } = useInvoiceListComposable();

const onClose = () => {
    setVisible(false);
};

onUnmounted(() => {
    setVisible(false);
    individualInvoice.value = null;
});

const Title = computed(() => {
    if (individualInvoice.value === null) {
        return null;
    }
    return `Detalle de pago ${individualInvoice.value.voucher?.name}  ${individualInvoice.value.voucher?.pto_vta} - ${individualInvoice.value.voucher?.cbte_desde}`;
});

const columns: ColumnProps<PreviousPayment>[] = [
    {
        title: '#',
        dataIndex: 'row',
        key: 'row',
        align: 'center',
        width: '15px',
    },
    {
        title: 'Fecha',
        dataIndex: 'created_at',
        key: 'created_at',
        align: 'center',
        width: '131px',
    },
    {
        title: 'Pagado Total',
        dataIndex: 'import_paid_history',
        key: 'import_paid_history',
        align: 'right',
    },
    {
        title: 'Importe de éste pago',
        dataIndex: 'import_payment',
        key: 'import_payment',
        align: 'right',
    },
    {
        title: 'Recibo',
        dataIndex: 'receipt',
        key: 'receipt',
        align: 'center',
    },
    {
        title: 'Pagado Total %',
        dataIndex: 'percentage_paid_history',
        key: 'percentage_paid_history',
        align: 'right',
    },
    {
        title: 'Importe de éste pago %',
        dataIndex: 'percentage_payment',
        key: 'percentage_payment',
        align: 'right',
    },
    {
        title: 'Saldo',
        dataIndex: 'saldo',
        key: 'saldo',
        align: 'right',
    },
    {
        title: 'Acciones',
        dataIndex: 'actions',
        key: 'actions',
        align: 'center',
    },
];

const handleOk = () => {
    setVisible(false);
};

const handleCancel = () => {
    setVisible(false);
};
</script>

<style scoped>
.spin-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    flex-direction: column;
}
.spin-container p {
    margin-top: 1rem;
}

.title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
}
.custom-modal .ant-modal-mask {
    background-color: rgba(0, 0, 0, 0) !important; /* Hacer el fondo transparente */
}
</style>
