<template>
    <div>
        <span class="product-total-price">{{ $filters.formatCurrency(Total) }}</span>
    </div>
</template>

<script setup lang="ts">
import type { InvoiceList, Item } from '@/app/types/Invoice';
import { computed } from 'vue';

type Props = {
    record: InvoiceList;
    index: number;
};

const props = withDefaults(defineProps<Props>(), {
    record: undefined,
    index: undefined,
});

const Total = computed(() => {
    return props.record.items.reduce((total: number, item: Item) => {
        if (item.total) return total + item.total + item.percep_iibb_import + item.percep_iva_import;
        return total;
    }, 0);
});
</script>

<style scoped>
div {
    text-align: right;
    width: 100%;
}
</style>
