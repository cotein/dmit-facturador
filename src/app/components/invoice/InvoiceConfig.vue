<template>
	<a-button type="primary" @click="showDrawer">
		<template #icon><PlusOutlined /></template>
		Datos del Cliente
	</a-button>
	<a-drawer
		title="Datos del Cliente"
		:width="720"
		:visible="visible"
		:body-style="{ paddingBottom: '80px' }"
		:footer-style="{ textAlign: 'right' }"
		@close="onClose"
		@afterVisibleChange="afterVisibleChange"
	>
		<a-form :model="invoice" :rules="rules" layout="vertical">
			<a-row :gutter="16">
				<a-col :span="24">
					<a-form-item label="Buscar cliente" name="customer">
						<SearchCustomer />
					</a-form-item>
				</a-col>
				<a-col :span="24">
					<a-form-item label="Seleccionar tipo de comprobante a relizar" name="voucher">
						<VoucherSelect />
					</a-form-item>
				</a-col>
				<a-col :span="24">
					<a-form-item label="Concepto de facturación" name="Concepto">
						<a-radio-group v-model:value="invoice.Concepto" name="radioGroup">
							<a-radio v-for="(item, index) in BillingConcepts" :key="index" :value="item.value">{{
								item.key
							}}</a-radio>
						</a-radio-group>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="16">
				<a-col :span="24">
					<a-form-item label="Detalle de la factura" name="type_details">
						<a-radio-group v-model:value="invoice.type_details" name="radioGroup">
							<a-radio value="1">Desea seleccionar productos</a-radio>
							<a-radio value="2">Desea escribir texto libre</a-radio>
						</a-radio-group>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="16">
				<a-col :span="12">
					<a-form-item label="Fecha Factura" name="date">
						<a-date-picker
							v-model:value="invoice.date"
							style="width: 100%"
							showToday
							format="DD-MM-YYYY"
							placeholder="Fecha de factura"
							@change="changeDate"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="Fecha Servicios" name="date" v-if="invoice.Concepto != '1'">
						<a-range-picker
							style="width: 100%"
							:format="dateFormat"
							v-model:value="serviceDate"
							:placeholder="['Fecha inicial', 'Fecha final']"
							@change="servDates"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="Condición de venta" name="saleCondition">
						<SaleCondition />
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<template #extra>
			<a-space>
				<a-button @click="onClose">Cancelar</a-button>
				<a-button type="primary" @click="onClose">Aceptar</a-button>
			</a-space>
		</template>
	</a-drawer>
	<DrawerAddCustomer />
</template>
<script setup lang="ts">
import { BillingConcepts } from '@/app/types/Afip';
import { INVOICE_TYPE } from '@/app/types/Constantes';
import { onMounted, ref, watch } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useCustomerComposable } from '@/app/composables/customer/useCustomerComposable';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import dayjs from 'dayjs';
import DrawerAddCustomer from '../customer/DrawerAddCustomer.vue';
import moment from 'moment';
import SaleCondition from './SaleCondition.vue';
import SearchCustomer from '../customer/SearchCustomer.vue';
import type { Dayjs } from 'dayjs';
import type { Rule } from 'ant-design-vue/es/form';
import VoucherSelect from './VoucherSelect.vue';
import { FECompUltimoAutorizado } from '@/api/afip/afip-factura-electronica';

const { selectedCustomer } = useCustomerComposable();

const { invoice } = useInvoiceComposable();

const { CompanyGetter } = useCompanyComposable();

const getDateTodayInArgentinaFormat = () => {
	const date = new Date();

	// Agrega un cero al inicio del número si es menor a 10
	const appendZero = function (number: number) {
		return Number(number) < 10 ? '0' + number : number;
	};

	const day = appendZero(date.getDate());
	const month = appendZero(date.getMonth() + 1);
	const year = date.getFullYear();

	return `${day}-${month}-${year}`;
};

const dateFormat = 'DD/MM/YYYY';

const serviceDate = ref<[Dayjs, Dayjs]>([
	dayjs(getDateTodayInArgentinaFormat(), dateFormat),
	dayjs(getDateTodayInArgentinaFormat(), dateFormat),
]);

const rules: Record<string, Rule[]> = {
	Concepto: [{ required: true, message: 'Debe seleccionar un concepto de facturación' }],
	date: [{ required: true, message: 'Debe seleccionar la fecha del servicio' }],
	type_details: [{ required: true, message: 'Debe seleccionar el tipo de detalle de la factura' }],
	type: [{ required: true, message: 'Please choose the type' }],
	approver: [{ required: true, message: 'Please choose the approver' }],
	description: [{ required: true, message: 'Please enter url description' }],
};

const visible = ref<boolean>(false);

const showDrawer = () => {
	visible.value = true;
};

const afterVisibleChange = () => {};
const onClose = () => {
	visible.value = false;
};

const servDates = (date: any): void => {
	console.log('🚀 ~ servDates ~ date:', date);
	let day_0 = null;
	let day_1 = null;
	let month_0 = null;
	let month_1 = null;

	if (date) {
		if (date[0].$D < 10) {
			day_0 = `0${date[0].$D + 1}`;
		} else {
			day_0 = `${date[0].$D + 1}`;
		}

		if (date[1].$D < 10) {
			day_1 = `0${date[1].$D}`;
		} else {
			day_1 = `${date[1].$D}`;
		}

		if (date[0].$M + 1 < 10) {
			month_0 = `0${date[0].$M + 1}`;
		} else {
			month_0 = `${date[0].$M + 1}`;
		}

		if (date[1].$M + 1 < 10) {
			month_1 = `0${date[1].$M + 1}`;
		} else {
			month_1 = `${date[1].$M + 1}`;
		}
	}

	invoice.value.FchServDesde = `${date[0].$y}${month_0}${day_0}`;
	invoice.value.FchServHasta = `${date[1].$y}${month_1}${day_1}`;
};

const setDate = (date: string | string[]) => {
	let day = null;

	if (date.$D < 10) {
		day = '0' + date.$D;
	} else {
		day = date.$D;
	}

	if (date.$M + 1 < 10) {
		invoice.value.CbteFch = `${date.$y}0${date.$M + 1}${day}`;
	} else {
		invoice.value.CbteFch = `${date.$y}${date.$M + 1}${day}`;
	}
};
const changeDate = (date: string | string[]) => {
	setDate(date);
};

watch(
	() => selectedCustomer,
	(newValue) => {
		invoice.value.customer = newValue.value;
	},
	{ deep: true },
);

watch(visible, async (visible) => {
	console.log('🚀 ~ visible:', visible, invoice.value.voucher.afip_code);
	if (!visible) {
		const resp = await FECompUltimoAutorizado(
			invoice.value.voucher.id,
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
		}

		if (
			[
				INVOICE_TYPE.NOTA_CREDITO_A,
				INVOICE_TYPE.NOTA_CREDITO_B,
				INVOICE_TYPE.NOTA_CREDITO_C,
				INVOICE_TYPE.NOTA_DEBITO_A,
				INVOICE_TYPE.NOTA_DEBITO_B,
				INVOICE_TYPE.NOTA_DEBITO_C,
			].includes(invoice.value.CbteTipo)
		) {
			console.log('🚀 ~ onClose ~ includes wwwwwwwwwwwwwwwwwwwwwwwwww:', invoice.value.CbteTipo);
		}
	}
});

onMounted(() => {
	const date = moment();
	if (invoice && invoice.value) {
		invoice.value.Concepto = String(CompanyGetter.value.billing_concept);
		invoice.value.company_id = CompanyGetter.value.id;
		invoice.value.PtoVta = Number(CompanyGetter.value.pto_vta_fe);

		let day = null;

		if (date.date() < 10) {
			day = '0' + date.date();
		} else {
			day = date.date();
		}

		if (date.month() + 1 < 10) {
			invoice.value.CbteFch = `${date.year()}0${date.month() + 1}${day}`;
		} else {
			invoice.value.CbteFch = `${date.year()}${date.month() + 1}${day}`;
		}
		invoice.value.date = date;
	}
});
</script>
