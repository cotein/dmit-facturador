import { getBanks } from '@/api/bank/bank-api';
import { useQuery, useQueryClient } from '@tanstack/vue-query';

import { useBankStore } from '@/app/store/bank/useBankStore';
import { storeToRefs } from 'pinia';

import type { Bank } from '@/app/types/Bank';
import { ref } from 'vue';

export const useBankComposable = () => {
    const { banks, selectedBank } = storeToRefs(useBankStore());

    const queryClient = useQueryClient(); // Obtén el cliente de query

    // Verifica si hay datos en la caché
    const cachedData = queryClient.getQueryData(['banks']);

    const { isLoading, data } = useQuery<Bank[]>(
        ['banks'],
        async () => {
            const response = await getBanks(null);
            return response.data;
        },
        {
            cacheTime: Infinity,
            staleTime: Infinity,
            /* enabled: cachedData ? true : false,
            cacheTime: Infinity, */
            /*  refetchOnMount: true,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false, */
            onSuccess(data: Bank[]) {
                banks.value = data;
            },
        },
    );

    const getBankById = (id: number) => {
        return banks.value.find((bank) => bank.id === id)?.name ?? '';
    };

    return { isLoading, data, banks, selectedBank, getBankById };
};
