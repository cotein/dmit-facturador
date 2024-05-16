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
		:maskClosable="false"
		@close="onClose"
		@afterVisibleChange="afterVisibleChange"
	>
		<a-form :model="invoice" :rules="rules" layout="vertical" ref="invoiceConfigForm" @submit="onClose">
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
			<!-- <a-row :gutter="16">
				<a-col :span="24">
					<a-form-item label="Detalle de la factura" name="type_details">
						<a-radio-group v-model:value="invoice.type_details" name="radioGroup">
							<a-radio value="1">Desea seleccionar productos</a-radio>
							<a-radio value="2">Desea escribir texto libre</a-radio>
						</a-radio-group>
					</a-form-item>
				</a-col>
			</a-row> -->
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
					<a-form-item label="Condición de venta" name="SaleCondition">
						<SaleCondition />
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="16">
				<a-col :span="12">
					<a-form-item label="Modo de pago" name="paymentType">
						<PaymentTypes />
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="16" v-if="invoice.Concepto != '1'">
				<a-col :span="12">
					<a-form-item label="Fecha Servicios" name="servicesDate">
						<a-range-picker
							style="width: 100%"
							:format="dateFormat"
							v-model:value="serviceDate"
							:placeholder="['Fecha inicial', 'Fecha final']"
							@change="servDatesMethod"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="Fecha vencimiento de pago" name="FchVtoPago">
						<a-date-picker
							v-model:value="invoice.dateVtoPago"
							style="width: 100%"
							showToday
							:format="dateFormat"
							placeholder="Vencimiento de pago"
							@change="servicesDateFchVtoPago"
						/>
					</a-form-item>
				</a-col>
			</a-row>
			<a-space>
				<a-button @click="onCloseCancel">Cancelar</a-button>
				<a-button type="primary" @click="onClose">Aceptar</a-button>
			</a-space>
		</a-form>
		<template #extra> </template>
	</a-drawer>
	<DrawerAddCustomer />
</template>
<script setup lang="ts">
import { BillingConcepts } from '@/app/types/Afip';
import { FECompUltimoAutorizado } from '@/api/afip/afip-factura-electronica';
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
import VoucherSelect from './VoucherSelect.vue';
import PaymentTypes from '@/app/components/paymentType/PaymentTypes.vue';
import type { Rule } from 'ant-design-vue/lib/form';
const { selectedCustomer } = useCustomerComposable();

const { invoice, invoiceConfigIsValidated } = useInvoiceComposable();

const { CompanyGetter } = useCompanyComposable();

const invoiceConfigForm = ref();

// Agrega un cero al inicio del número si es menor a 10
const appendZero = function (number: number) {
	return Number(number) < 10 ? '0' + number : number;
};

const getDateTodayInArgentinaFormat = () => {
	const date = new Date();

	const day = appendZero(date.getDate());
	const month = appendZero(date.getMonth() + 1);
	const year = date.getFullYear();

	return `${day}-${month}-${year}`;
};

const dateFormat = 'DD-MM-YYYY';

const serviceDate = ref<[Dayjs, Dayjs]>([dayjs('2015/01/01', dateFormat), dayjs('2015/01/01', dateFormat)]);

const invoiceDateValidator = (rule: Rule, value: any) => {
	return new Promise((resolve, reject) => {
		if (value === null) {
			reject('La fecha del comprobante no puede estar vacía');
		} else {
			resolve(true);
		}
	});
};

const invoiceVoucherValidator = (rule: Rule, value: any) => {
	return new Promise((resolve, reject) => {
		if (value === null) {
			reject('Debe seleccionar un comprobante a emitir');
		} else {
			resolve(true);
		}
	});
};

const vtoPagoValidator = (rule: Rule, value: Dayjs) => {
	return new Promise((resolve, reject) => {
		console.log('🚀 ~ value:', value);
		console.log('🚀 ~ rule:', rule);
		if (invoice.value.Concepto === '2' || invoice.value.Concepto === '3') {
			if (value) {
				resolve(true);
			} else {
				reject('Si la factura es de servicios, la fecha de vencimiento de pago es requerida');
			}
		}
	});
};

const rules = ref({
	Concepto: [{ required: true, message: 'Debe seleccionar un concepto de facturación' }],
	customer: [{ required: true, message: 'Debe buscar un cliente' }],
	SaleCondition: [{ required: true, message: 'La condición de venta es requerida' }],
	voucher: [
		{
			required: true,
			validator: invoiceVoucherValidator,
		},
	],
	//type_details: [{ required: true, message: 'Debe seleccionar el tipo de detalle de la factura' }],
	FchVtoPago: [
		{
			validator: vtoPagoValidator,
		},
	],
	paymentType: [{ required: true, message: 'El modo de pago es requerido' }],
	date: [
		{
			required: true,
			validator: invoiceDateValidator,
		},
	],
});

const onCloseCancel = () => (visible.value = false);

const onClose = async (e: Event) => {
	const isValid = await invoiceConfigForm.value.validate().catch((error: any) => {
		invoiceConfigIsValidated.value = false;
		return false;
	});

	if (isValid) {
		invoiceConfigIsValidated.value = true;
		visible.value = false;
	} else {
		invoiceConfigIsValidated.value = false;
	}
};

const visible = ref<boolean>(false);

const showDrawer = () => {
	visible.value = true;
};

const afterVisibleChange = (visible: boolean) => {
	if (visible) {
		const date = dayjs(new Date());

		invoice.value.date = date;

		invoice.value.CbteFch = date.format('YYYYMMDD').toString();
	}
};

const servDatesMethod = (date: any): void => {
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

		invoice.value.FchServDesde = `${date[0].$y}${month_0}${day_0}`;
		invoice.value.FchServHasta = `${date[1].$y}${month_1}${day_1}`;
	} else {
		invoice.value.FchServDesde = '';
		invoice.value.FchServHasta = '';
	}
};

const setDate = (date: any) => {
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

const servicesDateFchVtoPago = (date: any) => {
	console.log('🚀 ~ servicesDateFchVtoPago ~ date:', date);
	let day = null;

	if (date.$D < 10) {
		day = '0' + date.$D;
	} else {
		day = date.$D;
	}

	if (date.$M + 1 < 10) {
		invoice.value.FchVtoPago = `${date.$y}0${date.$M + 1}${day}`;
	} else {
		invoice.value.FchVtoPago = `${date.$y}${date.$M + 1}${day}`;
	}
};
const changeDate = (date: any) => {
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
	if (!visible) {
		const resp = await FECompUltimoAutorizado(
			invoice.value.voucher,
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
	}
});

watch(
	() => invoice.value.Concepto,
	(newValue) => {
		if (newValue === '2' || newValue === '3') {
			const d = dayjs(new Date());

			serviceDate.value[0] = d.subtract(1, 'month').startOf('M');

			serviceDate.value[1] = d.subtract(1, 'month').endOf('M');

			invoice.value.FchServDesde = d.subtract(1, 'month').startOf('M').format('YYYYMMDD').toString();

			invoice.value.FchServHasta = d.subtract(1, 'month').endOf('M').format('YYYYMMDD').toString();

			invoice.value.FchVtoPago = d.add(invoice.value.SaleCondition.days, 'day').format('YYYYMMDD').toString();
		} else {
			invoice.value.FchServDesde = '';
			invoice.value.FchServHasta = '';
			invoice.value.FchVtoPago = '';
		}
	},
	{ deep: true, immediate: true },
);

watch(
	() => invoice.value.SaleCondition,
	(newValue) => {
		console.log('🚀 ~ newValue:', newValue);
		const date = dayjs(new Date());
		//fchVtoPago.value = date.add(newValue.days, 'day');
	},
	{ immediate: true },
);

onMounted(() => {
	const date = moment();

	if (invoice && invoice.value) {
		invoice.value.Concepto = String(CompanyGetter!.value.billing_concept);
		invoice.value.company_id = CompanyGetter!.value.id;
		invoice.value.PtoVta = Number(CompanyGetter!.value.pto_vta_fe);

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
	}
});
</script>
