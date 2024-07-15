import type { CbteAsoc, PeriodoAsoc } from './Afip';

export type Address = {
    city?: string;
    street?: string;
    cp?: string;
    state?: string;
};

export type Company = {
    id: number;
    name: string;
    last_name?: string; // Optional property
    fantasy_name: string;
    cuit: string;
    afipInscription: string;
    afipDocument: string;
    activity_init?: string;
    iibb?: string;
    address?: Address;
};

export type Customer = {
    id: number;
    name: string;
    last_name?: string; // Optional property
    fantasy_name: string;
    cuit: string;
    afipInscription?: string;
    afipInscription_id?: number;
    afipDocument?: string;
    afipDocTipo?: number;
    address?: Address;
    status?: string;
};

export type Voucher = {
    cae_fch_vto: string;
    cae: string;
    cbte_desde: string;
    cbte_fch: string;
    cbteAsoc: CbteAsoc;
    children: [];
    concepto: number;
    fch_serv_desde: string;
    fch_serv_hasta: string;
    fch_vto_pago: string;
    isNotaCredito: boolean;
    isNotaDebito: boolean;
    name: string;
    nota_credito_o_debito_text: string;
    parents: [];
    periodoAsoc: PeriodoAsoc;
    pto_vta: string;
    sale_conditions_id: number;
    sale_conditions: string;
    status: number;
    total: number;
    typeNotaCredito: number;
    typeNotaDebito: number;
    voucher_type: number;
    voucher_id: number;
};

export type Item = {
    id: number;
    name: string;
    quantity: number;
    neto_import: number;
    iva_import: number;
    unit_price: number;
    total: number;
};

export type InvoiceList = {
    id: number;
    company: Company;
    customer: Customer;
    voucher?: Voucher;
    items: Item[];
    comment: string;
};

export type Pagination = {
    total?: number;
    perPage?: number;
    currentPage?: number;
    lastPage?: number;
    from?: number;
    to?: number;
};

export type InvoiceListWithPagination = {
    data: InvoiceList[];
    pagination: Pagination;
};
