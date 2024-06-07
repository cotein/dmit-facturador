<template>
    <div>
        <div class="product-info">
            <sdHeading class="product-info-title" as="h6"> {{ props.record.product.name }}</sdHeading>
            <ul class="info-list">
                <li>
                    <span class="info-title">Iva: {{ props.record.iva.name }}</span>
                </li>
            </ul>
        </div>
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

<style scoped></style>
