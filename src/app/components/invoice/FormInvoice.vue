<script setup lang="ts">
import { onUnmounted, watch, onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useDrawerPtoVtaStore } from '@/app/store/panels/useDrawerPtoVtaStore';
import { useFilterSearchByCustomerStore } from '@/app/store/filter-search/useFilterSearchByCustomerStore';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { useMostradorModeComposable } from '@/app/composables/invoice/useMostradorModeComposable';
import { useSaleConditionComposable } from '@/app/composables/sale-condition/useSaleConditionComposable';
import { usePaymentTypeComposable } from '@/app/composables/payment-type/usePaymentTypeComposable';
import { resetInlineOptions } from '@/app/composables/invoice/usePosInlineOptions';
import { usePosSaleComposable } from '@/app/composables/invoice/usePosSaleComposable';
import { useInvoiceBuilderComposable } from '@/app/composables/invoice/useInvoiceBuilderComposable';
import DrawerPtoVta from './DrawerPtoVta.vue';
import InvoiceConfig from './InvoiceConfig.vue';
import PosLayout from './pos/PosLayout.vue';
import PosModeSwitch from './PosModeSwitch.vue';
import PosInvoicePreview from './pos/PosInvoicePreview.vue';
import PosInvoiceSettings from './pos/PosInvoiceSettings.vue';
import PosInvoiceActions from './pos/PosInvoiceActions.vue';
import { PosPage } from '@/app/styles/posStyle';

/**
 * Pantalla de generación del comprobante de venta.
 *
 * Los dos modos comparten la mecánica —buscador inline, ticket con cantidades,
 * panel de venta con el total siempre visible y el mismo mapa de teclado— y viven
 * en el mismo layout (`PosLayout`). El modo es una diferencia de densidad:
 *
 * - mostrador: la pantalla del salón, la configuración plegada en "Más opciones".
 * - normal: lo mismo más la vista previa del comprobante, la configuración completa
 *   a la vista y las acciones sobre el papel (PDF, email, comentarios, MiPyme).
 *
 * Antes esto eran dos pantallas distintas: el modo normal tenía modal de búsqueda y
 * una tabla de ítems con su propia lógica de cantidades, precios y totales. Ahora
 * hay una sola y no hay dos caminos para la misma venta.
 */
const { CompanyGetter } = useCompanyComposable();
const { customer } = storeToRefs(useFilterSearchByCustomerStore());
const { fetchSaleConditions } = useSaleConditionComposable();
const { invoice, invoiceValidation, invoiceConfigIsValidated, invoiceInitialStatus, invoiceTableData } =
    useInvoiceComposable();
const { invoiceType } = useInvoiceBuilderComposable();
const { openDrawerPtoVta } = useDrawerPtoVtaStore();
const { fetchPaymentTypes } = usePaymentTypeComposable();
const { loadDefaultCustomer, loadVouchers, pickDefaultVoucher } = usePosSaleComposable();

/**
 * El modo vive en un composable compartido para que la tecla F12 (`NewInvoice`) y
 * este layout sepan lo mismo sin leer `localStorage` cada uno por su cuenta.
 */
const { mostradorMode } = useMostradorModeComposable();

/**
 * El botón "Facturar" se habilita con la venta, no con haber abierto y cerrado el
 * drawer "Datos del cliente". `invoiceConfigIsValidated` se mantiene en espejo
 * porque otros componentes (`DrawerInvoiceComments`) lo consultan.
 */
watch(
    invoiceValidation,
    (validation) => {
        invoiceConfigIsValidated.value = validation.valid;
    },
    { immediate: true },
);

/**
 * Estado inicial de la venta, en los dos modos: punto de venta, concepto y fecha
 * del comprobante, la lista de comprobantes que la empresa puede emitir, un tipo de
 * comprobante elegido —nunca vacío— y Consumidor Final como cliente.
 *
 * Con esto una venta se cierra sin abrir y cerrar el drawer de datos del cliente,
 * que era el paso escondido que trababa el botón "Facturar".
 */
const applyCompanyDefaults = async () => {
    const company = CompanyGetter.value;

    if (!company || invoice.value.PtoVta !== null) {
        return;
    }

    invoice.value.Concepto = String(company.billing_concept);
    invoice.value.company_id = company.id;
    invoice.value.PtoVta = Number(company.pto_vta_fe);
    invoice.value.CbteFch = dayjs().format('YYYYMMDD');

    const vouchers = await loadVouchers(company);
    const fallback = pickDefaultVoucher(vouchers, Number(company.inscription_id));

    if (fallback) {
        invoice.value.voucher = fallback.id;
        invoiceType.value = fallback.id;
    }

    if (!invoice.value.customer) {
        const consumer = await loadDefaultCustomer(company.id);

        if (consumer) {
            invoice.value.customer = consumer as never;
        }
    }
};

watch(
    () => CompanyGetter.value,
    (newValue) => {
        if (
            parseInt(newValue?.pto_vta_fe ?? '') === 0 ||
            newValue?.pto_vta_fe === undefined ||
            newValue?.pto_vta_fe === null
        ) {
            openDrawerPtoVta();
        }

        applyCompanyDefaults();
    },
    { deep: true, immediate: true },
);

onBeforeMount(() => {
    fetchPaymentTypes();
    fetchSaleConditions();
});

onUnmounted(() => {
    // El comprobante y el ticket son de esta pantalla: al salir se vacían, para que
    // la próxima venta no arranque con los ítems de la anterior. Antes lo hacía la
    // tabla del modo normal en su `onUnmounted`; ahora los dos modos se comportan
    // igual.
    invoiceInitialStatus();
    invoiceTableData.value = [];

    // La condición de venta y el modo de pago escritos a mano eran de esta venta: al
    // salir no quedan en la lista (el backend todavía no los guarda).
    resetInlineOptions();

    invoice.value.customer = null;
    customer.value = { value: null, label: '', cuit: null };
});
</script>

<template>
    <div class="scale-down" :class="{ 'mostrador-mode': mostradorMode }">
        <DrawerPtoVta />

        <!-- Cambiar de modo está disponible siempre, también desde el celular -->
        <PosPage class="pos-modebar-host">
            <PosModeSwitch />
        </PosPage>

        <!--
            La disposición es la misma en los dos modos. El mostrador no pide el slot
            `document`, así que la vista previa, la configuración desplegada y las
            acciones del comprobante no se montan ahí.
        -->
        <PosLayout :variant="mostradorMode ? 'mostrador' : 'normal'">
            <template #document>
                <PosInvoicePreview />
                <PosInvoiceSettings />
                <PosInvoiceActions />
            </template>
        </PosLayout>

        <!-- El drawer de datos del cliente (y la configuración del comprobante) vive en
             `InvoiceConfig`. En mostrador se monta acá —abajo de la venta, como estaba—
             y en modo normal lo monta `PosInvoiceSettings`, junto a los campos que
             explica: nunca hay dos drawers montados a la vez. -->
        <InvoiceConfig v-if="mostradorMode" />
    </div>
</template>
