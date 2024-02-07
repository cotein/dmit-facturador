import type { AfipInvoice, FeCabReq } from '@/app/types/Afip';
import type { InvoiceList } from '@/app/types/Invoice';
import type { ProductOnInvoiceTable } from '@/app/types/Product';
import { defineStore } from 'pinia';
import { computed, reactive, ref, type UnwrapRef } from 'vue';

export const useInvoiceStore = defineStore('invoice', () => {
	const invoiceType = ref<number>();

	const invoiceList = ref<InvoiceList>();

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
		percepIIBB: 0,
		percepIva: 0,
		products: [],
		PtoVta: null,
		SaleCondition: {
			id: 1,
			name: 'Contado',
			days: 0,
		},
		Tributos: null,
		type_details: '1',
		voucher: {
			afip_code: null,
			id: null,
			name: null,
		},
		comments: null,
	});

	const invoiceInitialStatus = (): void => {
		invoice.CantReg = 1;
		invoice.CbteFch = '';
		invoice.CbtesAsoc = null;
		invoice.date = null;
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
		invoice.SaleCondition.id = 1;
		invoice.SaleCondition.name = 'Contado';
		invoice.SaleCondition.days = 0;
		invoice.Tributos = null;
		invoice.type_details = '1';
		invoice.voucher.afip_code = null;
		invoice.voucher.id = null;
		invoice.voucher.name = null;
		invoice.comments = null;
	};

	const details = ref<[]>([]);

	const openSearchProduct = ref<boolean>(false);

	const invoiceTableData = ref<ProductOnInvoiceTable[]>([]);

	const productOnInvoiceTable = reactive<ProductOnInvoiceTable>({
		key: '',
		row: '',
		product: {
			id: undefined,
			name: '',
		},
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
	});

	const setInitialData = () => {
		invoiceInitialStatus();
		invoiceTableData.value = [];
	};

	return {
		invoice,
		details,
		openSearchProduct,
		invoiceTableData,
		productOnInvoiceTable,
		invoiceInitialStatus,
		setInitialData,
		InvoiceGetter: computed(() => invoice),
		invoiceList,
		invoiceType,
	};
});
