import { inject, ref, type InjectionKey, type Ref } from 'vue';
import type { Category } from '@/app/types/Category';
import type { ListProductItem } from '@/app/types/Product';

/**
 * Estado de la barra de herramientas del listado de productos.
 * Vive en Products.vue (la vista padre) y lo consumen las vistas hijas
 * grilla/listado a través de provide/inject, así el filtro no se duplica.
 */
export type ProductFilters = {
    search: Ref<string>;
    categoryId: Ref<number | undefined>;
};

export const PRODUCT_FILTERS_KEY: InjectionKey<ProductFilters> = Symbol('product-filters');

export const useProductFilters = (): ProductFilters =>
    inject(PRODUCT_FILTERS_KEY, { search: ref(''), categoryId: ref(undefined) });

const searchable = (product: ListProductItem) => `${product.name ?? ''} ${product.code ?? ''}`.toLowerCase().trim();

const categoryIdsOf = (product: ListProductItem): number[] => {
    const category = product.category;

    if (!Array.isArray(category)) {
        return [];
    }

    return category.flatMap((entry) => (Array.isArray(entry) ? entry : [entry])).map(Number);
};

const findCategory = (tree: Category[], id: number): Category | undefined => {
    for (const node of tree) {
        if (Number(node.id) === id) {
            return node;
        }

        const found = findCategory(node.children ?? [], id);

        if (found) {
            return found;
        }
    }

    return undefined;
};

/**
 * Ids que cuentan al filtrar por una categoría: la elegida y todas sus
 * subcategorías, porque un producto puede estar cargado en la hoja.
 */
export const collectCategoryIds = (tree: Category[], rootId: number): number[] => {
    const node = findCategory(tree, rootId);

    if (!node) {
        return [rootId];
    }

    const ids: number[] = [];
    const walk = (current: Category) => {
        ids.push(Number(current.id));
        (current.children ?? []).forEach(walk);
    };

    walk(node);

    return ids;
};

/** Filtra en el cliente sobre los productos ya traídos del listado. */
export const filterProducts = (
    products: ListProductItem[],
    search: string,
    categoryIds: number[] | undefined,
): ListProductItem[] => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
        const matchesTerm = term === '' || searchable(product).includes(term);
        const matchesCategory =
            !categoryIds || categoryIds.length === 0 || categoryIdsOf(product).some((id) => categoryIds.includes(id));

        return matchesTerm && matchesCategory;
    });
};
