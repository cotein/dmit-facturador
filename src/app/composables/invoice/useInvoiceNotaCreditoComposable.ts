import type { ProductForNotaCredito } from '@/app/types/Product';
import { storeToRefs } from 'pinia';
import { useInvoiceNotaCreditoStore } from '@/app/store/invoice/useInvoiceNotaCreditoStore';

const { invoiceForNotaCredito, openDrawerNotaCredito, titleNotaCredito, totalNotaCredito, productsForNotaCredito } =
	storeToRefs(useInvoiceNotaCreditoStore());

const invoiceListForNotaCreditoStore = useInvoiceNotaCreditoStore();

invoiceListForNotaCreditoStore.$subscribe((m, state) => {
	const totalNota = productsForNotaCredito.value.reduce((acc, item: ProductForNotaCredito) => {
		return acc + item.neto_import + item.iva_import;
	}, 0);

	totalNotaCredito.value = parseFloat(totalNota.toFixed(2));
});

export const useInvoiceNotaCreditoComposable = () => {
	return {
		invoiceForNotaCredito,
		openDrawerNotaCredito,
		productsForNotaCredito,
		titleNotaCredito,
		totalNotaCredito,
	};
};
