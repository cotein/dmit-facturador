import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { getPriceList } from '@/api/priceList/price-list-api';
import { getVouchers } from '@/api/voucher/voucher-api';
import { getCustomers } from '@/api/customer/customer-api';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import { usePriceListStore } from '@/app/store/price-list/usePriceListStore';
import { useVoucherStore } from '@/app/store/voucher/useVoucherStore';
import { useInvoiceStore } from '@/app/store/invoice/useInvoiceStore';
import {
    findCatalogProduct,
    getCatalogIva,
    priceRowListId,
    productPriceRow,
    productPriceRows,
} from './usePosCatalogComposable';
import type { Company } from '@/app/types/Company';
import type { CustomerInvoice } from '@/app/types/Customer';
import type { PriceList } from '@/app/types/PriceList';
import type { ListProductPriceList, PosProduct, ProductOnInvoiceTable } from '@/app/types/Product';
import { AFIP_INSCRIPTION } from '@/app/types/Constantes';

/**
 * Estado de la venta de mostrador.
 *
 * Dos piezas del buscador del carrito necesitan lo mismo: el carrito necesita
 * saber con qué lista de precios armar cada línea nueva y el resultado de la
 * búsqueda necesita mostrar el precio de esa misma lista. El estado vive acá para
 * que ambos lean exactamente el mismo valor.
 */

/** Lista de precios de la venta: una sola para todos los ítems que se agreguen. */
const PRICE_LIST_STORAGE_KEY = 'posPriceListId';

const readStoredPriceListId = (): number | null => {
    try {
        const raw = localStorage.getItem(PRICE_LIST_STORAGE_KEY);
        const parsed = raw === null ? NaN : Number(raw);

        return Number.isFinite(parsed) ? parsed : null;
    } catch {
        return null;
    }
};

const persistPriceListId = (value: number | null) => {
    try {
        if (value === null) {
            localStorage.removeItem(PRICE_LIST_STORAGE_KEY);
            return;
        }

        localStorage.setItem(PRICE_LIST_STORAGE_KEY, String(value));
    } catch {
        /* sin persistencia la venta sigue funcionando con la lista en memoria */
    }
};

const salePriceListId = ref<number | null>(readStoredPriceListId());

const priceLists = ref<PriceList[]>([]);
const priceListsStatus = ref<'idle' | 'loading' | 'ready' | 'error'>('idle');
const priceListsError = ref('');

/**
 * Contador para la `key` de cada línea.
 *
 * `insertProductOnInvoiceTable` fusiona por producto + precio unitario, así que la
 * misma combinación nunca genera dos líneas; sumarle un contador garantiza que la
 * clave siga siendo única aunque más adelante se cambie la lista de precios de una
 * línea y coincida con la de otra.
 */
let lineSequence = 0;

const round2 = (value: number): number => Math.round(value * 100) / 100;

export type PosVoucher = {
    id: number;
    name: string;
    afip_code?: number;
    letter?: string;
    active?: boolean;
};

/** El comprobante que la empresa puede emitir con un receptor dado. */
export const pickDefaultVoucher = (
    vouchers: PosVoucher[],
    companyInscriptionId: number | undefined,
): PosVoucher | null => {
    const active = vouchers.filter((voucher) => voucher.active !== false);

    if (active.length === 0) {
        return null;
    }

    // Monotributista emite C; responsable inscripto y exento emiten B a consumidor
    // final. El "Factura B" literal es el último recurso pedido por el negocio.
    const letter = Number(companyInscriptionId) === AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO ? 'C' : 'B';

    const byLetter = active.find((voucher) => String(voucher.letter ?? '').toUpperCase() === letter);

    if (byLetter) {
        return byLetter;
    }

    const byName = active.find((voucher) =>
        String(voucher.name ?? '')
            .toUpperCase()
            .includes(`FACTURA ${letter}`),
    );

    return byName ?? active[0];
};

/** Normaliza el cliente que devuelve la API al shape que espera el comprobante. */
const toCustomerInvoice = (raw: any): CustomerInvoice => ({
    value: Number(raw?.id ?? 1),
    label: raw?.label ?? `${raw?.name ?? 'Consumidor'} ${raw?.lastName ?? 'Final'}`.trim(),
    cuit: Number(raw?.cuit ?? 0),
    afip_inscription: raw?.afip_inscription ?? {
        id: Number(raw?.inscription_id ?? AFIP_INSCRIPTION.CONSUMIDOR_FINAL),
        name: raw?.inscription ?? 'Consumidor Final',
    },
    afip_document: raw?.afip_document ?? { id: 99, name: 'DNI', afip_code: '99' },
});

/** Recalcula neto, IVA y total de una línea con la misma fórmula del store. */
export const recalcLine = (line: ProductOnInvoiceTable): void => {
    const subtotal = round2(Number(line.unit) * Number(line.quantity));

    line.subtotal = subtotal;
    line.iva_import = round2(((subtotal - Number(line.discount || 0)) * Number(line.iva.percentage)) / 100);
    line.total = round2(subtotal + line.iva_import - Number(line.discount || 0));
};

export const usePosSaleComposable = () => {
    const priceListStore = usePriceListStore();
    const { PriceListGetter } = storeToRefs(priceListStore);
    const { setPriceList } = priceListStore;
    const { setVouchers } = useVoucherStore();
    const { invoice, invoiceTableData } = storeToRefs(useInvoiceStore());

    const activePriceLists = computed<PriceList[]>(() =>
        (PriceListGetter.value ?? []).filter((list: PriceList) => list.active !== false && list.id != null),
    );

    const salePriceList = computed<PriceList | null>(
        () => activePriceLists.value.find((list: PriceList) => Number(list.id) === salePriceListId.value) ?? null,
    );

    /** Deja la lista de la venta en una lista activa real (la última usada o la primera). */
    const syncSalePriceList = () => {
        const actives = activePriceLists.value;

        if (actives.length === 0) {
            return;
        }

        const stillValid = actives.some((list: PriceList) => Number(list.id) === salePriceListId.value);

        if (!stillValid) {
            salePriceListId.value = Number(actives[0].id);
            persistPriceListId(salePriceListId.value);
        }
    };

    const selectSalePriceList = (value: number) => {
        salePriceListId.value = Number(value);
        persistPriceListId(salePriceListId.value);
    };

    const loadPriceLists = async (companyId: number | undefined): Promise<void> => {
        if (!companyId || priceListsStatus.value === 'loading' || priceListsStatus.value === 'ready') {
            return;
        }

        priceListsStatus.value = 'loading';
        priceListsError.value = '';

        try {
            const { data } = await getPriceList(companyId);

            priceLists.value = data ?? [];
            setPriceList(data ?? []);
            syncSalePriceList();
            priceListsStatus.value = 'ready';
        } catch (e) {
            priceListsStatus.value = 'error';
            priceListsError.value =
                e instanceof Error && e.message
                    ? `No pudimos cargar las listas de precios: ${e.message}`
                    : 'No pudimos cargar las listas de precios.';
        }
    };

    const loadVouchers = async (
        company: Company | undefined,
        customerInscriptionId?: number,
    ): Promise<PosVoucher[]> => {
        if (!company) {
            return [];
        }

        try {
            const vouchers = ((await getVouchers(Number(company.inscription_id), customerInscriptionId ?? null)) ??
                []) as unknown as PosVoucher[];

            setVouchers(vouchers);

            return vouchers;
        } catch (e) {
            console.log('🚀 ~ usePosSaleComposable ~ loadVouchers:', e);
            return [];
        }
    };

    /** Consumidor Final (id 1) por defecto: una venta de mostrador se cierra sin pasos extra. */
    const loadDefaultCustomer = async (companyId: number | undefined): Promise<CustomerInvoice | null> => {
        if (!companyId) {
            return null;
        }

        try {
            const { data } = await getCustomers(companyId, 'Consumidor');

            const consumer = (data ?? []).find((customer: any) => Number(customer.id) === 1) ?? (data ?? [])[0];

            return consumer ? toCustomerInvoice(consumer) : null;
        } catch (e) {
            console.log('🚀 ~ usePosSaleComposable ~ loadDefaultCustomer:', e);
            return null;
        }
    };

    /** Arma la línea del comprobante con el precio de la lista de la venta. */
    const buildInvoiceLine = (product: PosProduct): ProductOnInvoiceTable | null => {
        const rows = productPriceRows(product);
        const row: ListProductPriceList | undefined = productPriceRow(product, salePriceListId.value) ?? rows[0];

        if (!row) {
            return null;
        }

        const unit = Number(row.sale_price);

        const line: ProductOnInvoiceTable = {
            key: `${product.id}-${priceRowListId(row)}-${++lineSequence}`,
            row: String(product.id),
            product: { id: Number(product.id), name: product.name },
            unit,
            price_base: unit,
            quantity: 1,
            iva: getCatalogIva(product),
            iva_import: 0,
            discount: 0,
            subtotal: 0,
            total: 0,
            actions: {},
            priceList: row,
            aditional: { percentage: 0, value: 0 },
        };

        recalcLine(line);

        return line;
    };

    /**
     * Listas de precio disponibles para una línea concreta: las que el producto tiene
     * cargadas y que además están activas para la empresa. Si todavía no se cargaron
     * las listas se ofrecen todas las del producto, para no dejar el select vacío.
     */
    const linePriceListOptions = (line: ProductOnInvoiceTable) => {
        const product = findCatalogProduct(line.product.id);
        const rows = productPriceRows(product);
        const actives = activePriceLists.value.map((list) => Number(list.id));
        const available = actives.length > 0 ? rows.filter((row) => actives.includes(priceRowListId(row))) : rows;

        return available.map((row) => ({
            value: priceRowListId(row),
            label: `${row.name} · ${formatCurrency(Number(row.sale_price))}`,
        }));
    };

    /**
     * Cambia la lista de precios de UNA línea sin abrir ningún modal: actualiza el
     * precio unitario y deja que el store recalcule subtotal, IVA y total.
     */
    const setLinePriceList = (index: number, priceListId: number): boolean => {
        const line = invoiceTableData.value[index];

        if (!line) {
            return false;
        }

        const product = findCatalogProduct(line.product.id);
        const row = productPriceRows(product).find((candidate) => priceRowListId(candidate) === Number(priceListId));

        if (!row) {
            return false;
        }

        line.priceList = row;
        line.unit = Number(row.sale_price);
        line.price_base = Number(row.sale_price);
        recalcLine(line);

        return true;
    };

    const priceForProduct = (product: PosProduct): number | null => {
        const row = productPriceRow(product, salePriceListId.value);

        return row ? Number(row.sale_price) : null;
    };

    return {
        activePriceLists,
        buildInvoiceLine,
        invoice,
        invoiceTableData,
        linePriceListOptions,
        loadDefaultCustomer,
        loadPriceLists,
        loadVouchers,
        pickDefaultVoucher,
        priceListsError,
        priceListsStatus,
        priceForProduct,
        salePriceList,
        salePriceListId,
        selectSalePriceList,
        setLinePriceList,
        syncSalePriceList,
    };
};
