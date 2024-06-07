import { ApiHttp } from '../base-api';

export const apiAfipGetVouchers = async (): Promise<any> => {
    const params = new URLSearchParams();

    const { data } = await ApiHttp.get<any>('/api/voucher', { params });

    return data;
};
