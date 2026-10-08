import type { AxiosError, AxiosResponse } from 'axios';
import { ApiHttp } from '../base-api';

const URL = '/api/receipt-payments';
const RECEIPT_URL = '/api/receipt';

/**
 * Pagos recibidos: una fila por pago (receipt_payments), no por recibo.
 * El estado lo deriva el API: anulado, a cuenta, parcial, cancelado o imputado.
 */
export type ReceiptPaymentsFilters = {
    company_id: number;
    from?: string | null;
    to?: string | null;
    customer_id?: number | null;
    payment_type_id?: number | null;
    amount_from?: number | null;
    amount_to?: number | null;
    status?: string | null;
    page?: number | null;
    per_page?: number | null;
};

export type ReceiptPaymentRow = {
    id: number;
    receipt_id: number;
    receipt_number: number | null;
    date: string | null;
    amount: number;
    payment_type_id: number | null;
    payment_type: string | null;
    reference: string | null;
    description: string | null;
    bank: string | null;
    cheque_date: string | null;
    cheque_expirate: string | null;
    cheque_owner: string | null;
    customer: { id: number; name: string; afip_number: string | null } | null;
    imputed: Array<{
        sale_invoice_id: number;
        number: number;
        comprobante: string;
        import_payment: number;
        percentage_payment: number;
        status_id: number;
        status_label: string;
    }>;
    status: string;
    status_label: string;
    receipt_total: number | null;
    receipt_balance: number | null;
    cancelled_at: string | null;
    cancel_reason: string | null;
};

export type AccountPaymentDocument = {
    payment_type_id: number | null;
    import: number;
    imputation_date: string;
    number?: string | null;
    comments?: string | null;
    cbu_id?: number | null;
    bank?: number | null;
    chequeDate?: string | null;
    chequeExpirate?: string | null;
    chequeOwner?: string | null;
};

const buildParams = (filters: ReceiptPaymentsFilters): URLSearchParams => {
    const params = new URLSearchParams();

    params.append('company_id', filters.company_id.toString());

    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);
    if (filters.customer_id != null) params.append('customer_id', filters.customer_id.toString());
    if (filters.payment_type_id != null) params.append('payment_type_id', filters.payment_type_id.toString());
    if (filters.amount_from != null) params.append('amount_from', filters.amount_from.toString());
    if (filters.amount_to != null) params.append('amount_to', filters.amount_to.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.page != null) params.append('page', filters.page.toString());
    if (filters.per_page != null) params.append('per_page', filters.per_page.toString());

    return params;
};

const asError = (error: any): Error => {
    if (ApiHttp.isAxiosError<AxiosError, Record<string, unknown>>(error)) {
        const message = (error.response?.data as any)?.message ?? error.message;
        console.log('🚀 ~ receipt payments ~ error:', message);
        return new Error(String(message));
    }

    return new Error(String(error));
};

export const getReceiptPayments = async (filters: ReceiptPaymentsFilters): Promise<AxiosResponse<any>> => {
    try {
        return await ApiHttp.get(URL, { params: buildParams(filters) });
    } catch (error: any) {
        throw asError(error);
    }
};

/**
 * Anula un recibo: no se borra, queda con motivo y fecha, y el API revierte la
 * imputación sobre los comprobantes.
 */
export const cancelReceipt = async (receiptId: number, reason: string | null): Promise<AxiosResponse<any>> => {
    try {
        return await ApiHttp.post(`${RECEIPT_URL}/${receiptId}/anular`, { reason });
    } catch (error: any) {
        throw asError(error);
    }
};

/**
 * Pago a cuenta: sin comprobantes imputados, el importe queda a favor del
 * cliente (por eso el saldo se manda en negativo).
 */
export const createAccountPayment = async (
    company_id: number,
    customer_id: number,
    document: AccountPaymentDocument,
    saldo: number,
): Promise<AxiosResponse<any>> => {
    try {
        return await ApiHttp.post(RECEIPT_URL, {
            company_id,
            customer_id,
            saldo,
            documentsCancelation: [document],
        });
    } catch (error: any) {
        throw asError(error);
    }
};
