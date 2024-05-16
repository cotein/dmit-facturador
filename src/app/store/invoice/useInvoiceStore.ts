import type { AfipInvoice, FeCabReq } from '@/app/types/Afip';
import type { InvoiceList } from '@/app/types/Invoice';
import type { ProductOnInvoiceTable } from '@/app/types/Product';
import { defineStore } from 'pinia';
import { computed, reactive, ref, type UnwrapRef } from 'vue';

export const useInvoiceStore = defineStore('invoice', () => {
	const invoiceType = ref<number>();

	const isSale = ref<boolean>(true);

	const invoiceConfigIsValidated = ref<boolean>(false);

	const invoiceList = ref<InvoiceList[]>([]);

	const invoice: UnwrapRef<AfipInvoice> = reactive({
		CantReg: 1,
		CbteDesde: null,
		CbteFch: '',
		CbteHasta: null,
		CbteNro: null,
		CbtesAsoc: null,
		CbteTipo: null,
		company_id: undefined,
		Concepto: '1',
		customer: null,
		date: null,
		dateVtoPago: null,
		DocTipo: null,
		FchServDesde: '',
		FchServHasta: '',
		FchVtoPago: '',
		ImpIVA: 0,
		ImpNeto: 0,
		ImpOpEx: 0,
		ImpTotal: 0,
		ImpTotConc: 0,
		ImpTrib: 0,
		Iva: null,
		MonCotiz: 1,
		MonId: 'pesos',
		paymentType: 1,
		percepIIBB: 0,
		percepIva: 0,
		products: [],
		PtoVta: null,
		PeriodoAsoc: [],
		SaleCondition: 1,
		Tributos: null,
		type_details: '1',
		voucher: null,
		comments: null,
		aditional_percentage: 0,
	});

	const invoiceInitialStatus = (): void => {
		invoice.CantReg = 1;
		invoice.CbteFch = '';
		invoice.CbtesAsoc = null;
		invoice.date = null;
		invoice.dateVtoPago = null;
		invoice.DocTipo = null;
		invoice.FchServDesde = '';
		invoice.FchServHasta = '';
		invoice.FchVtoPago = '';
		invoice.ImpIVA = 0;
		invoice.ImpNeto = 0;
		invoice.ImpOpEx = 0;
		invoice.ImpTotal = 0;
		invoice.ImpTotConc = 0;
		invoice.ImpTrib = 0;
		invoice.Iva = null;
		invoice.MonCotiz = 1;
		invoice.MonId = 'pesos';
		invoice.percepIIBB = 0;
		invoice.percepIva = 0;
		invoice.products = [];
		invoice.PtoVta = null;
		invoice.SaleCondition = 1;
		invoice.Tributos = null;
		invoice.PeriodoAsoc = [];
		invoice.type_details = '1';
		invoice.voucher = null;
		invoice.comments = null;
		invoice.aditional_percentage = 0;
	};

	const details = ref<[]>([]);

	const openSearchProduct = ref<boolean>(false);

	const invoiceTableData = ref<ProductOnInvoiceTable[]>([]);

	const productOnInvoiceTable = ref<ProductOnInvoiceTable>({
		key: '',
		row: '',
		product: {
			id: undefined,
			name: '',
		},
		price_base: 0,
		unit: 0,
		quantity: 1,
		iva: {
			id: undefined,
			name: undefined,
			percentage: '',
		},
		discount: 0,
		subtotal: 0,
		total: 0,
		actions: {},
		priceList: undefined,
		aditional: {
			percentage: 0,
			value: 0,
		},
	});

	const setInitialData = () => {
		invoiceInitialStatus();
		invoiceTableData.value = [];
	};

	return {
		details,
		invoice,
		InvoiceGetter: computed(() => invoice),
		invoiceInitialStatus,
		invoiceList,
		invoiceTableData,
		invoiceType,
		isSale,
		openSearchProduct,
		productOnInvoiceTable,
		setInitialData,
		invoiceConfigIsValidated,
	};
});
