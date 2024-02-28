<template>
	<a-drawer
		:title="titleNotaCredito"
		width="65%"
		:visible="openDrawerNotaCredito"
		@close="onClose"
		:bodyStyle="bodyStyle"
		:footer-style="footerStyle"
	>
		<template #extra>
			<a-date-picker
				v-model:value="notUse"
				size="small"
				style="margin-right: 2rem"
				placeholder="Fecha Nota de crédito"
				:disabled-date="disabledDate"
				format="DD-MM-YYYY"
				@change="changeDate"
			/>
			<a-button style="margin-right: 8px" @click="onClose">Cancelar</a-button>
			<a-button type="primary" @click="generate" :loading="spinner" :disabled="!productsForNotaCredito.length"
				>Generar</a-button
			>
		</template>
		<InvoiceLetterBox>
			<div class="invoice--header">
				<a-row align="middle" justify="space-around">
					<a-col :lg="12" :xs="24">
						<address class="invoice-customer">
							<sdHeading class="invoice-customer__title" as="h5"> Facturar a: </sdHeading>
							<p>
								{{ invoiceForNotaCredito?.customer.name }} {{ invoiceForNotaCredito?.customer.last_name
								}}<br />
								<template v-if="invoiceForNotaCredito?.customer.fantasy_name">
									{{ invoiceForNotaCredito?.customer.fantasy_name }}
								</template>
								<br />
								{{ invoiceForNotaCredito?.customer.afipDocument }} :
								{{ invoiceForNotaCredito?.customer.cuit }}
							</p>
						</address>
					</a-col>

					<a-col :lg="12" :xs="24">
						<sdHeading class="invoice-customer__title" as="h5">
							Sobre: {{ invoiceForNotaCredito?.voucher.name }}
							{{ invoiceForNotaCredito?.voucher.pto_vta }}-{{
								invoiceForNotaCredito?.voucher.cbte_desde
							}}</sdHeading
						>
					</a-col>
				</a-row>
			</div>
		</InvoiceLetterBox>
		<div class="invoice--body">
			<a-table
				:columns="columns"
				:data-source="invoiceForNotaCredito?.items"
				:row-selection="rowSelection"
				:pagination="false"
			>
				<template #headerCell="{ title }">
					<div style="text-align: center">{{ title }}</div>
				</template>
				<template #bodyCell="{ column, record, index }">
					<template v-if="column.key === 'name'">
						{{ record.name }}
					</template>
					<template v-if="column.key === 'quantity'">
						<QuantityProductNotaCredito :record="record" :index="index" />
					</template>
				</template>
			</a-table>
		</div>
		<template #footer>
			<sdHeading class="invoice-customer__title" as="h5">
				Se va a generar una Nota de Crédito por : {{ $filters.formatCurrency(totalNotaCredito) }}</sdHeading
			>
		</template>
	</a-drawer>
</template>
<script setup lang="ts">
import dayjs, { Dayjs } from 'dayjs';
import type { ProductForNotaCredito } from '@/app/types/Product';
import { useInvoiceNotaCreditoComposable } from '@/app/composables/invoice/useInvoiceNotaCreditoComposable';
import QuantityProductNotaCredito from './QuantityProductNotaCredito.vue';
import { useInvoiceBuilderComposable } from '@/app/composables/invoice/useInvoiceBuilderComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { FECompUltimoAutorizado } from '@/api/afip/afip-factura-electronica';
import { ref, onMounted, watch } from 'vue';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { SELECT_INVOICE_TYPE } from '@/app/types/Constantes';

const { invoice, createInvoiceMutation } = useInvoiceComposable();

const { openDrawerNotaCredito, invoiceForNotaCredito, titleNotaCredito, productsForNotaCredito, totalNotaCredito } =
	useInvoiceNotaCreditoComposable();

const { createInvoiceBuilder, createConcreteInvoiceBuilder } = useInvoiceBuilderComposable();

const { CompanyGetter } = useCompanyComposable();

const onClose = () => {
	openDrawerNotaCredito.value = false;
	invoiceForNotaCredito.value = undefined;
};

const notUse = ref(dayjs(new Date()));

const disabledDate = (current: Dayjs) => {
	let days = 10;

	if (invoiceForNotaCredito.value?.voucher.concepto === 1) days = 5;

	return (current && current < dayjs().subtract(days, 'day')) || current > dayjs().add(days, 'day');
};

const changeDate = (date: Dayjs) => {
	if (date) {
		invoice.value.CbteFch = date.format('YYYYMMDD');
	} else {
		invoice.value.CbteFch = '';
	}
};

watch(
	() => invoice.value.CbteFch,
	() => {
		const d = dayjs(new Date());
		invoice.value.CbteFch = d.format('YYYYMMDD');
	},
	{ immediate: true },
);
const columns = [
	{
		title: '#',
		dataIndex: 'row',
		key: 'row',
	},
	{
		title: 'Producto',
		dataIndex: 'name',
		key: 'name',
		align: 'left',
	},
	{
		title: 'Precio/U',
		dataIndex: 'unit_price',
		key: 'unit_price',
		align: 'right',
	},
	{
		title: 'Cantidad',
		dataIndex: 'quantity',
		key: 'quantity',
		align: 'right',
	},
	{
		title: 'Total',
		dataIndex: 'total',
		key: 'total',
		align: 'right',
	},
];

const rowSelection = {
	onChange: (selectedRowKeys: (string | number)[], selectedRows: ProductForNotaCredito[]) => {
		productsForNotaCredito.value = selectedRows;
	},
	onSelect: (record: ProductForNotaCredito, selected: boolean, selectedRows: ProductForNotaCredito[]) => {
		productsForNotaCredito.value = selectedRows;
	},
	onSelectAll: (selected: boolean, selectedRows: ProductForNotaCredito[], changeRows: ProductForNotaCredito[]) => {
		productsForNotaCredito.value = selectedRows;
	},
};

const spinner = ref<boolean>(false);

const generate = async () => {
	spinner.value = true;

	let invoiceType: number = 0;

	titleNotaCredito.value === 'NOTA DE CRÉDITO'
		? (invoiceType = invoiceForNotaCredito.value!.voucher.typeNotaCredito)
		: (invoiceType = invoiceForNotaCredito.value!.voucher.typeNotaDebito);

	const builder = createConcreteInvoiceBuilder(
		SELECT_INVOICE_TYPE[invoiceType],
		CompanyGetter.value!.inscription_id,
		invoiceForNotaCredito.value!.customer.afipInscription_id,
	);

	console.log('🚀 ~ generate ~ builder:', builder);

	const ultimoAutorizado = await FECompUltimoAutorizado(
		invoiceType,
		invoiceForNotaCredito.value!.voucher.pto_vta,
		CompanyGetter.value.afip_environment,
		CompanyGetter.value!.cuit,
		CompanyGetter.value!.id,
		CompanyGetter.value!.user_id,
	);

	if (ultimoAutorizado) {
		invoice.value.CbteNro = ultimoAutorizado.data.FECompUltimoAutorizadoResult.CbteNro + 1;
		invoice.value.CbteTipo = invoiceType;
		invoice.value.PtoVta = CompanyGetter.value?.pto_vta_fe;
		invoice.value.Concepto = invoiceForNotaCredito.value!.voucher.concepto.toString();
		invoice.value.customer = invoiceForNotaCredito.value!.customer;
		invoice.value.CbtesAsoc = invoiceForNotaCredito.value!.voucher.cbteAsoc;

		const FECAESolicitarObjetc = createInvoiceBuilder(builder, invoice.value, productsForNotaCredito.value);

		const params = {
			FeCabReq: FECAESolicitarObjetc.FeCabReq,
			FECAEDetRequest: FECAESolicitarObjetc.FECAEDetRequest,
			environment: CompanyGetter.value!.afip_environment,
			company_cuit: CompanyGetter.value!.cuit,
			company_id: CompanyGetter.value?.id,
			user_id: CompanyGetter.value?.user_id,
			products: productsForNotaCredito.value,
			saleCondition: { days: 300000, id: 5 },
			customer: invoice.value?.customer,
			comments: 'InvoiceGetter.value?.comments',
			parent: invoiceForNotaCredito.value?.id,
		};

		const nota = await createInvoiceMutation.mutateAsync(params);

		if (nota) {
			openDrawerNotaCredito.value = false;
		}
	}

	spinner.value = false;
};

onMounted(() => {
	invoice.value.CbteFch = dayjs(new Date()).format('YYYYMMDD');
});
//color F8F9FB
const bodyStyle = { 'background-color': '#cccbbb' };
const footerStyle = { height: '3rem' };
</script>
<style>
.invoice--header {
	background-color: white;
	padding: 3rem;
	border-radius: 7px;
}
.invoice--body {
	margin-top: 3rem;
	background-color: white;
	padding: 3rem;
	border-radius: 7px;
}
</style>
