// src/app/types/ApiParams.ts
export type InvoiceListParams = {
    company_id: number;
    customer_id?: number;
    status_id?: number;
    from?: string;
    to?: string;
    page?: number;
    per_page?: number;
    print?: string;
    invoice_id?: number;
    getPaymentOnReceipt?: boolean;
};
