<template>
    <div>
        <span v-if="isInscripto" class="product-total-price">{{ $filters.formatCurrency(props.record.subtotal) }}</span>
        <span v-else class="product-total-price">{{ $filters.formatCurrency(props.record.subtotal) }}</span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ProductOnInvoiceTable } from '@/app/types/Product';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { AFIP_INSCRIPTION } from '@/app/types/Constantes';

const { invoice } = useInvoiceComposable();

/**
 * El cliente se lee de forma defensiva: si se limpia el cliente desde el drawer,
 * `invoice.customer` queda en null y la lectura directa rompía el render de la tabla.
 */
const isInscripto = computed(
    () => (invoice.value.customer as any)?.afip_inscription?.id === AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO,
);

type Props = {
    record: ProductOnInvoiceTable;
    index: number;
};
const props = withDefaults(defineProps<Props>(), {
    record: undefined,
    index: undefined,
});
</script>

<style scoped>
div {
    text-align: right;
    width: 100%;
}
</style>
