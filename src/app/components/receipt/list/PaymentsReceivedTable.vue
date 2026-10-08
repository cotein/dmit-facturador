<template>
    <div class="full-width-table">
        <BorderLessHeading>
            <Cards>
                <template #title> Pagos recibidos </template>

                <div class="payments-actions">
                    <a-button type="primary" @click="accountPaymentDrawer?.open()">
                        <unicon name="plus-circle"></unicon>
                        Pago a cuenta
                    </a-button>
                    <a-button @click="goToNewReceipt">
                        <unicon name="file-plus"></unicon>
                        Pago con comprobantes
                    </a-button>
                </div>

                <PaymentsReceivedFilters />

                <TableDefaultStyle class="ninjadash-having-header-bg">
                    <TopSellerWrap>
                        <div class="table-bordered top-seller-table table-responsive">
                            <a-table
                                :columns="columns"
                                :loading="isLoading"
                                :dataSource="payments"
                                :pagination="false"
                                :showSorterTooltip="{ title: 'Clic para ordenar' }"
                            >
                                <template #headerCell="{ title }">
                                    <div style="text-align: center">{{ title }}</div>
                                </template>

                                <template #bodyCell="{ column, record, index }">
                                    <template v-if="column.key === 'row'">
                                        <RowNumber :index="index" />
                                    </template>

                                    <template v-if="column.key === 'customer'">
                                        {{ record.customer?.name ?? '-' }}
                                    </template>

                                    <template v-if="column.key === 'date'">
                                        {{ record.date ? $filters.argentinianDate(record.date) : '-' }}
                                    </template>

                                    <template v-if="column.key === 'receipt'">
                                        <span v-if="record.receipt_number">#{{ record.receipt_number }}</span>
                                        <span v-else>-</span>
                                    </template>

                                    <template v-if="column.key === 'payment_type'">
                                        {{ record.payment_type ?? '-' }}
                                    </template>

                                    <template v-if="column.key === 'reference'">
                                        {{ record.reference ?? '-' }}
                                    </template>

                                    <template v-if="column.key === 'amount'">
                                        {{ $filters.formatCurrency(record.amount) }}
                                    </template>

                                    <template v-if="column.key === 'status'">
                                        <a-tag :color="statusColor(record.status)">{{ record.status_label }}</a-tag>
                                    </template>

                                    <template v-if="column.key === 'imputed'">
                                        <div v-if="record.imputed && record.imputed.length">
                                            <div v-for="invoice in record.imputed" :key="invoice.sale_invoice_id">
                                                {{ invoice.comprobante }} ·
                                                {{ $filters.formatCurrency(invoice.import_payment) }}
                                            </div>
                                        </div>
                                        <span v-else>Sin imputar</span>
                                    </template>

                                    <template v-if="column.key === 'actions'">
                                        <a-tooltip
                                            :title="
                                                record.status === 'anulado'
                                                    ? 'Este recibo ya está anulado'
                                                    : 'Anular el recibo y devolver el estado de los comprobantes'
                                            "
                                        >
                                            <a-button
                                                type="link"
                                                danger
                                                :disabled="record.status === 'anulado'"
                                                @click="openCancelModal(record)"
                                            >
                                                Anular
                                            </a-button>
                                        </a-tooltip>
                                    </template>
                                </template>
                            </a-table>
                        </div>
                    </TopSellerWrap>
                </TableDefaultStyle>

                <div class="wrap-pagination">
                    <a-pagination
                        :total="totalItems"
                        v-model:current="currentPage"
                        v-model:page-size="itemsPerPage"
                        :page-size-options="pageSizeOptions"
                        show-size-changer
                        :show-total="showTotal"
                        @showSizeChange="onShowSizeChange"
                    >
                        <template #buildOptionText="props">
                            <span> {{ props.value }} Pagos por pág.</span>
                        </template>
                        <template #itemRender="{ type, originalElement }">
                            <a v-if="type === 'prev'">Ant.</a>
                            <a v-else-if="type === 'next'">Sig.</a>
                            <component :is="originalElement" v-else></component>
                        </template>
                    </a-pagination>
                </div>
            </Cards>
        </BorderLessHeading>

        <a-modal
            v-model:visible="showCancelModal"
            title="Anular el recibo"
            ok-text="Anular"
            cancel-text="Cancelar"
            :confirm-loading="isCancelling"
            @ok="confirmCancel"
        >
            <p>
                Se anula el recibo del pago de
                <strong>{{ selected?.customer?.name ?? 'el cliente' }}</strong> y se devuelve el estado de cada
                comprobante imputado. El recibo queda en el listado como anulado, con su motivo.
            </p>

            <a-textarea
                v-model:value="cancelReason"
                :rows="3"
                :maxlength="255"
                placeholder="Motivo de la anulación (opcional)"
            />
        </a-modal>

        <AccountPaymentDrawer ref="accountPaymentDrawer" :company-id="companyId" @saved="onAccountPaymentSaved" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { ColumnProps } from 'ant-design-vue/lib/table';
import { BorderLessHeading, TableDefaultStyle } from '@/app/styled';
import Cards from '@/app/components/cards/frame/CardsFrame.vue';
import { TopSellerWrap } from '@/app/pages/dashBoard/style';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useReceiptPaymentsComposable } from '@/app/composables/receipt/useReceiptPaymentsComposable';
import type { ReceiptPaymentRow } from '@/api/receipt-payment/receipt-payment-api';
import RowNumber from '../../shared/RowNumber.vue';
import PaymentsReceivedFilters from './PaymentsReceivedFilters.vue';
import AccountPaymentDrawer from '../AccountPaymentDrawer.vue';

const { payments, isLoading, currentPage, itemsPerPage, totalItems, anularRecibo, isCancelling } =
    useReceiptPaymentsComposable();

const router = useRouter();
const { CompanyGetter } = useCompanyComposable();

const companyId = computed<number | null>(() => CompanyGetter.value?.id ?? null);

// El alta con comprobantes vive en la pantalla de siempre: desde acá se llega
// con un clic, para que los tres accesos caigan en el mismo flujo.
const accountPaymentDrawer = ref<any>(null);

const goToNewReceipt = () => {
    router.push({ name: 'NewReceiptPage' });
};

const onAccountPaymentSaved = () => {
    // La mutación ya invalida la consulta del listado.
};

const pageSizeOptions = ref<string[]>(['10', '25', '50', '100']);

const showCancelModal = ref(false);
const cancelReason = ref('');
const selected = ref<ReceiptPaymentRow | null>(null);

const columns: ColumnProps<any>[] = [
    { title: '#', dataIndex: 'row', key: 'row', width: 60 },
    { title: 'Cliente', dataIndex: 'customer', key: 'customer' },
    { title: 'Fecha', dataIndex: 'date', key: 'date', width: 120 },
    { title: 'Recibo', dataIndex: 'receipt', key: 'receipt', width: 100 },
    { title: 'Medio de pago', dataIndex: 'payment_type', key: 'payment_type' },
    { title: 'Referencia', dataIndex: 'reference', key: 'reference' },
    { title: 'Importe', dataIndex: 'amount', key: 'amount', align: 'right' },
    { title: 'Estado', dataIndex: 'status', key: 'status' },
    { title: 'Imputado a', dataIndex: 'imputed', key: 'imputed' },
    { title: 'Acciones', dataIndex: 'actions', key: 'actions', align: 'center' },
];

const statusColor = (status: string): string => {
    if (status === 'anulado') {
        return 'red';
    }

    if (status === 'a_cuenta') {
        return 'blue';
    }

    if (status === 'parcial') {
        return 'orange';
    }

    if (status === 'cancelado') {
        return 'green';
    }

    return 'purple';
};

const openCancelModal = (record: ReceiptPaymentRow) => {
    selected.value = record;
    cancelReason.value = '';
    showCancelModal.value = true;
};

const confirmCancel = async () => {
    if (!selected.value) {
        return;
    }

    try {
        await anularRecibo({
            receiptId: selected.value.receipt_id,
            reason: cancelReason.value ? cancelReason.value : null,
        });

        showCancelModal.value = false;
        selected.value = null;
    } catch (error) {
        console.log('🚀 ~ confirmCancel ~ error:', error);
    }
};

const showTotal = (total: number, range: [number, number]) => {
    return `${range[0]}-${range[1]} de ${total} pagos`;
};

const onShowSizeChange = (current: number, pageSize: number) => {
    itemsPerPage.value = pageSize;
    currentPage.value = 1;
};
</script>

<style scoped>
.payments-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin: 0 24px 8px;
}
</style>
