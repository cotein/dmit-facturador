<template>
    <div class="pos-surface pos-panel" data-testid="pos-panel">
        <!-- Lo que se toca en cada venta, a la vista y a un clic -->
        <div class="pos-panel__section" data-zone="voucher">
            <label class="pos-panel__label" for="pos-voucher">Tipo de comprobante</label>
            <a-select
                id="pos-voucher"
                :value="invoice.voucher ?? undefined"
                :options="voucherOptions"
                :field-names="{ label: 'name', value: 'id' }"
                style="width: 100%"
                data-testid="pos-voucher"
                placeholder="Elegí el comprobante"
                @change="onVoucherChange"
            />
        </div>

        <div class="pos-panel__section" data-zone="customer">
            <span class="pos-panel__label">Cliente</span>
            <div class="pos-panel__customer">
                <span class="pos-panel__customer-name" data-testid="pos-customer">{{ customerLabel }}</span>
                <a-button size="small" data-action="change-customer" @click="openDrawerDatosCliente = true">
                    Cambiar
                </a-button>
            </div>
        </div>

        <div class="pos-panel__section" data-zone="price-list">
            <label class="pos-panel__label" for="pos-sale-price-list">Lista de precios de la venta</label>
            <a-select
                id="pos-sale-price-list"
                :value="salePriceListId ?? undefined"
                :options="priceListOptions"
                style="width: 100%"
                data-testid="pos-price-list"
                :loading="priceListsStatus === 'loading'"
                placeholder="Elegí la lista"
                @change="onSalePriceListChange"
            />
            <p v-if="priceListsError" class="pos-alert pos-alert--error" data-testid="pos-pricelist-error">
                {{ priceListsError }}
            </p>
        </div>

        <div class="pos-panel__section">
            <ul class="pos-panel__rows">
                <li>
                    <span>Cantidad de ítems</span>
                    <b data-testid="pos-item-count">{{ lineCount }}</b>
                </li>
                <li>
                    <span>Subtotal</span>
                    <b data-testid="pos-subtotal">{{ formatCurrency(Subtotal) }}</b>
                </li>
                <li v-if="Discount > 0">
                    <span>Descuentos</span>
                    <b data-testid="pos-discount">{{ formatCurrency(Discount) }}</b>
                </li>
                <li>
                    <span>IVA</span>
                    <b data-testid="pos-iva">{{ formatCurrency(IVA) }}</b>
                </li>
                <li v-if="PercepIVATresPorciento > 0">
                    <span>Percep. IVA 3%</span>
                    <b data-testid="pos-percep-iva">{{ formatCurrency(PercepIVATresPorciento) }}</b>
                </li>
                <li v-if="PercepIVAUnoComaCinco > 0">
                    <span>Percep. IVA 1,5%</span>
                    <b data-testid="pos-percep-iva-min">{{ formatCurrency(PercepIVAUnoComaCinco) }}</b>
                </li>
                <li v-if="CompanyGetter?.perception_iibb && PercepIIBB > 0">
                    <span>Percep. IIBB {{ alicuotaPercepcion }} %</span>
                    <b data-testid="pos-percep-iibb">{{ formatCurrency(PercepIIBB) }}</b>
                </li>
            </ul>

            <div class="pos-panel__total">
                <span class="pos-panel__total-label">Total</span>
                <span class="pos-panel__total-amount" data-testid="pos-total">{{
                    formatCurrency(TotalComprobante)
                }}</span>
            </div>
        </div>

        <div class="pos-panel__action" data-zone="checkout">
            <a-button
                type="primary"
                size="large"
                :loading="loading"
                :disabled="!invoiceValidation.valid || loading"
                data-action="checkout-desktop"
                @click="checkout"
            >
                Facturar
            </a-button>
        </div>

        <!-- Lo que falta se dice acá, al lado del botón, y no en un tooltip escondido -->
        <div v-if="!invoiceValidation.valid" class="pos-alert" data-testid="pos-blockers">
            <div class="pos-alert__title">Para facturar falta:</div>
            <ul>
                <li v-for="blocker in invoiceValidation.blockers" :key="blocker">{{ blocker }}</li>
            </ul>
        </div>

        <div v-if="checkoutError" class="pos-alert pos-alert--error" data-testid="pos-checkout-error">
            <div class="pos-alert__title">No se pudo facturar</div>
            <p>{{ checkoutError }}</p>
        </div>

        <!-- En el modo normal la configuración está desplegada en la columna
             principal: acá no se repite, para no tener dos controles para el
             mismo campo. -->
        <div v-if="variant === 'mostrador'" class="pos-panel__section">
            <PosMoreOptions />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import { SELECT_INVOICE_TYPE } from '@/app/types/Constantes';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { useInvoiceCheckoutComposable } from '@/app/composables/invoice/useInvoiceCheckoutComposable';
import { usePosSaleComposable } from '@/app/composables/invoice/usePosSaleComposable';
import { useVoucherStore } from '@/app/store/voucher/useVoucherStore';
import { useInvoiceStore } from '@/app/store/invoice/useInvoiceStore';
import { useVisibleComposable } from '@/app/composables/visible/useVisibleComposable';
import { usePosShortcuts } from '@/app/composables/invoice/usePosShortcuts';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useArbaComposable } from '@/app/composables/arba/useArbaComposable';
import PosMoreOptions from './PosMoreOptions.vue';
import type { PosVoucher } from '@/app/composables/invoice/usePosSaleComposable';

/**
 * Panel de venta del mostrador.
 *
 * Concentra lo único que se toca en cada venta —comprobante y cliente— y el total
 * grande siempre visible, con el botón "Facturar" al lado. Todo lo demás vive en
 * "Más opciones", cerrado por defecto y con los valores ya puestos.
 *
 * Es el mismo panel en los dos modos: `variant="normal"` sólo esconde "Más
 * opciones", porque ahí la configuración está desplegada en la columna principal.
 */
type Props = {
    variant?: 'mostrador' | 'normal';
};

withDefaults(defineProps<Props>(), {
    variant: 'mostrador',
});

const {
    invoiceTableData,
    Subtotal,
    Discount,
    IVA,
    TotalComprobante,
    invoiceValidation,
    PercepIVATresPorciento,
    PercepIVAUnoComaCinco,
    PercepIIBB,
} = useInvoiceComposable();
const { checkoutError, generateInvoice, loading } = useInvoiceCheckoutComposable();
const { activePriceLists, priceListsError, priceListsStatus, salePriceListId, selectSalePriceList } =
    usePosSaleComposable();
const { openDrawerDatosCliente } = useVisibleComposable();
const { announce, announceCheckoutOutcome } = usePosShortcuts();
const { CompanyGetter } = useCompanyComposable();
const { alicuotaPercepcion } = useArbaComposable();

const { Vouchers } = storeToRefs(useVoucherStore());
const { invoice, invoiceType } = storeToRefs(useInvoiceStore());

const lineCount = computed(() => invoiceTableData.value.length);

const customerLabel = computed(() => (invoice.value.customer as any)?.label ?? 'Sin cliente seleccionado');

const priceListOptions = computed(() =>
    activePriceLists.value.map((list) => ({ value: Number(list.id), label: list.name })),
);

/**
 * Sólo se ofrecen los comprobantes que la empresa puede emitir: un voucher sin
 * builder asociado en `SELECT_INVOICE_TYPE` no tiene comprobante que armar.
 */
const voucherOptions = computed(() =>
    (Vouchers.value as unknown as PosVoucher[]).map((voucher) => ({
        ...voucher,
        disabled: SELECT_INVOICE_TYPE[voucher.id as keyof typeof SELECT_INVOICE_TYPE] === undefined,
    })),
);

const onVoucherChange = (value: number) => {
    invoice.value.voucher = value;
    invoiceType.value = value;

    announce(`Comprobante: ${voucherOptions.value.find((voucher) => voucher.id === value)?.name ?? value}`);
};

/** Cambiar la lista de la venta se anuncia: el precio de los próximos ítems cambia. */
const onSalePriceListChange = (value: number) => {
    selectSalePriceList(value);

    announce(
        `Lista de precios de la venta: ${
            priceListOptions.value.find((list) => list.value === Number(value))?.label ?? value
        }`,
    );
};

const checkout = async () => {
    announceCheckoutOutcome(await generateInvoice());
};
</script>
