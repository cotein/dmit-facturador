import { emptyProduct } from '@/app/components/product/productFormModel';
import type { ListProductItem, ProductForm } from '@/app/types/Product';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useProductStore = defineStore('product', () => {
    const products = ref<ListProductItem[]>([]);

    const productsListSpinner = ref<boolean>(false);

    const product = ref<ProductForm>(emptyProduct());

    /**
     * Deja el formulario de alta/edición en blanco. Se llama al entrar a la
     * pantalla y después de guardar, para no arrastrar el producto anterior.
     */
    const productInitialState = () => {
        product.value = emptyProduct();
    };

    const selectedCategories = ref<number[]>([]);

    return {
        //State properties
        product,
        products,
        productsListSpinner,
        selectedCategories,
        //Actions
        productInitialState,
        //Getters
        ProdutGetter: computed(() => product),
    };
});
