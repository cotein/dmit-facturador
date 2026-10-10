<template>
    <PosPage class="pos-page">
        <!-- Lo primero que se ve y lo primero que se toca después de la venta:
             buscar otro cliente o dar de alta uno nuevo. Está en los dos modos. -->
        <PosCustomerActions />

        <!-- Los atajos principales a la vista: se descubren sin abrir nada -->
        <p class="pos-hotkeys" data-testid="pos-hotkeys">
            <span class="pos-hotkeys__label">Atajos</span>
            <span v-for="shortcut in POS_SHORTCUT_HINTS" :key="shortcut.id" class="pos-hotkeys__item">
                <kbd v-for="key in shortcut.keys" :key="key">{{ key }}</kbd>
                <span>{{ shortcut.hint }}</span>
            </span>
            <button
                type="button"
                class="pos-hotkeys__toggle"
                data-testid="pos-help-toggle"
                :aria-expanded="helpOpen"
                :aria-controls="helpPanelId"
                @click="togglePosHelp"
            >
                Ver toda la ayuda
            </button>
        </p>

        <div class="pos-grid">
            <div class="pos-main">
                <PosSearch />
                <PosCart />

                <!--
                    Modo normal: la vista previa del comprobante, la configuración completa
                    a la vista y las acciones sobre el papel. En mostrador no se pide el
                    slot, así que estos componentes no se montan.
                -->
                <template v-if="variant === 'normal'">
                    <slot name="document" />
                </template>
            </div>

            <aside class="pos-aside" aria-label="Panel de venta">
                <PosSalePanel :variant="variant" />
            </aside>
        </div>

        <!-- Barra fija de mobile: el total nunca queda fuera de pantalla -->
        <div class="pos-mobilebar" data-testid="pos-mobilebar">
            <span class="pos-mobilebar__summary">
                <b data-testid="pos-mobile-count">{{ lineCount }}</b>
                <span>{{ lineCount === 1 ? 'ítem' : 'ítems' }}</span>
                <span aria-hidden="true">·</span>
                <span class="pos-mobilebar__total" data-testid="pos-mobile-total">{{
                    formatCurrency(TotalComprobante)
                }}</span>
            </span>

            <a-button
                type="primary"
                :loading="loading"
                :disabled="!invoiceValidation.valid || loading"
                data-action="checkout-mobile"
                @click="checkout"
            >
                Facturar
            </a-button>
        </div>

        <!-- Lo que pasa en el mostrador, dicho en palabras: se sigue el flujo sin mirar -->
        <div class="pos-live" role="status" aria-live="polite" aria-atomic="true" data-testid="pos-live">
            <span v-if="announcement.text" :key="announcement.id">{{ announcement.text }}</span>
        </div>

        <!-- Ayuda de teclas: panel, no modal; el foco entra y vuelve solo -->
        <PosHelpPanel v-if="helpOpen" />
    </PosPage>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { PosPage } from '@/app/styles/posStyle';
import PosCart from './PosCart.vue';
import PosCustomerActions from './PosCustomerActions.vue';
import PosSalePanel from './PosSalePanel.vue';
import PosHelpPanel from './PosHelpPanel.vue';
import PosSearch from './PosSearch.vue';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { useInvoiceCheckoutComposable } from '@/app/composables/invoice/useInvoiceCheckoutComposable';
import { usePosCatalogComposable } from '@/app/composables/invoice/usePosCatalogComposable';
import { usePosSaleComposable } from '@/app/composables/invoice/usePosSaleComposable';
import { usePosShortcuts } from '@/app/composables/invoice/usePosShortcuts';
import { useVoucherStore } from '@/app/store/voucher/useVoucherStore';
import { useInvoiceStore } from '@/app/store/invoice/useInvoiceStore';
import type { PosVoucher } from '@/app/composables/invoice/usePosSaleComposable';

/**
 * Disposición de la pantalla de venta, compartida por los dos modos.
 *
 * A partir de `lg` son dos columnas: a la izquierda el buscador y las líneas del
 * ticket (con scroll propio si crecen), a la derecha el panel de venta de ancho
 * fijo con el total grande y el botón "Facturar" a mano. En mobile es una sola
 * columna y el total vive en una barra fija abajo.
 *
 * El modo se elige con `variant` y es sólo una diferencia de densidad: el mostrador
 * queda despojado —la configuración plegada en "Más opciones"— y el modo normal
 * suma, por el slot `document`, la vista previa del comprobante, la configuración
 * completa desplegada y las acciones sobre el comprobante. La mecánica —buscador
 * inline, ticket con cantidades, panel de venta y mapa de teclado— es la misma en
 * los dos y vive toda acá adentro.
 */
type Props = {
    /** `normal` agrega vista previa, configuración desplegada y acciones del comprobante. */
    variant?: 'mostrador' | 'normal';
};

withDefaults(defineProps<Props>(), {
    variant: 'mostrador',
});

const { CompanyGetter } = useCompanyComposable();
const { invoiceTableData, TotalComprobante, invoiceValidation } = useInvoiceComposable();
const { generateInvoice, loading } = useInvoiceCheckoutComposable();
const { load: loadCatalog } = usePosCatalogComposable();
const {
    POS_SHORTCUT_HINTS,
    announceBlockers,
    announceCheckoutOutcome,
    announcement,
    helpOpen,
    helpPanelId,
    installPosShortcuts,
    resetPosHelp,
    togglePosHelp,
} = usePosShortcuts();
const { loadPriceLists, pickDefaultVoucher, syncSalePriceList } = usePosSaleComposable();

const { Vouchers } = storeToRefs(useVoucherStore());
const { invoice, invoiceType } = storeToRefs(useInvoiceStore());

const lineCount = computed(() => invoiceTableData.value.length);

/**
 * Nunca se factura sin tipo de comprobante: si quedó vacío —o el comprobante
 * elegido ya no está entre los que la empresa puede emitir— se vuelve al que
 * corresponde por inscripción.
 */
const ensureDefaultVoucher = () => {
    const vouchers = (Vouchers.value ?? []) as unknown as PosVoucher[];

    if (vouchers.length === 0) {
        return;
    }

    const currentIsValid = vouchers.some(
        (voucher) => Number(voucher.id) === Number(invoice.value.voucher) && voucher.active !== false,
    );

    if (currentIsValid) {
        return;
    }

    const fallback = pickDefaultVoucher(vouchers, CompanyGetter.value?.inscription_id);

    if (fallback) {
        invoice.value.voucher = fallback.id;
        invoiceType.value = fallback.id;
    }
};

/**
 * El comprobante, el cliente y las fechas los resuelve `FormInvoice`, que está
 * montado en los dos modos. Acá sólo se cargan el catálogo y las listas de precios,
 * que son propios del mostrador.
 */
const bootstrap = async () => {
    const company = CompanyGetter.value;

    if (!company) {
        return;
    }

    await Promise.all([loadCatalog(company.id), loadPriceLists(company.id)]);
    syncSalePriceList();
    ensureDefaultVoucher();
};

watch(() => CompanyGetter.value, bootstrap, { deep: true, immediate: true });

// El drawer de cliente vacía la lista de comprobantes al abrirse (`cleanVouchers`):
// cuando vuelve a cargarse, el comprobante se restablece en vez de quedar en null.
watch(
    () => Vouchers.value,
    () => {
        ensureDefaultVoucher();
    },
    { deep: true },
);

const checkout = async () => {
    announceCheckoutOutcome(await generateInvoice());
};

/**
 * `F9`: factura directo, sin pedir confirmación.
 *
 * Si la venta no está lista no se emite nada: se dice —y se anuncia— exactamente qué
 * falta, con la misma lista que muestra el panel al lado del botón. Si está lista,
 * emite por el mismo camino que el botón (`generateInvoice`), así no hay dos lógicas
 * de facturación.
 */
const submitSale = async () => {
    if (loading.value) {
        return;
    }

    if (!invoiceValidation.value.valid) {
        announceBlockers(invoiceValidation.value.blockers);

        return;
    }

    await checkout();
};

/**
 * El listener global del mostrador se instala acá, una sola vez por pantalla, y se
 * quita al salir (también cuando se vuelve al modo normal, que desmonta este layout).
 */
let disposeShortcuts: (() => void) | null = null;

onMounted(() => {
    disposeShortcuts = installPosShortcuts({ submit: submitSale });
});

onUnmounted(() => {
    disposeShortcuts?.();
    disposeShortcuts = null;
    resetPosHelp();
});
</script>
