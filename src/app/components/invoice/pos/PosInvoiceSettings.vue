<template>
    <section class="pos-surface pos-doc" data-testid="pos-invoice-settings">
        <h2 class="pos-doc__title">Configuración del comprobante</h2>
        <p class="pos-doc__hint">
            Los mismos campos de siempre, a la vista y sin abrir nada: concepto de facturación, fecha de factura,
            condición de venta, modo de pago y —si facturás servicios— fechas de servicio y vencimiento de pago.
        </p>

        <div class="pos-doc__section pos-doc__form">
            <span class="pos-doc__section-title">Datos del comprobante</span>
            <a-form :model="invoice" layout="vertical">
                <InvoiceFieldsForm :columns="2" />
            </a-form>
        </div>

        <!-- El drawer "Datos del Cliente" y la configuración que lo acompaña. Los botones
             que lo abren viven arriba de la pantalla (`PosCustomerActions`). -->
        <InvoiceConfig />
    </section>
</template>

<script setup lang="ts">
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import InvoiceConfig from '../InvoiceConfig.vue';
import InvoiceFieldsForm from '../InvoiceFieldsForm.vue';

/**
 * Configuración completa del comprobante, a la vista, en el modo normal.
 *
 * En el mostrador estos campos viven plegados en "Más opciones" (`PosMoreOptions`)
 * porque es una pantalla de salón y se tocan una vez cada tanto. En el modo normal
 * tienen que estar desplegados: es la vista donde se revisa y se ajusta el
 * comprobante antes de emitirlo.
 *
 * Es el mismo `InvoiceFieldsForm` de los dos modos y el mismo `InvoiceConfig` que
 * trae el drawer de datos del cliente: no hay dos copias de la lógica de fechas,
 * concepto ni condición de venta.
 *
 * El `InvoiceConfig` se monta acá una sola vez para que exista el drawer de datos del
 * cliente en el modo normal (Ant lo teleporta al body, así que no dibuja nada en la
 * página): los botones que lo abren son los de la barra de cliente, arriba de todo.
 */
const { invoice } = useInvoiceComposable();
</script>
