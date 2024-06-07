import type { AxiosResponse } from 'axios';
import { ApiHttp } from '../base-api';
import type { PaymentType } from '@/app/types/PaymentType';

const URL = '/api/payment-type';

export const getPaymentTypes = async (company_id: number): Promise<AxiosResponse<PaymentType[]>> => {
    try {
        const params = new URLSearchParams();

        params.append('company_id', company_id.toString());

        const { data } = await ApiHttp.get<PaymentType[]>(URL, { params });

        return data;
    } catch (error) {
        throw new Error();
    }
};
