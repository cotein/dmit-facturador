<template>
	<a-tooltip>
		<a-popconfirm
			title="¿Emitir nota de crédito?"
			@confirm="openFirstModal"
			cancelText="Cancelar"
			:okButtonProps="{ loading: popConfirmLoading }"
			@visibleChange="popConfirmIsVisible"
		>
			<template #icon><question-circle-outlined /></template>
			<a class="ant-dropdown-link" @click.prevent="openDrawer">
				<DeleteFilled />
				Anular por nota de crédito
			</a>
		</a-popconfirm>
	</a-tooltip>
	<a-modal
		v-model:visible="firstModalVisible"
		title="Seleccionar fecha de Nota de crédito"
		@ok="handleModalOk"
		:bodyStyle="{ 'padding-left': '8rem' }"
		:okButtonProps="{ disabled: CbteFch === '' }"
		cancelText="Cancelar"
	>
		<a-date-picker
			v-model:value="notUse"
			size="small"
			placeholder="Fecha Nota de crédito"
			:disabled-date="disabledDate"
			format="DD-MM-YYYY"
			@change="changeDate"
		/>
	</a-modal>
</template>

<script setup lang="ts">
import { DeleteFilled, QuestionCircleOutlined } from '@ant-design/icons-vue';
import { FECompUltimoAutorizado } from '@/api/afip/afip-factura-electronica';
import { INVOICE_TYPE, INVOICE_CANT_REG } from '@/app/types/Constantes';
import { message } from 'ant-design-vue';
import { Modal } from 'ant-design-vue';
import { onMounted, ref, h, watch } from 'vue';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useInvoiceBuilderComposable } from '@/app/composables/invoice/useInvoiceBuilderComposable';
import { usePrinterPdfComposable } from '@/app/composables/printerPdf/usePrinterPdfComposable';
import dayjs, { Dayjs } from 'dayjs';
import type { AfipInvoiceBaseBuilder } from '@/app/composables/invoice/Clases/AfipInvoiceBaseBuilder';
import type { InvoiceList } from '@/app/types/Invoice';
import { useInvoiceNotaCreditoComposable } from '@/app/composables/invoice/useInvoiceNotaCreditoComposable';

const { openDrawerNotaCredito } = useInvoiceNotaCreditoComposable();
const { CompanyGetter } = useCompanyComposable();
const { createBuilder, createInvoiceBuilder } = useInvoiceBuilderComposable();

type Props = {
	data: InvoiceList;
};

const props = withDefaults(defineProps<Props>(), {
	data: undefined,
});

const sendingNotaCredito = ref<boolean>(false);
const firstModalVisible = ref<boolean>(false);
const popConfirmLoading = ref<boolean>(false);

const notUse = ref();
const CbteFch = ref('');
const CbteDesde = ref<number>();

const openDrawer = () => {
	openDrawerNotaCredito.value = true;
};

const openFirstModal = async (e: MouseEvent) => {
	const invoices = {
		1: 3,
		6: 8,
		11: 13,
	};

	const CbteTipo = invoices[props.data.voucher.voucher_type];

	firstModalVisible.value = true;

	const resp = await FECompUltimoAutorizado(
		CbteTipo,
		props.data.voucher.pto_vta,
		CompanyGetter.value?.afip_environment,
		CompanyGetter.value?.cuit,
		CompanyGetter.value?.id,
		CompanyGetter.value?.user_id,
	).catch((error) => {
		message.error({
			content: error.response.data.message,
			duration: 5,
		});
	});

	if (resp) {
		CbteDesde.value = resp.data.FECompUltimoAutorizadoResult.CbteNro + 1;
	}
};

const disabledDate = (current: Dayjs) => {
	let days = 10;

	if (props.data.voucher.concepto === 1) days = 5;

	return (current && current < dayjs().subtract(days, 'day')) || current > dayjs().add(days, 'day');
};

const moneyArgentineFormat = new Intl.NumberFormat('es-AR', {
	style: 'currency',
	currency: 'ARS',
});

const generateNotaCredito = () => {};

const handleModalOk = () => {
	Modal.info({
		title: 'Se realiza Nota de crédito por sobre...',
		content: h('div', {}, [
			h(
				'p',
				{ style: { 'margin-bottom': '1px' } },
				`Cliente: ${props.data.customer.name} ${props.data.customer.last_name}`,
			),
			h(
				'p',
				{ style: { 'margin-bottom': '1px' } },
				`${props.data.voucher.name} ${props.data.voucher.pto_vta} - ${props.data.voucher.cbte_desde}`,
			),
			h(
				'p',
				{ style: { 'margin-bottom': '1px' } },
				`Por el importe de: ${moneyArgentineFormat.format(props.data.voucher.total)}`,
			),
		]),

		okText: 'Confirmar',
		async onOk() {
			await remove();
		},
	});
};
const popConfirmIsVisible = (e: boolean) => {
	console.log('🚀 ~ www ~ e:', e);
};
/* const cancel = (e: MouseEvent) => {
	console.log(e);
	message.error('Click on No');
}; */
const changeDate = (date: Dayjs) => {
	if (date) {
		CbteFch.value = date.format('YYYYMMDD');
	} else {
		CbteFch.value = '';
	}
};

const remove = async () => {
	const { customer, voucher, items } = props.data;

	const invoiceConfig = createBuilder(INVOICE_TYPE.NOTA_DE_CREDITO, 6, 5);

	const notaCredito = new invoiceConfig() as AfipInvoiceBaseBuilder;

	//setCbteDesde llamar al wsfe ultimo autorizado
	notaCredito.setCantReg(INVOICE_CANT_REG);
	notaCredito.setPtoVta(CompanyGetter.value?.pto_vta_fe);

	let cbteTipo = INVOICE_TYPE.NOTA_CREDITO_A;

	if (voucher.voucher_type === INVOICE_TYPE.FACTURA_C) cbteTipo = INVOICE_TYPE.NOTA_CREDITO_C;

	notaCredito.setCbteTipo(cbteTipo);
	notaCredito.setConcepto(voucher.concepto);
	notaCredito.setDocTipo(customer.afipDocTipo);
	notaCredito.setDocNro(customer.cuit);
	notaCredito.setCbteDesde(CbteDesde.value);
	notaCredito.setCbteHasta(CbteDesde.value);
	notaCredito.setCbteFch(CbteFch.value);
	notaCredito.setImpTotal(items.reduce((acc, item) => acc + item.neto_import, 0));
	notaCredito.setImpTotConc();
	notaCredito.setImpOpEx();
	notaCredito.setImpIVA();
	notaCredito.setIvaAarray();
	notaCredito.setCbtesAsoc(voucher.cbteAsoc);
	notaCredito.setTributos();
	notaCredito.setOpcionales();
	notaCredito.setCompradores();
	notaCredito.setPeriodoAsoc();
	notaCredito.setActividades();

	const pp = items.reduce((acc, item) => acc + item.neto_import, 0);
	console.log('🚀 ~ remove ~ pp:', notaCredito);

	return new Promise((resolve) => {
		setTimeout(() => resolve(true), 3000);
	});
};

onMounted(() => {
	console.log('🚀 ~ onMounted ~ onMounted:', props.data);
});
</script>

<style scoped></style>
