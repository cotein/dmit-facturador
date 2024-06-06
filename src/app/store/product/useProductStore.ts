import { AFIP_IVAS } from '@/app/types/Constantes';
import type { Product } from '@/app/types/Product';
import { defineStore } from 'pinia';
import { computed, reactive, ref, type UnwrapRef } from 'vue';

export const useProductStore = defineStore( 'product', () => {
	const product: UnwrapRef<Product> = reactive( {
		apply_discount: false,
		apply_discount_amount: 0,
		apply_discount_percentage: 0,
		category: [],
		cost: 0,
		code: '',
		critical_stock: 1,
		discount_amount: 0,
		discount_percentage: 0,
		iva: AFIP_IVAS.AFIP_ID_VEINTI_UNO,
		meters_by_unity: 0,
		name: '',
		pictures: [],
		price_list: [],
		priority: 10,
		published_here: false,
		quantity: 1,
		sale_by_meter: false,
		view_price: false,
	} );

	const productInitialState = () => {
		product.apply_discount = false;
		product.apply_discount_amount = 0;
		product.apply_discount_percentage = 0;
		product.category = [];
		product.cost = 0;
		product.code = '';
		product.critical_stock = 1;
		product.discount_amount = 0;
		product.discount_percentage = 0;
		product.iva = 5;
		product.meters_by_unity = 0;
		product.name = '';
		product.pictures = [];
		product.price_list = [];
		product.priority = 10;
		product.published_here = false;
		product.quantity = 1;
		product.sale_by_meter = false;
		product.view_price = false;
	};

	const selectedCategories = ref<number[]>( [] );

	const selectedPriceList = ref<string[]>( [] );

	const openModalViewImg = ref<boolean>( false );

	const openModalImg = (): void => {
		openModalViewImg.value = !openModalViewImg.value;
	};

	return {
		//State properties
		product,
		selectedCategories,
		selectedPriceList,
		openModalViewImg,
		//Actions
		productInitialState,
		openModalImg,
		//Getters
		ProdutGetter: computed( () => product ),
	};
} );
