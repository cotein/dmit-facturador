import { fetchProducts, saveProduct, updateProduct } from '@/api/product/product-api';
import { useProductStore } from '@/app/store/product/useProductStore';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { usePaginationComposable } from '../pagination/usePaginationComposable';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';

const { products, product, productsListSpinner, selectedPriceList, selectedKeysInPriceListTransfer, openModalViewImg } =
    storeToRefs(useProductStore());

const { productInitialState, setIvaProduct, openModalImg } = useProductStore();

const { currentPage, itemsPerPage, totalPages, totalItems } = usePaginationComposable();

export const useProductComposable = () => {
    const useFetchProducts = (company_id: number | undefined, list: string = 'list') => {
        const query = useQuery(
            ['products', company_id, list, currentPage, itemsPerPage],
            async () => {
                productsListSpinner.value = true;

                const response = await fetchProducts(company_id, list, currentPage.value, itemsPerPage.value);

                if (!response) {
                    productsListSpinner.value = false;

                    throw new Error('Failed to fetch products');
                }

                productsListSpinner.value = false;

                return response.data;
            },
            {
                refetchOnMount: false, // Evita refetch al montar el componente
                refetchOnWindowFocus: false, // Evita refetch al enfocar la ventana
                keepPreviousData: true, // Mantiene los datos anteriores durante el refetch
            },
        );

        watch(query.data, (www) => {
            if (www?.data) {
                products.value = www.data;

                if (www.pagination) {
                    currentPage.value = www.pagination.current_page;
                    totalPages.value = www.pagination.last_page;
                    totalItems.value = www.pagination.total;
                }
            }
        });
    };
    return {
        saveProduct,
        //productStoreMutation,
        //useProductMutation,
        useFetchProducts,
        products,
        product,
        productsListSpinner,
        productInitialState,
        selectedPriceList,
        selectedKeysInPriceListTransfer,
        updateProduct,
        openModalImg,
        setIvaProduct,
        openModalViewImg,
    };
};
