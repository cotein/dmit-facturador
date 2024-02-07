<template>
	<div class="full-width-table">
		<BorderLessHeading>
			<Cards>
				<template #title>
					<div class="ninjadash-card-title-wrap">
						<span class="ninjadash-card-title-text"> Ventas </span>
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
						<a-col :xxl="6" :lg="6" :xs="24">
							<SearchCustomer :multiple="false" />
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
						<a-col :xxl="2" :lg="2" :xs="24">
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
							>
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
										<InvoiceDate :record="record" :index="index" />
									</template>
									<template v-if="column.key === 'value'">
										<InvoiceImport :record="record" :index="index" />
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
			</Cards>
		</BorderLessHeading>
	</div>
</template>

<script setup lang="ts">
import { BorderLessHeading, TableDefaultStyle } from '../../../styled';
import { ExcelService } from '@/app/excel/ExcelService';
import { ref } from 'vue';
import { TopSellerWrap } from '../../../../views/dashboard/style';
import { TopToolBox } from '../Style';
import BetweenDaysRangePicker from '../../shared/BetweenDaysRangePicker.vue';
import Cards from '../../../components/cards/frame/CardsFrame.vue';
import InvoiceActions from './Row/InvoiceActions.vue';
import InvoiceCustomer from './Row/InvoiceCustomer.vue';
import InvoiceDate from './Row/InvoiceDate.vue';
import InvoiceImport from './Row/InvoiceImport.vue';
import InvoiceNumber from './Row/InvoiceNumber.vue';
import InvoiceStatus from './Row/InvoiceStatus.vue';
import RowNumber from '../../shared/RowNumber.vue';
import SearchCustomer from '../../customer/SearchCustomer.vue';
import type { InvoiceList } from '@/app/types/Invoice';
import { getInvoiceList } from '@/api/invoice/invoice-api';
import { useInvoiceListStore } from '@/app/store/invoice/useInvoiceListStore';
import { useFilterSearchByCustomerStore } from '@/app/store/filter-search/useFilterSearchByCustomerStore';
import { useFilterSearchByBetweenDaysStore } from '@/app/store/filter-search/useFilterSearchByBetweenDaysStore';
import { storeToRefs } from 'pinia';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';

const { CompanyGetter } = useCompanyComposable();
const { from, to } = storeToRefs(useFilterSearchByBetweenDaysStore());
const { customer } = storeToRefs(useFilterSearchByCustomerStore());
const { currentPage, itemsPerPage, totalPages, invoiceList, status_id } = storeToRefs(useInvoiceListStore());

type Props = {
	list: InvoiceList | [];
	loading: boolean;
	viewSearch: boolean;
	viewButtonsColumn: boolean;
};

const props = withDefaults(defineProps<Props>(), {
	list: [],
	loading: false,
	viewSearch: true,
	viewButtonsColumn: true,
});

type InvoiceTableColumn = {
	title: string;
	dataIndex: string;
	key: string;
	align: string;
};

const filterKey = ref(['Adeudada', 'Parcialmente Cancelada', 'Cancelada']);
const stateValue = ref('');
const sortDefault = ref();
const printSpinner = ref<boolean>(false);
const dataExcel = ref([]);

const print = async () => {
	const print = 'yes';
	const resp = await getInvoiceList(
		CompanyGetter.value?.id,
		customer.value?.value,
		status_id.value,
		from.value,
		to.value,
		currentPage.value,
		itemsPerPage.value,
		print,
	);

	const p = new ExcelService();
	p.download(resp.data, 'Listado Ventas');
};

const invoiceTableColumns: InvoiceTableColumn[] = [
	{
		title: '#',
		dataIndex: 'row',
		key: 'row',
		align: 'center',
	},
	{
		title: 'Cliente',
		dataIndex: 'customer',
		key: 'customer',
		align: 'center',
	},
	{
		title: 'Fecha',
		dataIndex: 'date',
		key: 'date',
		align: 'center',
	},
	{
		title: 'Número',
		dataIndex: 'number',
		key: 'number',
		align: 'center',
	},
	{
		title: 'Importe',
		dataIndex: 'value',
		key: 'value',
		align: 'center',
	},
	{
		title: 'Estado',
		dataIndex: 'status',
		key: 'status',
		align: 'center',
	},
	{
		title: 'Acción',
		dataIndex: 'actions',
		key: 'actions',
		align: 'center',
	},
];

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

const rowSelection = ref({
	checkStrictly: false,
	hideSelectAll: true,
	onSelect: (record: InvoiceList, selected: boolean, selectedRows: InvoiceList[]) => {
		console.log(record);
		console.log(selected);
		console.log(selectedRows);
	},
	onChange: (selectedRowKeys: (string | number)[], selectedRows: InvoiceList[]) => {
		console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
	},
});
</script>

<style scoped></style>
