<template>
    <div class="full-width-table">
        <BorderLessHeading>
            <Cards>
                <template #title> Recibos </template>

                <TopToolBox>
                    <a-row :gutter="15" class="justify-content-center">
                        <a-col :xxl="6" :lg="6" :xs="24">
                            <SearchCustomer :multiple="false" :context="'receipt-list'" />
                        </a-col>

                        <a-col :xxl="16" :lg="16" :xs="24">
                            <BetweenDaysRangePicker />
                        </a-col>
                        <a-col :xxl="2" :lg="2" :xs="24">
                            <!-- <div class="table-toolbox-actions text-right">
                                <sdButton
                                    size="sm"
                                    type="secondary"
                                    transparented
                                    @click="print"
                                    :loading="printSpinner"
                                >
                                    Exportar
                                </sdButton>
                            </div> -->
                        </a-col>
                    </a-row>
                </TopToolBox>
                <TableDefaultStyle class="ninjadash-having-header-bg">
                    <TopSellerWrap>
                        <div class="table-bordered top-seller-table table-responsive">
                            <a-table
                                :columns="receipTableColum"
                                :loading="props.loading"
                                :dataSource="receiptList"
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
                                        {{ record.customer.name }}
                                        {{ record.customer.lastname }}
                                    </template>
                                    <template v-if="column.key === 'number'">
                                        {{
                                            zeroLeft(record.receipt.pto_vta_receipt, 4) +
                                            '-' +
                                            zeroLeft(record.receipt.number, 8)
                                        }}
                                    </template>
                                    <template v-if="column.key === 'date'">
                                        {{ $filters.argentinianDate(record.receipt.date) }}
                                    </template>

                                    <template v-if="column.key === 'importe'">
                                        {{ $filters.formatCurrency(parseFloat(record.receipt.total)) }}
                                    </template>

                                    <template v-if="column.key === 'actions'">
                                        <ReceiptPrint :printeableData="record" />
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
                        @showSizeChange="onShowSizeChange"
                        @change="changeCurrentPage"
                        :show-total="showTotal"
                    >
                        <template #buildOptionText="props">
                            <span> {{ props.value }} Comprobantes por pág.</span>
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
        <Html2CanvasPdf />
    </div>
</template>

<script setup lang="ts">
import { BorderLessHeading, TableDefaultStyle } from '../../../styled';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { TopSellerWrap } from '../../../../views/dashboard/style';
import { TopToolBox } from '../../invoice/Style';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useFilterSearchByBetweenDaysStore } from '@/app/store/filter-search/useFilterSearchByBetweenDaysStore';
import { useFilterSearchByCustomerStore } from '@/app/store/filter-search/useFilterSearchByCustomerStore';
import { useInvoiceNotaCreditoComposable } from '@/app/composables/invoice/useInvoiceNotaCreditoComposable';
import { useReceiptListComposable } from '@/app/composables/receipt/useReceiptListComposable';
import BetweenDaysRangePicker from '../../shared/BetweenDaysRangePicker.vue';
import Cards from '../../cards/frame/CardsFrame.vue';
import dayjs from 'dayjs';
import RowNumber from '../../shared/RowNumber.vue';
import SearchCustomer from '../../customer/SearchCustomer.vue';
import { ColumnProps } from 'ant-design-vue/lib/table';
import type { PrinteableReceiptData } from '@/app/types/Receipt';
import ReceiptPrint from './ReceiptPrint.vue';
import { zeroLeft } from '@/app/helpers/zero-left';

const { invoiceForNotaCredito } = useInvoiceNotaCreditoComposable();
const { CompanyGetter } = useCompanyComposable();
const { from, to } = storeToRefs(useFilterSearchByBetweenDaysStore());
const { customer } = storeToRefs(useFilterSearchByCustomerStore());
const { currentPage, itemsPerPage, status_id, receiptList, totalItems } = useReceiptListComposable();

type Props = {
    loading: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    loading: false,
});

const pageSizeOptions = ref<string[]>(['10', '20', '30', '40', '50', '100']);
/* const filterKey = ref(['Adeudada', 'Parcialmente Cancelada', 'Cancelada']); */
const stateValue = ref('');
const sortDefault = ref();
const printSpinner = ref<boolean>(false);
const dataExcel = ref([]);
const selectedCustomerId = ref<any>(null);

const receipTableColum: ColumnProps<PrinteableReceiptData>[] = [
    {
        title: '#',
        dataIndex: 'row',
        key: 'row',
    },
    {
        title: 'Cliente',
        dataIndex: 'customer',
        key: 'customer',
        align: 'left',
        sorter: {
            compare: (a: PrinteableReceiptData, b: PrinteableReceiptData) => {
                const nameA = `${a.customer.name} ${a.customer.lastname}`;

                const nameB = `${b.customer.name} ${b.customer.lastname}`;

                if (nameA < nameB) {
                    return -1;
                }

                if (nameA > nameB) {
                    return 1;
                }

                return 0;
            },
            multiple: 1,
        },
    },
    {
        title: 'Fecha',
        dataIndex: 'date',
        key: 'date',
        align: 'center',
        sorter: {
            compare: (a: PrinteableReceiptData, b: PrinteableReceiptData) => {
                const dayA = dayjs(a.receipt.date);

                const dayB = dayjs(b.receipt.date);

                if (dayA.isBefore(dayB)) {
                    return -1;
                } else {
                    return 1;
                }
            },
            multiple: 3,
        },
    },
    {
        title: 'Número',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
    },
    {
        title: 'Importe',
        dataIndex: 'importe',
        key: 'importe',
        align: 'right',
        sorter: {
            compare: (a: PrinteableReceiptData, b: PrinteableReceiptData) => {
                if (a.receipt.total < b.receipt.total) {
                    return -1;
                }

                if (a.receipt.total > b.receipt.total) {
                    return 1;
                }

                return 0;
            },
            multiple: 2,
        },
    },
    {
        title: 'Acciones',
        dataIndex: 'actions',
        key: 'actions',
        align: 'center',
    },
];

const showTotal = (totalPages: number, range: [number, number]) => {
    totalPages = Number(totalPages);

    // Convertir los elementos de range a números y asegurarse de que siempre hay exactamente dos elementos
    const newRange: [number, number] = [Number(range[0]), Number(range[1])];

    // Comprobar si los datos son números válidos
    if (isNaN(totalPages) || newRange.some(isNaN)) {
        return 'Cargando...';
    }
    return `${newRange[0]}-${newRange[1]} de ${totalPages} comprobantes`;
};

const changeCurrentPage = (current: number, pageSize: number) => {
    currentPage.value = current;
    itemsPerPage.value = pageSize;
};

const onShowSizeChange = (current: number, pageSize: number) => {
    itemsPerPage.value = pageSize;
};

const handleChangeForFilter = (e: any): void => {
    stateValue.value = e.target.value;

    const statusesArray = [
        { name: 'all', value: null },
        { name: 'Adeudada', value: 1 },
        { name: 'Parcialmente Cancelada', value: 2 },
        { name: 'Cancelada', value: 3 },
    ];

    const index = statusesArray.findIndex((row) => row.name === e.target.value);
    status_id.value = statusesArray[index].value;
};
</script>

<style scoped>
.selected-row {
    background-color: yellow;
}
.centered-header {
    text-align: center;
}
.wrap-pagination {
    padding: 3rem;
    text-align: center;
}
.custom-class {
    color: red;
    text-align: left;
}
</style>
