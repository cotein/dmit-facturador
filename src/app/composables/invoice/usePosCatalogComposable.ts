import { computed, ref } from 'vue';
import { getCategories } from '@/api/category/category-api';
import { getProducts } from '@/api/product/product-api';
import { apiAfipGetIvas } from '@/api/afip/afip-iva';
import type { AfipIva } from '@/app/types/Afip';
import type { CategoryRawData } from '@/app/types/Category';
import type { ListProductIva, ListProductPriceList, PosProduct } from '@/app/types/Product';

/**
 * Buscador de productos del modo mostrador.
 *
 * El catálogo se trae UNA vez (`GET /api/product` sin `list` devuelve el array
 * plano completo) y se filtra en memoria por nombre y por **código**, que es lo
 * que se tipea o se escanea. No hay request por tecla.
 *
 * Si el catálogo supera `POS_CATALOG_MEMORY_LIMIT` productos se usa el camino de
 * servidor que ya existía (`GET /api/product?name=…`) con debounce, para no
 * congelar el navegador filtrando decenas de miles de filas en cada tecla.
 */

/** A partir de este tamaño de catálogo se filtra en el servidor. */
export const POS_CATALOG_MEMORY_LIMIT = 2000;

/** Resultados que se muestran en el desplegable del buscador. */
export const POS_SEARCH_LIMIT = 12;

/** Espera antes de consultar al servidor cuando el catálogo no entra en memoria. */
export const POS_SERVER_SEARCH_DEBOUNCE_MS = 250;

const DEFAULT_IVA: ListProductIva = { id: 3, name: '21%', percentage: 21, afip_code: 5 };

/* ------------------------------------------------------------------ helpers */

/** Minúsculas sin acentos: "café" tiene que matchear con "cafe". */
export const normalizeSearchText = (value: unknown): string =>
    String(value ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

/**
 * Filas de precio del producto.
 *
 * La API las expone como `lista_de_precios` (el listado) y algunos endpoints
 * viejos devuelven los objetos directamente en `price_list`. Se aceptan las dos.
 */
export const productPriceRows = (product: PosProduct | undefined | null): ListProductPriceList[] => {
    if (!product) {
        return [];
    }

    const lista = product.lista_de_precios;

    if (Array.isArray(lista) && lista.length > 0) {
        return lista;
    }

    const priceList = product.price_list as unknown;

    if (Array.isArray(priceList)) {
        const rows = priceList.filter(
            (row): row is ListProductPriceList => typeof row === 'object' && row !== null && 'sale_price' in row,
        );

        if (rows.length > 0) {
            return rows;
        }
    }

    return [];
};

/** Id de lista de precios de una fila, contemplando `pricelist_id` y `id`. */
export const priceRowListId = (row: ListProductPriceList): number => Number(row.pricelist_id ?? row.id);

/** Fila de precio del producto para una lista concreta, o `undefined` si no la tiene. */
export const productPriceRow = (
    product: PosProduct | undefined | null,
    priceListId: number | null | undefined,
): ListProductPriceList | undefined => {
    const rows = productPriceRows(product);

    if (priceListId === null || priceListId === undefined) {
        return rows[0];
    }

    return rows.find((row) => priceRowListId(row) === Number(priceListId));
};

/** Ids de categoría del producto, vengan como `[[id]]` o como objetos. */
export const productCategoryIds = (product: PosProduct | undefined | null): number[] => {
    const category = product?.category as unknown;

    if (!Array.isArray(category)) {
        return [];
    }

    return category
        .map((entry) => {
            if (Array.isArray(entry)) {
                return Number(entry[entry.length - 1]);
            }

            if (entry && typeof entry === 'object' && 'id' in entry) {
                return Number((entry as CategoryRawData).id);
            }

            return Number(entry);
        })
        .filter((id) => Number.isFinite(id) && id > 0);
};

/** Nombres de categoría legibles para mostrar en el resultado. */
export const productCategoryNames = (
    product: PosProduct | undefined | null,
    categoriesById: Map<number, string>,
): string[] =>
    productCategoryIds(product)
        .map((id) => categoriesById.get(id))
        .filter((name): name is string => Boolean(name));

/** Normaliza el IVA del producto (objeto en el listado, id en el modelo viejo). */
export const resolveProductIva = (product: PosProduct | undefined | null, ivas: AfipIva[]): ListProductIva => {
    const iva = product?.iva;

    if (iva && typeof iva === 'object' && 'percentage' in iva) {
        return iva;
    }

    if (typeof iva === 'number') {
        const match = ivas.find((row) => Number(row.value) === iva);

        if (match) {
            return {
                id: Number(match.value),
                name: match.label,
                percentage: Number(String(match.label).replace(',', '.')) || 0,
                afip_code: Number(match.code),
            };
        }
    }

    return { ...DEFAULT_IVA };
};

type Match = { product: PosProduct; rank: number };

/**
 * Puntúa un producto contra la búsqueda. Menor rank = más arriba.
 *
 * El código exacto gana siempre: es el caso del lector de barras, que escribe el
 * código completo y no quiere que un producto con el mismo texto adentro del
 * nombre se le adelante.
 */
export const scoreProduct = (product: PosProduct, query: string): number | null => {
    if (query === '') {
        return null;
    }

    const name = normalizeSearchText(product.name);
    const code = normalizeSearchText(product.code);

    if (code !== '' && code === query) {
        return 0;
    }

    if (code !== '' && code.startsWith(query)) {
        return 1;
    }

    if (name.startsWith(query)) {
        return 2;
    }

    if (code !== '' && code.includes(query)) {
        return 3;
    }

    if (name.includes(query)) {
        return 4;
    }

    if (name.split(/\s+/).some((word) => word.startsWith(query))) {
        return 5;
    }

    return null;
};

/** Filtra y ordena el catálogo en memoria. Devuelve como máximo `limit` filas. */
export const filterCatalog = (
    catalog: PosProduct[],
    rawQuery: string,
    limit: number = POS_SEARCH_LIMIT,
): PosProduct[] => {
    const query = normalizeSearchText(rawQuery);

    if (query === '') {
        return [];
    }

    const matches: Match[] = [];

    for (const product of catalog) {
        const rank = scoreProduct(product, query);

        if (rank !== null) {
            matches.push({ product, rank });
        }
    }

    matches.sort((a, b) => a.rank - b.rank || String(a.product.name).localeCompare(String(b.product.name), 'es'));

    return matches.slice(0, limit).map((match) => match.product);
};

/* --------------------------------------------------------------- estado compartido */

/**
 * El catálogo es uno por sesión de navegador: lo comparten el buscador y el
 * carrito (que necesita las filas de precio del producto para cambiar la lista de
 * una línea). Se guarda a nivel de módulo para no volver a pedirlo en cada montaje.
 */
const catalog = ref<PosProduct[]>([]);
const categoriesById = ref<Map<number, string>>(new Map());
const ivas = ref<AfipIva[]>([]);

let loadPromise: Promise<void> | null = null;

export const getCatalogProducts = (): PosProduct[] => catalog.value;

/** Producto del catálogo por id, para resolver sus listas de precio en el carrito. */
export const findCatalogProduct = (productId: number): PosProduct | undefined =>
    catalog.value.find((product) => Number(product.id) === Number(productId));

/** IVA del producto resuelto contra los IVAs que ya bajó el buscador. */
export const getCatalogIva = (product: PosProduct | undefined | null): ListProductIva =>
    resolveProductIva(product, ivas.value);

const loadCategories = async (companyId: number): Promise<Map<number, string>> => {
    const { data } = await getCategories(companyId, 0);
    const map = new Map<number, string>();

    (data ?? []).forEach((category) => map.set(Number(category.id), category.name));

    return map;
};

const loadIvas = async (): Promise<AfipIva[]> => {
    try {
        return (await apiAfipGetIvas()) ?? [];
    } catch {
        /* sin IVAs del servidor se usa el IVA que trae cada producto */
        return [];
    }
};

export const usePosCatalogComposable = () => {
    const query = ref('');
    const results = ref<PosProduct[]>([]);
    const status = ref<'idle' | 'loading' | 'ready' | 'error'>('idle');
    const error = ref('');
    const serverQuery = ref('');
    const serverStatus = ref<'idle' | 'loading' | 'error'>('idle');
    const serverError = ref('');

    const usesServerSearch = computed(
        () => status.value === 'ready' && catalog.value.length > POS_CATALOG_MEMORY_LIMIT,
    );

    const isLoading = computed(() => status.value === 'loading' || serverStatus.value === 'loading');

    const errorMessage = computed(() => error.value || serverError.value);

    /** Trae el catálogo y las categorías una sola vez por sesión. */
    const load = async (companyId: number | undefined): Promise<void> => {
        if (!companyId) {
            return;
        }

        if (loadPromise) {
            return loadPromise;
        }

        status.value = 'loading';
        error.value = '';

        loadPromise = (async () => {
            try {
                const [productsResponse, categoryMap, ivaList] = await Promise.all([
                    getProducts(companyId),
                    loadCategories(companyId),
                    loadIvas(),
                ]);

                catalog.value = (productsResponse?.data ?? []) as unknown as PosProduct[];
                categoriesById.value = categoryMap;
                ivas.value = ivaList;
                status.value = 'ready';
            } catch (e) {
                loadPromise = null;
                status.value = 'error';
                error.value =
                    e instanceof Error && e.message
                        ? `No pudimos cargar el catálogo: ${e.message}`
                        : 'No pudimos cargar el catálogo de productos.';
            }
        })();

        return loadPromise;
    };

    const retry = async (companyId: number | undefined): Promise<void> => {
        loadPromise = null;
        status.value = 'idle';
        await load(companyId);
        runSearch(query.value, companyId);
    };

    let serverTimer: ReturnType<typeof setTimeout> | null = null;

    const runServerSearch = (value: string, companyId: number | undefined) => {
        if (serverTimer) {
            clearTimeout(serverTimer);
        }

        if (!companyId || value.trim() === '') {
            results.value = [];
            serverStatus.value = 'idle';
            serverError.value = '';
            return;
        }

        serverStatus.value = 'loading';

        serverTimer = setTimeout(async () => {
            try {
                const response = await getProducts(companyId, value);
                const rows = (response?.data ?? []) as unknown as PosProduct[];

                serverQuery.value = value;
                results.value = filterCatalog(rows, value, POS_SEARCH_LIMIT);
                serverStatus.value = 'idle';
                serverError.value = '';
            } catch (e) {
                serverStatus.value = 'error';
                results.value = [];
                serverError.value =
                    e instanceof Error && e.message
                        ? `No pudimos buscar en el servidor: ${e.message}`
                        : 'No pudimos buscar en el servidor.';
            }
        }, POS_SERVER_SEARCH_DEBOUNCE_MS);
    };

    /** Punto de entrada único: decide si filtra en memoria o consulta al servidor. */
    const runSearch = (value: string, companyId: number | undefined) => {
        query.value = value;

        if (usesServerSearch.value) {
            runServerSearch(value, companyId);
            return;
        }

        results.value = filterCatalog(catalog.value, value, POS_SEARCH_LIMIT);
    };

    const clear = () => {
        query.value = '';
        serverQuery.value = '';
        results.value = [];
        serverStatus.value = 'idle';
        serverError.value = '';

        if (serverTimer) {
            clearTimeout(serverTimer);
            serverTimer = null;
        }
    };

    const dispose = () => {
        if (serverTimer) {
            clearTimeout(serverTimer);
            serverTimer = null;
        }
    };

    const categoryNamesFor = (product: PosProduct): string[] => productCategoryNames(product, categoriesById.value);

    return {
        catalog,
        categoryNamesFor,
        clear,
        dispose,
        errorMessage,
        isLoading,
        load,
        productIva: (product: PosProduct) => resolveProductIva(product, ivas.value),
        query,
        results,
        retry,
        runSearch,
        status,
        usesServerSearch,
    };
};
