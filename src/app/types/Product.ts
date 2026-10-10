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

/**
 * Paginación que devuelve GET /api/product (snake_case, distinta de la que usa
 * el listado de facturas en types/Invoice.ts).
 */
export type ProductPagination = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
};

/**
 * Modelo del formulario de alta/edición de producto.
 * `category` son los caminos que devuelve el cascader múltiple (number[][]) y
 * `price_list` son los ids de las listas de precios tildadas, no los objetos
 * que el listado devuelve en `lista_de_precios`.
 */
export type ProductForm = {
    id?: number;
    apply_discount: boolean;
    apply_discount_amount: number;
    apply_discount_percentage: number;
    category: number[][];
    code: string;
    cost: number;
    critical_stock: number;
    discount_amount: number;
    discount_percentage: number;
    iva: number;
    meters_by_unity: number;
    name: string;
    pictures: [];
    price_list: (number | string)[];
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
    /**
     * El listado devuelve los ids de las listas asignadas en `price_list` y el
     * detalle de cada una (con `sale_price`) en `lista_de_precios`.
     */
    price_list: (number | string)[];
    lista_de_precios?: ListProductPriceList[];
    /** Caminos de categorías tal como los devuelve el cascader múltiple. */
    category?: number[][];
    iva: ListProductIva;
};

/**
 * Producto tal como lo devuelve `GET /api/product` sin `list`: el catálogo entero
 * como array plano.
 *
 * Es lo que consume el buscador del modo mostrador: no se pagina y se filtra en
 * memoria, así que necesita el `code` (para poder tipear o escanear el código) y
 * las filas de cada lista de precios (`lista_de_precios`) para resolver el precio
 * de la lista que eligió la venta sin pedir nada más al servidor.
 *
 * La API histórica devuelve `iva` como objeto y `price_list` como ids, mientras
 * que los tipos de arriba describen `price_list` como ids y `iva` como objeto: de
 * ahí el `Omit`, que deja las dos formas declaradas en un solo tipo.
 */
export type PosProduct = Omit<Product, 'category' | 'iva'> & {
    id: number;
    active?: boolean;
    code?: string | null;
    cost?: number;
    category?: number[][] | CategoryRawData[] | null;
    iva?: ListProductIva | number | null;
    lista_de_precios?: ListProductPriceList[];
};
