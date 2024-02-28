import type { ProductForNotaCredito } from '@/app/types/Product';
import { storeToRefs } from 'pinia';
import { useInvoiceNotaCreditoStore } from '@/app/store/invoice/useInvoiceNotaCreditoStore';

const { invoiceForNotaCredito, openDrawerNotaCredito, titleNotaCredito, totalNotaCredito, productsForNotaCredito } =
	storeToRefs(useInvoiceNotaCreditoStore());

const invoiceListForNotaCreditoStore = useInvoiceNotaCreditoStore();

invoiceListForNotaCreditoStore.$subscribe((m, state) => {
	totalNotaCredito.value = productsForNotaCredito.value.reduce((acc, item: ProductForNotaCredito) => {
		return acc + item.quantity * item.unit_price;
	}, 0);
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
