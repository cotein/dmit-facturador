import type { InvoicePdf } from './../../app/types/Pdf';
import type { CustomerInvoice, CustomerOnSaleInvoice } from './../../app/types/Customer';
import type { AxiosError, AxiosResponse } from 'axios';
import { ApiHttp } from '../base-api';
import { message } from 'ant-design-vue';
import type {
    FECAEDetRequest,
    FEParamGetPtosVentaResultAxiosData,
    FEUltimoAutorizado,
    FeCabReq,
} from '@/app/types/Afip';
import type { ProductForNotaCredito, ProductOnInvoiceTable } from '@/app/types/Product';

const URL = '/api/afip';

export const FECAESolicitar = async (
    FeCabReq: FeCabReq,
    FECAEDetRequest: FECAEDetRequest,
    environment: string,
    company_cuit: string,
    company_id: string,
    user_id: string,
    products: ProductOnInvoiceTable[] | ProductForNotaCredito[],
    saleCondition: number,
    customer: CustomerInvoice | CustomerOnSaleInvoice,
    comments: string,
    paymentType: number,
    parent?: number,
): Promise<AxiosResponse<InvoicePdf> | undefined> => {
    try {
        const response = await ApiHttp.post<InvoicePdf>(`${URL}/FECAESolicitar`, {
            FeCabReq,
            FECAEDetRequest,
            environment,
            company_cuit,
            company_id,
            user_id,
            products,
            saleCondition,
            customer,
            comments,
            paymentType,
            parent,
        });

        return response;
    } catch (error: any) {
        if (error.response) {
            message.error({
                content: error.response.data.message,
                duration: 8,
            });
        }
    }
};

export const FECompUltimoAutorizado = async (
    CbteTipo: string | number,
    PtoVta: string | number,
    environment: string,
    company_cuit: string,
    company_id: string,
    user_id: string,
): Promise<AxiosResponse<FEUltimoAutorizado> | undefined> => {
    try {
        const params = new URLSearchParams();

        params.append('CbteTipo', String(CbteTipo));
        params.append('PtoVta', String(PtoVta));
        params.append('environment', String(environment));
        params.append('company_cuit', String(company_cuit));
        params.append('company_id', String(company_id));
        params.append('user_id', String(user_id));

        const response = await ApiHttp.get<FEUltimoAutorizado>(`${URL}/FECompUltimoAutorizado`, { params });

        return response;
    } catch (error: any) {
        if (error.response) {
            message.error({
                content: error.response.data.message,
                duration: 8,
            });
        }
    }
};

export const FEParamGetPtosVenta = async (
    environment: string,
    company_cuit: string,
    company_id: string,
    user_id: string,
): Promise<AxiosResponse<FEParamGetPtosVentaResultAxiosData> | undefined> => {
    try {
        const params = new URLSearchParams();

        params.append('environment', String(environment));
        params.append('company_cuit', String(company_cuit));
        params.append('company_id', String(company_id));
        params.append('user_id', String(user_id));

        const response = await ApiHttp.get<FEParamGetPtosVentaResultAxiosData>(`${URL}/FEParamGetPtosVenta`, {
            params,
        });

        return response;
    } catch (error: any) {
        if (error.response) {
            message.error({
                content: error.response.data.message,
                duration: 8,
            });
        }
    }
};
