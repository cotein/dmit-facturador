import type { AxiosResponse } from 'axios';
import { ApiHttp } from '../base-api';
import type { Sujeto } from '@/app/types/Company';
import { PAGINATION_ITEMS_PER_PAGE_50 } from '@/app/types/Constantes';
import type { CustomerResponse, DashBoardTotalCustomers } from '@/app/types/Customer';
const URL = '/api/customer';

type IsActiveType = 'active' | 'inactive' | 'all';

export const saveCustomer = async (customer: Sujeto): Promise<AxiosResponse<Sujeto>> => {
    const response = await ApiHttp.post<Sujeto>(URL, { customer });

    return response;
};

export const getCustomers = async (
    company_id: number,
    name: string = '',
    isActive: IsActiveType = 'all',
    page: number = 1,
    itemsPerPage: number = PAGINATION_ITEMS_PER_PAGE_50,
): Promise<CustomerResponse> => {
    // Modifica aquí el tipo de retorno
    try {
        const params = new URLSearchParams();

        // Añade los parámetros como antes
        if (company_id != null) params.append('company_id', company_id.toString());
        if (name != null) params.append('name', name);
        if (isActive != null) params.append('isActive', isActive);
        if (page != null) params.append('page', page.toString());
        if (itemsPerPage != null) params.append('itemsPerPage', itemsPerPage.toString());

        // Asume que tu API devuelve un objeto con la estructura { data: Customer[], pagination: PaginationInfo }
        const response: AxiosResponse<CustomerResponse> = await ApiHttp.get<CustomerResponse>(URL, { params });

        return response.data; // Devuelve directamente el objeto con la estructura deseada
    } catch (error) {
        throw new Error();
    }
};

export const getCustomerCuentaCorriente = async (
    company_id: number,
    customer_id: number | null = null,
    from: string | null,
    to: string | null,
    page: number | null = 1,
    per_page: number | null = 10,
    print: string = 'no',
) => {
    try {
        const params = new URLSearchParams();

        params.append('is_customer_cuenta_corriente', 'yes');

        if (company_id != null) {
            params.append('company_id', company_id.toString());
        }

        if (customer_id != null) {
            params.append('customer_id', customer_id.toString());
        }

        if (from != null) {
            params.append('from', from);
        }

        if (to != null) {
            params.append('to', to);
        }

        if (print != null) {
            params.append('print', print.toString());
        }

        if (page != null) {
            params.append('page', page.toString());
        }

        if (per_page != null) {
            params.append('per_page', per_page.toString());
        }

        const { data } = await ApiHttp.get<[]>(URL, { params });

        return data;
    } catch (error) {
        throw new Error();
    }
};

export const dashBoardTotalcustomers = async (company_id: number, dashboard: string = 'yes'): Promise<number> => {
    // Modifica aquí el tipo de retorno
    try {
        const params = new URLSearchParams();

        if (company_id) params.append('company_id', company_id.toString());
        if (dashboard) params.append('dashboard', dashboard.toString());

        // Asume que tu API devuelve un objeto con la estructura { data: Customer[], pagination: PaginationInfo }
        const response: AxiosResponse<number> = await ApiHttp.get<number>(URL, {
            params,
        });

        return response.data; // Devuelve directamente el objeto con la estructura deseada
    } catch (error) {
        throw new Error();
    }
};
