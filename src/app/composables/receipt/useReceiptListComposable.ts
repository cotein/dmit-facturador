import { storeToRefs } from 'pinia';
import { useCompanyComposable } from '../company/useCompanyComposable';
import { useQuery } from '@tanstack/vue-query';
import { useFilterSearchByCustomerStore } from '@/app/store/filter-search/useFilterSearchByCustomerStore';
import { useFilterSearchByBetweenDaysStore } from '@/app/store/filter-search/useFilterSearchByBetweenDaysStore';
import { useReceiptListStore } from '@/app/store/receipt/useReceiptListStore';
import { getReceipts } from '@/api/receipt/receipt-api';
import { watch } from 'vue';

const { from, to } = storeToRefs(useFilterSearchByBetweenDaysStore());
const { customer } = storeToRefs(useFilterSearchByCustomerStore());
const { currentPage, itemsPerPage, totalPages, status_id, totalItems, receiptList } = storeToRefs(
    useReceiptListStore(),
);

export const useReceiptListComposable = () => {
    const { CompanyGetter } = useCompanyComposable();

    const { isLoading, data } = useQuery(
        ['receipt-list', currentPage, itemsPerPage, customer, status_id, from, to],
        async () => {
            return await getReceipts(
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
            onSuccess(data) {
                console.log('🚀 ~ useReceiptListComposable ~ data:', data);
                receiptList.value = data.data;
            },
        },
    );

    watch(data, (receipts) => {
        if (receipts!.data) {
            const { data: list, pagination } = receipts!.data;
            console.log('🚀 ~ watch ~ list:', list);

            if (list) {
                receiptList.value = list;
            }

            if (pagination) {
                currentPage.value = pagination.current_page;
                totalPages.value = pagination.last_page;
                itemsPerPage.value = pagination.per_page;
                totalItems.value = pagination.total;
            }
        }
    });

    return { currentPage, itemsPerPage, totalPages, receiptList, isLoading, data, status_id, totalItems };
};
