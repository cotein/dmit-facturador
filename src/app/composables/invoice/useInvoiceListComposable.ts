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
const { currentPage, itemsPerPage, totalPages, invoiceList, status_id } = storeToRefs(useInvoiceListStore());

export const useInvoiceListComposable = () => {
	const { CompanyGetter } = useCompanyComposable();
	const { isLoading, data } = useQuery(
		['invoice-list', currentPage, itemsPerPage, customer, status_id, from, to],
		async () =>
			await getInvoiceList(
				CompanyGetter.value?.id,
				customer.value?.value,
				status_id.value,
				from.value,
				to.value,
				currentPage.value,
				itemsPerPage.value,
			),
	);

	watch(data, (invoices) => {
		if (invoices) {
			const list = invoices.data.data;

			invoiceList.value = list;

			currentPage.value = invoices?.data.pagination.currentPage;

			totalPages.value = invoices!.data.pagination.total;
		}
	});

	return { currentPage, itemsPerPage, totalPages, invoiceList, isLoading, data, status_id };
};
