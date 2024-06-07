import { apiAfipGetVouchers } from '@/api/afip/afip-vouchers';
import type { AfipIva } from './../../types/Afip';
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import { useAfipVoucherStore } from '@/app/store/afip/useAfipVoucherStore';

const { vouchers } = storeToRefs(useAfipVoucherStore());
const { setVouchersAction } = useAfipVoucherStore();

export const useVoucherComposable = () => {
    //defino el store
    const { isLoading } = useQuery(['afip-voucher'], () => apiAfipGetVouchers(), {
        cacheTime: Infinity,

        onSuccess(data: AfipIva[]) {
            setVouchersAction(data);
        },
    });
    return { vouchers };
};
