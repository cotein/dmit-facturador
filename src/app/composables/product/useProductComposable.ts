import { fetchProducts, saveProduct, updateProduct } from '@/api/product/product-api';
import { useProductStore } from '@/app/store/product/useProductStore';
import { useQuery } from '@tanstack/vue-query';
import { usePaginationComposable } from '../pagination/usePaginationComposable';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';

const { products, product, productsListSpinner } = storeToRefs(useProductStore());

const { productInitialState } = useProductStore();

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

        watch(query.data, (data) => {
            if (data?.data) {
                products.value = data.data;

                if (data.pagination) {
                    currentPage.value = data.pagination.current_page;
                    totalPages.value = data.pagination.last_page;
                    totalItems.value = data.pagination.total;
                }
            }
        });
    };

    return {
        useFetchProducts,
        products,
        product,
        productsListSpinner,
        productInitialState,
        // Los expone para quien resuelve el guardado fuera del formulario.
        saveProduct,
        updateProduct,
    };
};
