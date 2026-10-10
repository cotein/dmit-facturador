import { AFIP_IVAS } from '@/app/types/Constantes';
import type { ListProductItem, ProductForm } from '@/app/types/Product';

/**
 * El listado de productos devuelve algunos campos que no están declarados en
 * `ListProductItem` (costo y cantidad) pero que la API sí manda; los leemos de
 * forma explícita y opcional para no inventar valores.
 */
export type ListProductItemWithCost = ListProductItem & {
    cost?: number | null;
    quantity?: number | null;
    priority?: number | null;
};

export const emptyProduct = (): ProductForm => ({
    apply_discount: false,
    apply_discount_amount: 0,
    apply_discount_percentage: 0,
    category: [],
    code: '',
    cost: 0,
    critical_stock: 1,
    discount_amount: 0,
    discount_percentage: 0,
    iva: AFIP_IVAS.AFIP_ID_VEINTI_UNO,
    meters_by_unity: 0,
    name: '',
    pictures: [],
    price_list: [],
    priority: 10,
    published_here: false,
    quantity: 1,
    sale_by_meter: false,
    view_price: false,
});

/**
 * El cascader múltiple trabaja con caminos (number[][]) y la API puede devolver
 * caminos o ids sueltos según el producto. Normalizamos siempre a caminos.
 */
export const normalizeCategoryPaths = (category: unknown): number[][] => {
    if (!Array.isArray(category)) {
        return [];
    }

    return category
        .map((entry) => (Array.isArray(entry) ? entry.map(Number) : [Number(entry)]))
        .filter((path) => path.length > 0 && path.every((id) => Number.isFinite(id)));
};

/** Precio de venta de una lista = costo + el porcentaje de ganancia de esa lista. */
export const salePriceFor = (cost: number, profitPercentage: number): number => {
    const base = Number(cost) || 0;
    const profit = Number(profitPercentage) || 0;

    return Math.round(base * (1 + profit / 100) * 100) / 100;
};

/** Convierte un ítem del listado en el modelo del formulario de edición. */
export const toProductForm = (item: ListProductItemWithCost): ProductForm => ({
    ...emptyProduct(),
    id: item.id,
    name: item.name ?? '',
    code: item.code ?? '',
    category: normalizeCategoryPaths(item.category),
    cost: Number(item.cost ?? item.lista_de_precios?.[0]?.cost ?? 0),
    quantity: Number(item.quantity ?? 0),
    critical_stock: Number(item.critical_stock ?? 0),
    iva: Number(item.iva_id ?? 0) || AFIP_IVAS.AFIP_ID_VEINTI_UNO,
    price_list: (item.price_list ?? []).map((id) => Number(id)),
    apply_discount: Boolean(item.apply_discount),
    apply_discount_amount: Number(item.apply_discount_amount ?? 0),
    apply_discount_percentage: Number(item.apply_discount_percentage ?? 0),
    published_here: Boolean(item.published_here),
    view_price: Boolean(item.see_price_on_the_web),
});
