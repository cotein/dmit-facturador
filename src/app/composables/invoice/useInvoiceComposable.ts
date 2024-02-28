import type { CustomerInvoice, CustomerOnSaleInvoice } from '@/app/types/Customer';
import type { FECAEDetRequest, FeCabReq, Ivas } from '@/app/types/Afip';
import type { ProductForNotaCredito, ProductOnInvoiceTable } from '@/app/types/Product';

import { computed } from 'vue';
import { FECAESolicitar } from '@/api/afip/afip-factura-electronica';
import { storeToRefs } from 'pinia';
import { useCompanyComposable } from '../company/useCompanyComposable';
import { useInvoiceStore } from '@/app/store/invoice/useInvoiceStore';
import { useMutation } from '@tanstack/vue-query';
import { INVOICE_TYPE } from '@/app/types/Constantes';
import { message } from 'ant-design-vue';

const { invoice, InvoiceGetter, details, openSearchProduct, invoiceTableData, productOnInvoiceTable, isSale } =
	storeToRefs(useInvoiceStore());

const { invoiceInitialStatus } = useInvoiceStore();

const invoiceStore = useInvoiceStore();

invoiceStore.$subscribe(() => {
	invoiceTableData.value.forEach((item: ProductOnInvoiceTable) => {
		item.subtotal = item.unit * item.quantity - item.discount;
		item.iva_import = (item.subtotal * item.iva.percentage) / 100;
		item.total = item.subtotal + item.iva_import;
	});

	if (
		[
			INVOICE_TYPE.NOTA_CREDITO_A,
			INVOICE_TYPE.NOTA_CREDITO_B,
			INVOICE_TYPE.NOTA_CREDITO_C,
			INVOICE_TYPE.NOTA_DEBITO_A,
			INVOICE_TYPE.NOTA_DEBITO_B,
			INVOICE_TYPE.NOTA_DEBITO_C,
		].includes(invoice.value.voucher.id)
	) {
		isSale.value = false;
	} else {
		isSale.value = true;
	}
});

const Subtotal = computed(() => {
	return invoiceTableData.value.reduce((total: number, item: ProductOnInvoiceTable) => {
		return total + item.subtotal;
	}, 0);
});

const Discount = computed(() => {
	return invoiceTableData.value.reduce((total: number, item: ProductOnInvoiceTable) => {
		return total + item.discount;
	}, 0);
});

const IVA = computed(() => {
	return invoiceTableData.value.reduce((total: number, item: ProductOnInvoiceTable) => {
		return total + item.iva_import;
	}, 0);
});

const TotalComprobante = computed(() => {
	return invoiceTableData.value.reduce((total: number, item: ProductOnInvoiceTable) => {
		return total + item.total;
	}, 0);
});

/* const ImpTotConc = computed(() => {
	return invoiceTableData.value.reduce((total: number, item: ProductOnInvoiceTable) => {
		if (item.iva.id === AFIP_IVA.NO_GRAVADO) return total + item.iva_import;
		return total;
	}, 0);
}); */

/* const ImporteNeto = computed(() => {
	return invoiceTableData.value.reduce((total: number, item: ProductOnInvoiceTable) => {
		if (invoice.value.CbteTipo) {
		}
		return total;
	}, 0);
}); */

const IVAS = computed(() => {
	const ivas: Ivas[] = [];

	if (invoiceTableData && invoiceTableData.value.length) {
		invoiceTableData.value.reduce((total: number, item: ProductOnInvoiceTable) => {
			const index = ivas.findIndex((el) => el.name === item.iva.name);
			if (index < 0) {
				ivas.push({
					id: item.iva.id,
					name: item.iva.name,
					import: item.iva_import,
					subtotal: item.subtotal,
				});
			} else {
				ivas[index].import += item.iva_import;
				ivas[index].subtotal += item.subtotal;
			}
			return total + item.iva_import;
		}, 0);

		return ivas;
	}
	return 0;
});

export const useInvoiceComposable = () => {
	const { CompanyGetter } = useCompanyComposable();

	const createInvoiceMutation = useMutation(
		async (params: {
			FeCabReq: FeCabReq;
			FECAEDetRequest: FECAEDetRequest;
			environment: string;
			company_cuit: string;
			company_id: string;
			user_id: string;
			products: ProductOnInvoiceTable[] | ProductForNotaCredito[];
			saleCondition: { days: number; id: number };
			customer: CustomerInvoice | CustomerOnSaleInvoice;
			comments: string;
			parent?: number;
		}) => {
			const response = await FECAESolicitar(
				params.FeCabReq,
				params.FECAEDetRequest,
				params.environment,
				params.company_cuit,
				params.company_id,
				params.user_id,
				params.products,
				params.saleCondition,
				params.customer,
				params.comments,
				params.parent,
			);

			return response;
		},
		{
			onSuccess: (data) => {
				message.success({ content: 'Comprobante emitido correctamente', duration: 3 });
			},
		},
	);

	/* const createInvoiceBuilder = async () => {
		const invoiceType = 1; //factura

		const inscriptionCompany = CompanyGetter.value.inscription_id as number;

		const inscriptionCustomer = invoice.value.customer.afip_inscription.id as number;

		const invoiceBuilder = FactoryInvoiceBuilder.getInvoiceBuilder(
			invoiceType,
			inscriptionCompany,
			inscriptionCustomer,
		);

		const concreteInvoiceBuilder = new invoiceBuilder() as AfipInvoiceBaseBuilder;

		concreteInvoiceBuilder.setCantReg(1);
		concreteInvoiceBuilder.setPtoVta(CompanyGetter.value.pto_vta_fe);
		concreteInvoiceBuilder.setCbteTipo(concreteInvoiceBuilder.CbteTipo);

		concreteInvoiceBuilder.setConcepto(invoice.value.Concepto);
		concreteInvoiceBuilder.setDocTipo(invoice.value.customer.afip_document.afip_code);
		concreteInvoiceBuilder.setDocNro(invoice.value.customer.cuit);
		concreteInvoiceBuilder.setCbteDesde(invoice.value.CbteNro);
		concreteInvoiceBuilder.setCbteHasta(invoice.value.CbteNro);
		concreteInvoiceBuilder.setCbteFch(invoice.value.CbteFch);
		concreteInvoiceBuilder.setImpTotal(Total.value);
		concreteInvoiceBuilder.setImpTotConc(0);
		concreteInvoiceBuilder.setImpNeto(Subtotal.value, Total.value);
		concreteInvoiceBuilder.setImpOpEx(0);
		concreteInvoiceBuilder.setImpIVA(IVA.value);
		concreteInvoiceBuilder.setImpTrib(0);
		concreteInvoiceBuilder.setFchServDesde(invoice.value.FchServDesde);
		concreteInvoiceBuilder.setFchServHasta(invoice.value.FchServHasta);
		concreteInvoiceBuilder.setFchVtoPago(invoice.value.CbteFch, invoice.value.SaleCondition.days);
		concreteInvoiceBuilder.setMonId('PES');
		concreteInvoiceBuilder.setMonCotiz(1);
		concreteInvoiceBuilder.setIvaAarray(IVAS.value);
		concreteInvoiceBuilder.setCbtesAsoc();
		concreteInvoiceBuilder.setTributos();
		concreteInvoiceBuilder.setOpcionales();
		concreteInvoiceBuilder.setCompradores();
		concreteInvoiceBuilder.setPeriodoAsoc();
		concreteInvoiceBuilder.setActividades();

		const result = concreteInvoiceBuilder.build();
		console.log('🚀 ~ file: useInvoiceComposable.ts:142 ~ createInvoiceBuilder ~ result:', result);

		return result;
	}; */

	const insertProductOnInvoiceTable = (productOnInvoiceTable: ProductOnInvoiceTable) => {
		invoiceTableData.value.push(productOnInvoiceTable);
	};

	return {
		//createInvoiceBuilder,
		createInvoiceMutation,
		details,
		Discount,
		insertProductOnInvoiceTable,
		invoice,
		InvoiceGetter,
		invoiceInitialStatus,
		invoiceTableData,
		isSale,
		IVA,
		IVAS,
		openSearchProduct,
		productOnInvoiceTable,
		Subtotal,
		TotalComprobante,
		//ImpTotConc,
	};
};
