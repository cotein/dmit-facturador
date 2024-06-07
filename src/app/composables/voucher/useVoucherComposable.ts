import { getVouchers } from '@/api/voucher/voucher-api';
import { useQuery } from '@tanstack/vue-query';

import { useVoucherStore } from '@/app/store/voucher/useVoucherStore';
import { storeToRefs } from 'pinia';

const { setVouchers } = useVoucherStore();
const { Vouchers } = storeToRefs(useVoucherStore());

export const useVoucherComposable = () => {
    const fetchVouchers = (company_inscription_id: number, customer_inscription_id: number | null) => {
        return useQuery(['vouchers'], () => getVouchers(company_inscription_id, customer_inscription_id ?? null), {
            cacheTime: -1,

            onSuccess(data: []) {
                setVouchers(data);
            },
        });
    };

    return {
        fetchVouchers,
        Vouchers,
    };
};
