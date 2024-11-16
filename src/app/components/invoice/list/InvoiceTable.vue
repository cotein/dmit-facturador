<template>
    <div class="full-width-table">
        <BorderLessHeading>
            <Cards>
                <template #title>
                    <div class="ninjadash-card-title-wrap">
                        <span class="ninjadash-card-title-text"> Ventas </span>
                        <DrawerNotaCredito :invoice-list="invoiceForNotaCredito" />
                    </div>
                </template>
                <template #button>
                    <div class="ninjadash-card-nav">
                        <ul>
                            <!-- <li :class="products === 'today' ? 'ninjadash-active' : 'ninjadash-today'">
								<router-link @click="(e: any) => handleActiveChangeProducts(e, 'today')" to="#">
									Today
								</router-link>
							</li>
							<li :class="products === 'week' ? 'ninjadash-active' : 'ninjadash-week'">
								<router-link @click="(e: any) => handleActiveChangeProducts(e, 'week')" to="#">
									Week
								</router-link>
							</li>
							<li :class="products === 'month' ? 'ninjadash-active' : 'ninjadash-month'">
								<router-link @click="(e: any) => handleActiveChangeProducts(e, 'month')" to="#">
									Month
								</router-link>
							</li> -->
                        </ul>
                    </div>
                </template>
                <TopToolBox>
                    <a-row :gutter="15" class="justify-content-center" v-if="props.viewSearch">
                        <a-col :xxl="6" :lg="6" :xs="24" v-if="props.isSale">
                            <SearchCustomer :multiple="false" :context="'invoice'" />
                        </a-col>
                        <a-col :xxl="9" :lg="9" :xs="24">
                            <div class="table-toolbox-menu">
                                <span class="toolbox-menu-title"> Estado:</span>
                                <a-radio-group @change="handleChangeForFilter" v-model:value="sortDefault">
                                    <a-radio-button :class="stateValue === '' && 'active'" value="all"
                                        >Todas</a-radio-button
                                    >
                                    <a-radio-button
                                        v-for="value in [...new Set(filterKey)]"
                                        :key="value"
                                        :value="value"
                                        :class="stateValue === value && 'active'"
                                    >
                                        {{ value }}
                                    </a-radio-button>
                                </a-radio-group>
                            </div>
                        </a-col>
                        <a-col :xxl="7" :lg="7" :xs="24">
                            <BetweenDaysRangePicker />
                        </a-col>
                        <a-col :xxl="2" :lg="2" :xs="24" v-if="props.isSale">
                            <div class="table-toolbox-actions text-right">
                                <sdButton
                                    size="sm"
                                    type="secondary"
                                    transparented
                                    @click="print"
                                    :loading="printSpinner"
                                >
                                    Exportar
                                </sdButton>
                            </div>
                        </a-col>
                    </a-row>
                </TopToolBox>
                <TableDefaultStyle class="ninjadash-having-header-bg">
                    <TopSellerWrap>
                        <div class="table-bordered top-seller-table table-responsive">
                            <a-table
                                :columns="invoiceTableColumns"
                                :dataSource="props.list"
                                :pagination="false"
                                :loading="props.loading"
                                :rowSelection="null"
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
                                        <InvoiceCustomer :record="record" :index="index" />
                                    </template>
                                    <template v-if="column.key === 'number'">
                                        <InvoiceNumber :record="record" :index="index" />
                                    </template>
                                    <template v-if="column.key === 'date'">
                                        <InvoiceDate :record="record" :index="index" :date="record.voucher.cbte_fch" />
                                    </template>
                                    <template v-if="column.key === 'sale_condition'">
                                        <ShowSomeStringData
                                            :string="record.voucher.sale_conditions"
                                            custom-class="custom-class"
                                        />
                                    </template>
                                    <template v-if="column.key === 'value'">
                                        <InvoiceImport :record="record" :index="index" />
                                    </template>
                                    <template v-if="column.key === 'vto_pago'">
                                        <InvoiceDate
                                            :record="record"
                                            :index="index"
                                            :date="record.voucher?.fch_vto_pago"
                                        />
                                    </template>
                                    <template v-if="column.key === 'status'">
                                        <InvoiceStatus :record="record" :index="index" />
                                    </template>
                                    <template v-if="column.key === 'actions' && props.viewButtonsColumn">
                                        <InvoiceActions :record="record" :index="index" />
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
                            <span>{{ props.value }} Comprobantes por pág.</span>
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
import { ExcelService } from '@/app/excel/ExcelService';
import { getInvoiceList } from '@/api/invoice/invoice-api';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { TopSellerWrap } from '../../../../views/dashboard/style';
import { TopToolBox } from '../Style';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useFilterSearchByBetweenDaysStore } from '@/app/store/filter-search/useFilterSearchByBetweenDaysStore';
import { useFilterSearchByCustomerStore } from '@/app/store/filter-search/useFilterSearchByCustomerStore';
import { useInvoiceListStore } from '@/app/store/invoice/useInvoiceListStore';
import { useInvoiceNotaCreditoComposable } from '@/app/composables/invoice/useInvoiceNotaCreditoComposable';
import BetweenDaysRangePicker from '../../shared/BetweenDaysRangePicker.vue';
import Cards from '../../../components/cards/frame/CardsFrame.vue';
import dayjs from 'dayjs';
import DrawerNotaCredito from '@/app/components/invoice/notaCredito/DrawerNotaCredito.vue';
import Html2CanvasPdf from '@/app/pdf/Html2CanvasPdf.vue';
import InvoiceActions from './Row/InvoiceActions.vue';
import InvoiceCustomer from './Row/InvoiceCustomer.vue';
import InvoiceDate from './Row/InvoiceDate.vue';
import InvoiceImport from './Row/InvoiceImport.vue';
import InvoiceNumber from './Row/InvoiceNumber.vue';
import InvoiceStatus from './Row/InvoiceStatus.vue';
import RowNumber from '../../shared/RowNumber.vue';
import SearchCustomer from '../../customer/SearchCustomer.vue';
import ShowSomeStringData from '../../shared/ShowSomeStringData.vue';
import type { InvoiceList } from '@/app/types/Invoice';
import { ColumnProps } from 'ant-design-vue/lib/table';

const { invoiceForNotaCredito } = useInvoiceNotaCreditoComposable();
const { CompanyGetter } = useCompanyComposable();
const { from, to } = storeToRefs(useFilterSearchByBetweenDaysStore());
const { customer } = storeToRefs(useFilterSearchByCustomerStore());
const { currentPage, itemsPerPage, totalPages, status_id, totalItems } = storeToRefs(useInvoiceListStore());

type Props = {
    list: InvoiceList;
    loading: boolean;
    viewSearch: boolean;
    viewButtonsColumn: boolean;
    isSale: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    list: [] as InvoiceList[],
    loading: false,
    viewSearch: true,
    viewButtonsColumn: true,
    isSale: true,
});

type InvoiceTableColumn = {
    title: string;
    dataIndex: string;
    key: string;
    sorter?: any;
};
const pageSizeOptions = ref<string[]>(['10', '20', '30', '40', '50', '100']);
const filterKey = ref(['Adeudada', 'Parcialmente Cancelada', 'Cancelada']);
const stateValue = ref('');
const sortDefault = ref();
const printSpinner = ref<boolean>(false);
const dataExcel = ref([]);
const selectedCustomerId = ref<any>(null);

const print = async () => {
    const print = 'yes';

    const resp = await getInvoiceList(
        CompanyGetter!.value!.id ?? 0,
        customer.value?.value,
        status_id.value,
        from.value,
        to.value,
        currentPage.value,
        itemsPerPage.value,
        print,
    );

    const excel = new ExcelService();

    excel.download(resp.data, 'Listado Ventas');
};

const invoiceTableColumns: ColumnProps<InvoiceTableColumn>[] = [
    {
        title: '#',
        dataIndex: 'row',
        key: 'row',
    },
    {
        title: 'Cliente',
        dataIndex: 'customer',
        key: 'customer',
        sorter: {
            compare: (a: InvoiceList, b: InvoiceList) => {
                const nameA = `${a.customer.name} ${a.customer.last_name}`;

                const nameB = `${b.customer.name} ${b.customer.last_name}`;

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
        width: '17%',
        align: 'left',
    },
    {
        title: 'Fecha',
        dataIndex: 'date',
        key: 'date',
        sorter: {
            compare: (a: InvoiceList, b: InvoiceList) => {
                if (!a.voucher || !a.voucher.cbte_fch || !b.voucher || !b.voucher.cbte_fch) {
                    return 1;
                }
                const dayA = dayjs(a.voucher.cbte_fch);

                const dayB = dayjs(b.voucher.cbte_fch);

                if (dayA.isBefore(dayB)) {
                    return -1;
                } else {
                    return 1;
                }
            },
            multiple: 3,
        },
        width: '9%',
        align: 'center',
    },
    {
        title: 'Número',
        dataIndex: 'number',
        key: 'number',
        width: '16%',
        align: 'center',
    },
    {
        title: 'Importe',
        dataIndex: 'value',
        key: 'value',
        sorter: {
            compare: (a: InvoiceList, b: InvoiceList) => {
                if (!a.voucher || !a.voucher.cbte_fch || !b.voucher || !b.voucher.cbte_fch) {
                    return 1;
                }
                if (a.voucher.total < b.voucher.total) {
                    return -1;
                }

                if (a.voucher.total > b.voucher.total) {
                    return 1;
                }

                return 0;
            },
            multiple: 2,
        },
        width: '16%',
        align: 'right',
    },
    {
        title: 'Vto. Pago',
        dataIndex: 'vto_pago',
        key: 'vto_pago',
        width: '10%',
        align: 'center',
    },
    {
        title: 'Cond. de venta',
        dataIndex: 'sale_condition',
        key: 'sale_condition',
    },
    {
        title: 'Estado',
        dataIndex: 'status',
        key: 'status',
        width: '10%',
    },
];

if (props.isSale) {
    invoiceTableColumns.push({
        title: 'Acción',
        dataIndex: 'actions',
        key: 'actions',
        width: '3%',
        align: 'center',
    });
}

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

/* const rowSelection = {
    hideSelectAll: true,
    onChange: (selectedRowKeys: (string | number)[], selectedRows: InvoiceList) => {
        invoiceForNotaCredito.value = selectedRows;
    },
    onSelect: (record: any, selected: boolean, selectedRows: InvoiceList) => {
        console.log('🚀 ~ record:', record);
        invoiceForNotaCredito.value = selectedRows;
    },
    onSelectAll: (selected: boolean, selectedRows: InvoiceList) => {
        invoiceForNotaCredito.value = selectedRows;
    },
}; */
const rowSelection = {
    hideSelectAll: true,
    onChange: (selectedRowKeys: (string | number)[], selectedRows: InvoiceList) => {
        invoiceForNotaCredito.value = selectedRows;
    },
    onSelect: (record: any, selected: boolean, selectedRows: InvoiceList) => {
        if (selected) {
            if (selectedCustomerId.value === null) {
                // Si es la primera selección, almacena el ID del cliente
                selectedCustomerId.value = record.customer.id;
            } else if (record.customer.id !== selectedCustomerId.value) {
                // Si la factura seleccionada no pertenece al cliente almacenado, revierte la selección
                return false; // Aquí necesitas implementar la lógica para revertir la selección
            }
        } else if (selectedRows.length === 0) {
            // Si no hay más filas seleccionadas, restablece el ID del cliente
            selectedCustomerId.value = null;
        }
        invoiceForNotaCredito.value = selectedRows;
    },
    onSelectAll: (selected: boolean, selectedRows: InvoiceList) => {
        if (selected) {
            // Implementa una lógica similar a onSelect aquí para manejar la selección de todas las filas
        } else {
            // Si se deseleccionan todas las filas, restablece el ID del cliente
            selectedCustomerId.value = null;
        }
        invoiceForNotaCredito.value = selectedRows;
    },
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
