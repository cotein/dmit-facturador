// Generated by https://quicktype.io

export type InvoicePdf = {
    CbteTipo: number;
    invoice: Array<Invoice | null>;
};

export type Invoice = {
    id: number;
    company: Company;
    customer: Company;
    voucher: Voucher;
    items: Item[];
    comment: string;
};

export type Company = {
    id: number;
    name: string;
    last_name: string;
    fantasy_name: string;
    cuit: string;
    afipInscription: string;
    afipDocument: string;
    activity_init?: string;
    iibb?: string;
    address: Address;
};

export type Item = {
    id: number;
    key: number;
    name: string;
    quantity: number;
    neto_import: number;
    iva_import: number;
    iva_afip_code: string;
    iva_id: number;
    unit_price: number;
    total: number;
    subtotal: number;
    percep_iibb_import: number;
    percep_iva_import: number;
    percep_iva_alicuota: number;
    percep_iibb_alicuota: number;
    discount: number;
    discount_import: number;
    discount_percentage: string;
};

export type Voucher = {
    name: string;
    pto_vta: number;
    cbte_desde: number;
    cbte_fch: string;
    cae: string;
    cae_fch_vto: string;
    sale_conditions: string;
};

export type Customer = {
    id?: number;
    name?: string;
    lastName?: string;
    fantasyName?: string;
    cuit?: string;
    afipInscription?: string;
    afipDocument?: string;
    address?: Address;
};

export type Address = {
    city?: string;
    street?: string;
    cp?: string;
    state?: string;
};
