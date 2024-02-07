<template>
	<a-select
		show-search
		placeholder="Comprobante"
		style="width: 100%"
		:default-active-first-option="false"
		:show-arrow="false"
		:filter-option="false"
		:allowClear="true"
		:not-found-content="null"
		:field-names="{ label: 'name', value: 'id' }"
		:options="CompanyGetter.vouchers"
		v-model:value="value"
		@select="select"
	></a-select>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { FECompUltimoAutorizado } from '@/api/afip/afip-factura-electronica';
import { useInvoiceBuilderComposable } from '@/app/composables/invoice/useInvoiceBuilderComposable';

const { invoice } = useInvoiceComposable();
const { CompanyGetter } = useCompanyComposable();
const { invoiceType } = useInvoiceBuilderComposable();
const value = ref(null);

const voucherSelectorComponentSetValue = () => {
	value.value = null;
};

const select = async (_: any, option: any) => {
	console.log('🚀 ~ file: VoucherSelect.vue:33 ~ select ~ option:', option);
	invoice.value.voucher = option;
	invoiceType.value = option.id;

	/* const resp = await FECompUltimoAutorizado(
		option.afip_code,
		CompanyGetter.value!.pto_vta_fe ?? '',
		CompanyGetter.value?.afip_environment ?? '',
		CompanyGetter.value?.cuit ?? '',
		CompanyGetter.value.id,
		CompanyGetter.value?.user_id ?? '',
	);

	if (resp) {
		const { FECompUltimoAutorizadoResult } = resp.data;

		invoice.value.CbteTipo = FECompUltimoAutorizadoResult.CbteTipo;
		invoice.value.PtoVta = FECompUltimoAutorizadoResult.PtoVta;
		invoice.value.CbteNro = FECompUltimoAutorizadoResult.CbteNro + 1;
	} */
};

/* watch(
	() => value.value,
	(n, o) => {
		console.log('🚀 ~ file: VoucherSelect.vue:49 ~ select ~ invoice:', n, o);
	},
); */
defineExpose({ voucherSelectorComponentSetValue });
</script>
