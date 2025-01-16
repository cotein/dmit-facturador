import type { AxiosResponse } from 'axios';
import { ApiHttp } from '../base-api';
import type { PriceList } from '@/app/types/PriceList';

const URL = '/api/price-list';

type ErrorData = {
    message: string;
    errors: Record<string, string[]>;
};

export const savePriceList = async (payload: {
    company_id: number;
    newPriceList: string;
    profit_percentage: number;
}): Promise<AxiosResponse<PriceList[]> | undefined> => {
    try {
        const response = await ApiHttp.post(URL, {
            company_id: payload.company_id,
            newPriceList: payload.newPriceList,
            profit_percentage: payload.profit_percentage,
        });

        return response;
    } catch (error: any) {
        if (ApiHttp.isAxiosError<ErrorData, Record<string, unknown>>(error)) {
            console.error(' bbbbbbbbbbbb ' + error.response?.data.message);
            throw new Error(error.response?.data.message);
        } else {
            throw new Error(error);
        }
    }
};
