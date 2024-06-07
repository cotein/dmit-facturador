<template>
    <div>
        <span class="product-total-price">{{ $filters.formatCurrency(props.record.iva_import) }}</span>
    </div>
</template>

<script setup lang="ts">
import type { ProductOnInvoiceTable } from '@/app/types/Product';

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
    min-width: 100%;
    max-width: 100%;
}
</style>
