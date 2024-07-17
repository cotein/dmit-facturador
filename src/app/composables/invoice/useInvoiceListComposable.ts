import { getInvoiceList } from '@/api/invoice/invoice-api';
import { storeToRefs } from 'pinia';
import { useCompanyComposable } from '../company/useCompanyComposable';
import { useQuery } from '@tanstack/vue-query';
import { watch } from 'vue';
import { useInvoiceListStore } from '@/app/store/invoice/useInvoiceListStore';
import { useFilterSearchByCustomerStore } from '@/app/store/filter-search/useFilterSearchByCustomerStore';
import { useFilterSearchByBetweenDaysStore } from '@/app/store/filter-search/useFilterSearchByBetweenDaysStore';

const { from, to } = storeToRefs(useFilterSearchByBetweenDaysStore());
const { customer } = storeToRefs(useFilterSearchByCustomerStore());
const { currentPage, itemsPerPage, totalPages, invoiceList, status_id, totalItems } = storeToRefs(
    useInvoiceListStore(),
);

export const useInvoiceListComposable = () => {
    const { CompanyGetter } = useCompanyComposable();

    const { isLoading, data } = useQuery(
        ['invoice-list', currentPage, itemsPerPage, customer, status_id, from, to],
        async () => {
            return await getInvoiceList(
                CompanyGetter.value!.id!,
                customer.value?.value!,
                status_id.value!,
                from.value,
                to.value,
                currentPage.value,
                itemsPerPage.value,
            );
        },
        {
            cacheTime: Infinity,
        },
    );

    watch(data, (invoices) => {
        if (invoices?.data) {
            const { data: list, pagination } = invoices.data;

            if (list) {
                invoiceList.value = list;
            }

            if (pagination) {
                currentPage.value = pagination.current_page;
                totalPages.value = pagination.last_page;
                itemsPerPage.value = pagination.per_page;
                totalItems.value = pagination.total;
            }
        }
    });

    return { currentPage, itemsPerPage, totalPages, invoiceList, isLoading, data, status_id };
};
