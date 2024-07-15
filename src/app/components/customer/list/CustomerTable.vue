<template>
    <div class="full-width-table">
        <BorderLessHeading>
            <Cards>
                <template #title>
                    <div class="ninjadash-card-title-wrap">
                        <span class="ninjadash-card-title-text"> Listado de Clientes </span>
                    </div>
                </template>
                <TopToolBox>
                    <a-row :gutter="15" class="justify-content-center">
                        <a-col :xxl="6" :lg="6" :xs="24" class="left">
                            <SearchCustomer :multiple="false" :context="'customer'" />
                        </a-col>
                        <a-col :xxl="9" :lg="9" :xs="24">
                            <div class="table-toolbox-menu">
                                <span class="toolbox-menu-title"> Estado:</span>
                                <a-radio-group @change="handleChangeForFilter" v-model:value="sortDefault">
                                    <a-radio-button :class="stateValue === '' && 'active'" value="Todos"
                                        >Todos</a-radio-button
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
                    </a-row>
                </TopToolBox>
                <TableDefaultStyle class="ninjadash-having-header-bg">
                    <TopSellerWrap>
                        <div class="table-bordered top-seller-table table-responsive">
                            <a-table
                                :columns="customerTableColumns"
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
                                        <CustomerName :customer="record" :index="index" />
                                    </template>
                                    <template v-if="column.key === 'document_type'">
                                        <CustomerDocumentType :customer="record" :index="index" />
                                    </template>
                                    <template v-if="column.key === 'number'">
                                        <CustomerAfipNumber :customer="record" :index="index" />
                                    </template>
                                    <template v-if="column.key === 'inscription'">
                                        <CustowmerInscription :customer="record" :index="index" />
                                    </template>
                                    <template v-if="column.key === 'status'">
                                        <CustomerStatus :customer="record" :index="index" />
                                    </template>
                                    <!-- <template v-if="column.key === 'actions' && props.viewButtonsColumn">
                                        <InvoiceActions :customer="record" :index="index" />
                                    </template> -->
                                </template>
                            </a-table>
                        </div>
                        <div class="wrap-pagination">
                            <a-pagination
                                :total="totalPages"
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
                    </TopSellerWrap>
                </TableDefaultStyle>
            </Cards>
        </BorderLessHeading>
        <Html2CanvasPdf />
    </div>
</template>

<script setup lang="ts">
import { BorderLessHeading, TableDefaultStyle } from '../../../styled';
import { ref } from 'vue';
import { TopSellerWrap } from '../../../../views/dashboard/style';
import { TopToolBox } from '../Style';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import Cards from '../../../../components/cards/frame/CardsFrame.vue';
import CustomerAfipNumber from '../list/tableFields/CustomerAfipNumber.vue';
import CustomerDocumentType from '../list/tableFields/CustomerDocumentType.vue';
import CustomerName from '../list/tableFields/CustomerName.vue';
import CustowmerInscription from '../list/tableFields/CustomerInscription.vue';
import CustomerStatus from '../list/tableFields/CustomerStatus.vue';
import Html2CanvasPdf from '@/app/pdf/Html2CanvasPdf.vue';
import RowNumber from '../../shared/RowNumber.vue';
import SearchCustomer from '../SearchCustomer.vue';
import type { Customer } from '@/app/types/Invoice';
import { useCustomerListComposable } from '@/app/composables/customer/useCustomerListComposable';

const { currentPage, itemsPerPage, totalPages, status } = useCustomerListComposable();
const { CompanyGetter } = useCompanyComposable();
type IsActiveType = 'active' | 'inactive' | 'all';

type Props = {
    list: Customer[];
    loading: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    list: [] as Customer[],
    loading: false,
});

type CustomerTableColumn = {
    title: string;
    dataIndex: string;
    key: string;
    sorter?: any;
};

const filterKey = ref(['Activos', 'No activos']);
const stateValue = ref<string>('all');
const sortDefault = ref();

const customerTableColumns: CustomerTableColumn[] = [
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
            compare: (a: Customer, b: Customer) => {
                console.log('🚀 ~ a:', a);
                const nameA = `${a.name} ${a.last_name}`;

                const nameB = `${b.name} ${b.last_name}`;

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
        title: 'Doc. Tipo',
        dataIndex: 'document_type',
        key: 'document_type',
    },
    {
        title: 'Número',
        dataIndex: 'number',
        key: 'number',
    },
    {
        title: 'Inscripción',
        dataIndex: 'inscription',
        key: 'inscription',
    },
    {
        title: 'Estado',
        dataIndex: 'status',
        key: 'status',
    },
];

const pageSizeOptions = ref<string[]>(['10', '20', '30', '40', '50', '100']);

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
    console.log('🚀 ~ handleChangeForFilter ~ e.target.value:', e.target.value);
    if (!e.target.value) {
        status.value = 'all';
        return;
    }
    stateValue.value = e.target.value;

    const statusesArray = [
        { name: 'Todos', value: 'all' },
        { name: 'Activos', value: 'active' },
        { name: 'No activos', value: 'inactive' },
    ];

    const index = statusesArray.findIndex((row) => row.name === e.target.value);

    status.value = statusesArray[index].value as IsActiveType;
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

.left {
    text-align: left;
}
</style>
