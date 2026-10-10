<template>
    <a-select
        v-model:value="defaultSaleCondition"
        placeholder="Condición de pago"
        style="width: 100%"
        :default-active-first-option="false"
        :field-names="{ label: 'name', value: 'id' }"
        :options="allSaleConditions"
        size="large"
        data-testid="sale-condition-select"
    ></a-select>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { usePosInlineOptions } from '@/app/composables/invoice/usePosInlineOptions';

/**
 * Condición de venta de la venta.
 *
 * Las opciones son las que ya tiene cargadas la empresa más las que se escriban a mano
 * para esta venta (`usePosInlineOptions`): el dueño necesita poder ingresar una
 * condición en el momento y usarla, sin depender de que ya esté en el catálogo.
 *
 * El alta al vuelo NO vive acá adentro sino al lado del `a-form-item` que envuelve a
 * este select (`InvoiceFieldsForm`): un `Form.Item` sólo puede recolectar un campo y,
 * adentro, los campos del alta lo hacían avisar por consola.
 */
const { invoice } = useInvoiceComposable();

const { allSaleConditions } = usePosInlineOptions();

const defaultSaleCondition = computed({
    get() {
        return invoice.value.SaleCondition;
    },
    set(val) {
        invoice.value.SaleCondition = val;
    },
});
</script>
