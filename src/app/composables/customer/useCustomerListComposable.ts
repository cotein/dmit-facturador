import { useCustomerListStore } from './../../store/customer/useCustomerListStore';
import { storeToRefs } from 'pinia';
import { useQuery } from '@tanstack/vue-query';
import { getCustomers } from '@/api/customer/customer-api';
import { useCompanyComposable } from '../company/useCompanyComposable';
import { watch } from 'vue';

const { customersList, currentPage, itemsPerPage, status, totalPages, customerName } = storeToRefs(
    useCustomerListStore(),
);

export const useCustomerListComposable = () => {
    const { CompanyGetter } = useCompanyComposable();

    const companyId = CompanyGetter.value?.id;

    const { isLoading, data } = useQuery(
        ['customers-list', companyId, customerName, status, currentPage, itemsPerPage],
        async () =>
            await getCustomers(companyId, customerName.value, status.value, currentPage.value, itemsPerPage.value),
        {
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        },
    );

    watch(data, (customers) => {
        if (customers) {
            const { data: list, pagination } = customers;

            if (list) {
                customersList.value = list;
            }

            if (pagination) {
                currentPage.value = pagination.current_page;
                totalPages.value = pagination.total;
            }
        }
    });

    return {
        customersList,
        currentPage,
        itemsPerPage,
        status,
        totalPages,
        isLoading,
        data,
        customerName,
    };
};
