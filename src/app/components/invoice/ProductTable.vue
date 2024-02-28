<template>
	<Main>
		<TableWrapper>
			<ProductTable>
				<div class="table-invoice table-responsive">
					<a-table :dataSource="invoiceTableData" :columns="productTableColumns" :pagination="false">
						<template #bodyCell="{ column, record, index }">
							<template v-if="column.key === 'product'">
								<ProductItem :record="record" :index="index" />
							</template>
							<template v-if="column.key === 'unit'">
								<Unit :record="record" :index="index" />
							</template>
							<template v-if="column.key === 'quantity'">
								<Quantity :record="record" :index="index" />
							</template>
							<template v-if="column.key === 'iva'">
								<Iva :record="record" :index="index" />
							</template>
							<template v-if="column.key === 'discount'">
								<Discount :record="record" :index="index" />
							</template>
							<template v-if="column.key === 'subtotal'">
								<Subtotal :record="record" :index="index" />
							</template>
							<template v-if="column.key === 'total'">
								<Total :record="record" :index="index" />
							</template>
							<template v-if="column.key === 'actions'">
								<Actions :record="record" :index="index" />
							</template>
						</template>
					</a-table>
				</div>
			</ProductTable>
		</TableWrapper>
		<Totals />
		<a-row justify="end">
			<a-col :lg="12" :md="18" :sm="24" :offset="0">
				<InvoiceAction>
					<!-- <sdButton size="sm" shape="round" type="default">
						<unicon name="print" width="14"></unicon>
						<span>Print</span>
					</sdButton>
					<sdButton size="sm" shape="round" type="default">
						<unicon name="message" width="14"></unicon>
						<span>Send Invoice</span>
					</sdButton> -->
					<a-button
						type="primary"
						shape="round"
						@click="generateInvoice"
						:loading="loading"
						:disabled="loading || invoiceTableData.length == 0"
					>
						<template #icon v-if="invoiceTableData.length">
							<CloudUploadOutlined />
						</template>
						Facturar
					</a-button>
				</InvoiceAction>
			</a-col>
		</a-row>
	</Main>
</template>

<script setup lang="tsx">
import { CloudUploadOutlined } from '@ant-design/icons-vue';
import { InvoiceAction, ProductTable } from './Style';
import { Main, TableWrapper } from '../../styled';
import { message } from 'ant-design-vue';
import { ref, onUnmounted } from 'vue';
import { SELECT_INVOICE_TYPE } from '@/app/types/Constantes';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useInvoiceBuilderComposable } from '@/app/composables/invoice/useInvoiceBuilderComposable';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { usePrinterPdfComposable } from '@/app/composables/printerPdf/usePrinterPdfComposable';
import Actions from './product/Actions.vue';
import Discount from './product/Discount.vue';
import Iva from './product/Iva.vue';
import ProductItem from './product/ProductItem.vue';
import Quantity from './product/Quantity.vue';
import Subtotal from './product/Subtotal.vue';
import Total from './product/Total.vue';
import Totals from './Totals.vue';
import Unit from './product/Unit.vue';

const { getPdfInvoice } = usePrinterPdfComposable();
const { invoiceTableData, createInvoiceMutation, invoiceInitialStatus, InvoiceGetter, invoice, TotalComprobante } =
	useInvoiceComposable();

const { createConcreteInvoiceBuilder, createInvoiceBuilder, invoiceType } = useInvoiceBuilderComposable();

const { CompanyGetter } = useCompanyComposable();

const loading = ref<boolean>(false);

const productTableColumns = [
	{
		title: '#',
		dataIndex: 'row',
		key: 'row',
	},
	{
		title: 'Producto',
		dataIndex: 'product',
		key: 'product',
	},
	{
		title: 'Precio/U',
		dataIndex: 'unit',
		key: 'unit',
	},
	{
		title: 'Cantidad',
		dataIndex: 'quantity',
		key: 'quantity',
	},
	{
		title: 'Iva',
		dataIndex: 'iva',
		key: 'iva',
	},
	{
		title: 'Desc.',
		dataIndex: 'discount',
		key: 'discount',
	},
	{
		title: 'Subtotal',
		dataIndex: 'subtotal',
		key: 'subtotal',
	},
	{
		title: 'Total',
		dataIndex: 'total',
		key: 'total',
	},
	{
		title: 'Acciones',
		dataIndex: 'actions',
		key: 'actions',
	},
];

const generateInvoice = async () => {
	//const builder = await createInvoiceBuilder();

	const builder = createConcreteInvoiceBuilder(
		SELECT_INVOICE_TYPE[invoiceType.value],
		CompanyGetter.value?.inscription_id,
		invoice.value.customer.afip_inscription.id,
	);

	const FECAESolicitar = createInvoiceBuilder(builder, invoice.value, invoiceTableData.value);

	loading.value = true;

	if (FECAESolicitar.FECAEDetRequest.Concepto === 2 || FECAESolicitar.FECAEDetRequest.Concepto === 3) {
		if (
			FECAESolicitar.FECAEDetRequest.FchServDesde === '' ||
			FECAESolicitar.FECAEDetRequest.FchServDesde === null ||
			FECAESolicitar.FECAEDetRequest.FchServHasta === '' ||
			FECAESolicitar.FECAEDetRequest.FchServHasta === null
		) {
			message.error({ content: 'Si factura servicios debe ingresar las fechas en que se desarrolló el mismo.' });
			loading.value = false;
			return false;
		}
	}

	if (FECAESolicitar.FECAEDetRequest.ImpTotal === 0) {
		message.error({ content: 'No se permite emitir un comprobante en cero.' });
		loading.value = false;
		return false;
	}

	const params = {
		FeCabReq: FECAESolicitar.FeCabReq,
		FECAEDetRequest: FECAESolicitar.FECAEDetRequest,
		environment: CompanyGetter.value?.afip_environment,
		company_cuit: CompanyGetter.value?.cuit,
		company_id: CompanyGetter.value?.id,
		user_id: CompanyGetter.value?.user_id,
		products: invoiceTableData.value,
		saleCondition: InvoiceGetter.value.SaleCondition,
		customer: InvoiceGetter.value?.customer,
		comments: InvoiceGetter.value?.comments,
	};

	const result = await createInvoiceMutation
		.mutateAsync(params)
		.catch((err) => {
			console.log('🚀 ~ file: ProductTable.vue:160 ~ generateInvoice ~ err:', err);
			console.log('🚀 ~ file: ProductTable.vue:158 ~ generateInvoice ~ params:', params);
		})
		.finally(() => (loading.value = false));

	if (result) {
		message.success({
			content: 'Factura generada correctamente',
			duration: 3,
		});
		invoiceTableData.value = []; //limpia los productos de la tabla
		invoice.value.comments = ''; //limpia comentarios
		invoice.value.CbteDesde = parseInt(result.data.invoice[0]!.voucher.cbte_desde) + 1; //sumo uno al mismo tipo de voucher para no consultar la api de afip
		invoice.value.CbteHasta = parseInt(result.data.invoice[0]!.voucher.cbte_desde) + 1; //sumo uno al mismo tipo de voucher para no consultar la api de afip
		invoice.value.CbteNro = parseInt(result.data.invoice[0]!.voucher.cbte_desde) + 1; //sumo uno al mismo tipo de voucher para no consultar la api de afip
		//invoiceInitialStatus();
		const invoiceClass = getPdfInvoice(result.data.CbteTipo);
		const pdf = new invoiceClass(
			result.data.invoice[0]?.company,
			result.data.invoice[0]?.customer,
			result.data.invoice[0]?.voucher,
			result.data.invoice[0]?.items,
			result.data.invoice[0]?.comment,
		);
		pdf.print();
	}
};

onUnmounted(() => {
	console.log('🚀 ~ onUnmounted ~ onUnmounted:');
	invoiceInitialStatus();
	invoiceTableData.value = [];
});
</script>

<style scoped></style>
printerPdf
