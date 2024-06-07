import { useQuery } from '@tanstack/vue-query';
import { getInvoiceList } from '@/api/invoice/invoice-api';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { useInvoiceChartStore } from '@/app/store/invoice/useInvoiceChartStore';
import { useCompanyComposable } from '../company/useCompanyComposable';
import dayjs, { Dayjs } from 'dayjs';
import type { InvoiceList, Item } from '@/app/types/Invoice';

export const useInvoiceChartComposable = () => {
    const { invoices, totalInvoiced } = storeToRefs(useInvoiceChartStore());
    const { CompanyGetter } = useCompanyComposable();
    const to: Dayjs = dayjs();
    const from: string = to.subtract(1, 'year').format('YYYY-MM-DD');

    const { isLoading, isError, error, data } = useQuery(
        ['sale-invoice-chart-cache'],
        async () =>
            await getInvoiceList(CompanyGetter.value!.id, null, null, from, to.format('YYYY-MM-DD'), null, null, null),
    );

    watch(data, (obtainedInvoices) => {
        if (obtainedInvoices) {
            invoices.value = obtainedInvoices.data;

            const grouped = obtainedInvoices.data.reduce((acc: any, invoice: InvoiceList) => {
                const voucherName = invoice.voucher.name;
                const itemsTotal = invoice.items.reduce((total: number, item: Item) => total + item.total, 0);

                if (!acc[voucherName]) {
                    acc[voucherName] = itemsTotal;
                } else {
                    acc[voucherName] += itemsTotal;
                }

                return acc;
            }, {});

            console.log(grouped);
        }
    });

    watch(isError, (errorStatus) => {
        if (errorStatus) {
            console.error('Error fetching data:', error);
        }
    });

    return { isLoading, isError, error, data };
};
