import type { PriceListFromDataBase } from '@/app/types/PriceList';
import type { Product } from '@/app/types/Product';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSearchProductStore = defineStore('search-product', () => {
	const selectedProduct = ref<Product>();

	const priceList = ref<PriceListFromDataBase[]>([]);

	const sendProductToInvoice = ref<boolean>(false);

	return {
		//State properties
		selectedProduct,
		priceList,
		sendProductToInvoice,
		//Getters
	};
});
