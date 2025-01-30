import { AFIP_IVAS } from '@/app/types/Constantes';
import type { ListProductItem, Product } from '@/app/types/Product';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useProductStore = defineStore('product', () => {
    const products = ref<ListProductItem[]>([]);

    const productsListSpinner = ref<boolean>(false);

    const product = ref<Product>({
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
    });

    const productInitialState = () => {
        console.log('🚀 ~ productInitialState ~ productInitialState:', productInitialState);

        product.value.apply_discount = false;
        product.value.apply_discount_amount = 0;
        product.value.apply_discount_percentage = 0;
        product.value.category = [];
        product.value.cost = 0;
        product.value.code = '';
        product.value.critical_stock = 1;
        product.value.discount_amount = 0;
        product.value.discount_percentage = 0;
        product.value.iva = AFIP_IVAS.AFIP_ID_VEINTI_UNO;
        product.value.meters_by_unity = 0;
        product.value.name = '';
        product.value.pictures = [];
        product.value.price_list = [];
        product.value.priority = 10;
        product.value.published_here = false;
        product.value.quantity = 1;
        product.value.sale_by_meter = false;
        product.value.view_price = false;
    };

    const selectedCategories = ref<number[]>([]);

    const selectedPriceList = ref<string[]>([]);

    const openModalViewImg = ref<boolean>(false);

    const selectedKeysInPriceListTransfer = ref<string[]>([]);

    const openModalImg = (): void => {
        openModalViewImg.value = !openModalViewImg.value;
    };

    const setIvaProduct = (iva: number): void => {
        product.value.iva = iva;
    };

    return {
        //State properties
        product,
        products,
        productsListSpinner,
        selectedCategories,
        selectedPriceList,
        openModalViewImg,
        selectedKeysInPriceListTransfer,
        //Actions
        productInitialState,
        openModalImg,
        //Getters
        ProdutGetter: computed(() => product),
        setIvaProduct,
    };
});
