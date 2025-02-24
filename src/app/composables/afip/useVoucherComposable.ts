import { apiAfipGetVouchers } from '@/api/afip/afip-vouchers';
import type { AfipIva } from './../../types/Afip';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import { useAfipVoucherStore } from '@/app/store/afip/useAfipVoucherStore';

const { vouchers } = storeToRefs(useAfipVoucherStore());
const { setVouchersAction } = useAfipVoucherStore();

export const useVoucherComposable = () => {
    const queryClient = useQueryClient(); // Obtén el cliente de query

    // Verifica si hay datos en la caché
    const cachedData = queryClient.getQueryData(['afip-voucher']);

    const { isLoading } = useQuery(['afip-voucher'], () => apiAfipGetVouchers(), {
        cacheTime: Infinity,
        enabled: !cachedData,
        staleTime: Infinity,
        onSuccess(data: AfipIva[]) {
            setVouchersAction(data);
        },
    });
    return { vouchers };
};
