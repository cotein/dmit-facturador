// src/composables/useInvoiceCommentsComposable.ts
import { getInvoiceComments } from '@/api/invoice/invoice-api';
import { useQuery } from '@tanstack/vue-query';
import { watch } from 'vue';
import { useInvoiceCommentsStore } from '@/app/store/invoice/useInvoiceCommentsStore';
import { useCompanyComposable } from '../company/useCompanyComposable';
import { storeToRefs } from 'pinia';
import { useFilterSearchByCustomerStore } from '@/app/store/filter-search/useFilterSearchByCustomerStore';

const { currentPage, itemsPerPage, totalItems, totalPages, commentsList } = storeToRefs(useInvoiceCommentsStore());

export const useInvoiceCommentsComposable = () => {
    const { customer } = storeToRefs(useFilterSearchByCustomerStore());
    const { CompanyGetter } = useCompanyComposable();

    const { isLoading, data } = useQuery(
        ['invoice-list', currentPage, itemsPerPage, customer],
        async () => {
            return await getInvoiceComments(
                CompanyGetter.value!.id!,
                customer.value?.value!,
                currentPage.value,
                itemsPerPage.value,
            );
        },
        {
            cacheTime: Infinity,
        },
    );

    watch(data, (comments) => {
        if (comments?.data) {
            const { data: list, pagination } = comments.data;

            if (list) {
                commentsList.value = list;
            }

            if (pagination) {
                currentPage.value = pagination.current_page;
                totalPages.value = pagination.last_page;
                itemsPerPage.value = pagination.per_page;
                totalItems.value = pagination.total;
            }
        }
    });

    return { currentPage, itemsPerPage, totalItems, totalPages, commentsList, isLoading, data };
};
