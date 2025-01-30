import type { CategoryRawData } from './Category';
import type { PriceListFromDataBase } from './PriceList';

export type Product = {
    apply_discount: boolean;
    apply_discount_amount: number;
    apply_discount_percentage: number;
    category: CategoryRawData[] | [];
    cost: number;
    code: string;
    critical_stock: number;
    discount_amount: number;
    discount_percentage: number;
    iva: number;
    meters_by_unity: number;
    name: string;
    pictures: [];
    price_list: PriceListFromDataBase[];
    priority: number;
    published_here: boolean;
    quantity: number;
    sale_by_meter: boolean;
    view_price: boolean;
};

export type ProductOnInvoiceTable = {
    key: string;
    row: string;
    product: {
        id: number;
        name: string;
    };
    unit: number;
    price_base: number;
    quantity: number;
    iva: {
        id: number;
        name: string;
        percentage: number;
        afip_code: number;
    };
    iva_import: number;
    discount: number;
    subtotal: number;
    total: number;
    actions: {};
    priceList: PriceListFromDataBase | undefined;
    aditional: {
        percentage: number;
        value: number;
    };
    comeFrom?: string;
    percep_iibb_alicuota?: number;
    percep_iibb_import?: number;
    percep_iva_alicuota?: number;
    percep_iva_import?: number;
};

export type ProductTransformer = {
    id: number;
    name: string;
    price_list: PriceListFromDataBase[] | [];
    iva: {
        id: number;
        name: string;
        percentage: number;
        afip_code: number;
    };
    aditional: {
        percentage: number;
        value: number;
    };
};

export type ProductForNotaCredito = {
    id: number;
    key: number;
    name: string;
    quantity: number;
    neto_import: number;
    iva_import: number;
    iva_id: number;
    iva_afip_code: string;
    unit_price: number;
    total: number;
    percep_iibb_alicuota?: number;
    percep_iibb_import?: number;
    percep_iva_alicuota?: number;
    percep_iva_import?: number;
};

export type ListProductPriceList = {
    id: number;
    name: string;
    pricelist_id: number;
    cost: number;
    profit_percentage: number;
    profit_rate: number;
    sale_price: number;
};

export type ListProductIva = {
    id: number;
    name: string;
    percentage: number;
    afip_code: number;
};

export type ListProductItem = {
    id: number;
    meli_id: string | null;
    company_id: number;
    name: string;
    code: string | null;
    sub_title: string | null;
    description: string | null;
    iva_id: number | null;
    money_id: number | null;
    priority_id: number | null;
    published_meli: boolean | null;
    published_here: boolean | null;
    active: boolean;
    slug: string | null;
    critical_stock: number | null;
    sale_by_meters: boolean | null;
    mts_by_unity: number | null;
    apply_discount: boolean | null;
    apply_discount_amount: number;
    apply_discount_percentage: number;
    see_price_on_the_web: boolean | null;
    price_list: ListProductPriceList[];
    iva: ListProductIva;
};
