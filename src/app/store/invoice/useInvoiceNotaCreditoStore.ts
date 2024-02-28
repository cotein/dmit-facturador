import type { InvoiceList } from '@/app/types/Invoice';
import type { ProductForNotaCredito } from '@/app/types/Product';
import { defineStore } from 'pinia';
import { ref, reactive, toRaw } from 'vue';

//También se utiliza para notas de débitos
export const useInvoiceNotaCreditoStore = defineStore('invoice-nota-credito', () => {
	const invoiceForNotaCredito = ref<InvoiceList>();

	const openDrawerNotaCredito = ref<boolean>(false);

	const titleNotaCredito = ref<string>('NOTA DE CRÉDITO');

	const productsForNotaCredito = ref<ProductForNotaCredito[]>([]);

	const totalNotaCredito = ref<number>(0);

	return {
		invoiceForNotaCredito,
		openDrawerNotaCredito,
		titleNotaCredito,
		totalNotaCredito,
		productsForNotaCredito,
	};
});
