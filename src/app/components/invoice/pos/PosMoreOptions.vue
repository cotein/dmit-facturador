<template>
    <div class="pos-more">
        <button
            type="button"
            class="pos-more__toggle"
            data-action="toggle-more-options"
            aria-controls="pos-more-options"
            :aria-expanded="open"
            @click="open = !open"
        >
            <span>Más opciones</span>
            <span class="pos-more__caret" aria-hidden="true"><DownOutlined /></span>
        </button>

        <!-- Resumen de lo configurado, para que nada quede escondido detrás del pliegue. -->
        <p class="pos-more__summary" data-testid="pos-more-summary">{{ summary }}</p>

        <div v-show="open" id="pos-more-options" class="pos-more__body">
            <a-form :model="invoice" layout="vertical">
                <InvoiceFieldsForm :columns="1" />
            </a-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { usePosInlineOptions } from '@/app/composables/invoice/usePosInlineOptions';
import InvoiceFieldsForm from '../InvoiceFieldsForm.vue';

/**
 * Todo lo que no se toca a mano en cada venta queda acá adentro, cerrado por
 * defecto y con los valores ya puestos.
 *
 * En el mostrador sólo son de un clic el tipo de comprobante y el cliente (están
 * en el panel de venta); concepto de facturación, condición de venta, fecha de
 * factura, fechas de servicio, vencimiento de pago y modo de pago siguen
 * funcionando igual que en el drawer del modo normal —son los mismos campos, con
 * la misma lógica— pero viven acá para no ensuciar la pantalla de uso intensivo.
 */
const { invoice } = useInvoiceComposable();

/**
 * Las listas completas —las de la empresa más las creadas a mano para esta venta— así
 * el resumen nombra también una condición o un modo de pago recién escritos.
 */
const { allPaymentTypes, allSaleConditions } = usePosInlineOptions();

const open = ref(false);

const summary = computed(() => {
    const saleCondition = (allSaleConditions.value ?? []).find((item) => item.id === invoice.value.SaleCondition);
    const paymentType = (allPaymentTypes.value ?? []).find((item) => item.id === invoice.value.paymentType);
    const concept = invoice.value.Concepto === '1' ? 'Productos' : 'Servicios';
    const date = (invoice.value.date as { format?: (template: string) => string } | undefined)?.format?.('DD/MM/YYYY');

    return [concept, saleCondition?.name, paymentType?.name, date ? `Fecha ${date}` : null].filter(Boolean).join(' · ');
});
</script>

<style scoped>
.pos-more__summary {
    margin: 0;
    font-size: 13px;
    color: #585858;
}
</style>
