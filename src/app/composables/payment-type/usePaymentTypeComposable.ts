import type { AxiosResponse } from 'axios';
import type { PaymentType } from '@/app/types/PaymentType';
import { getPaymentTypes } from '@/api/payment-type/payment-type-api';
import { storeToRefs } from 'pinia';
import { useCompanyComposable } from '../company/useCompanyComposable';
import { usePaymentTypeStore } from '@/app/store/payment-type/usePaymentTypeStore';
import { useQuery } from '@tanstack/vue-query';

export const usePaymentTypeComposable = () => {
    const { CompanyGetter } = useCompanyComposable();

    const { paymentTypes, PaymentTypesGetter } = storeToRefs(usePaymentTypeStore());

    const fetchPaymentTypes = () => {
        const companyId = CompanyGetter?.value?.id;
        if (companyId === undefined) {
            throw new Error('Company ID is undefined');
        }
        return useQuery(['payment-types'], () => getPaymentTypes(companyId), {
            onSuccess(data: PaymentType[]) {
                paymentTypes.value = data;
            },
            staleTime: 1000 * 60 * 60,
        });
    };

    return {
        paymentTypes,
        PaymentTypesGetter,
        fetchPaymentTypes,
    };
};
