<template>
    <div class="invoice--previus-nota-credito" v-if="props.children.length">
        <p>Otros comprobantes relacionados con la factura:</p>
        <a-collapse v-model:activeKey="activeKey" ghost v-for="(invoice, index) in props.children" :key="index">
            <a-collapse-panel :key="index" :header="invoice.invoice">
                <p class="item--detail" v-for="(item, i) in invoice.items" :key="i">
                    {{ item.name }} - Cantidad: {{ item.quantity }} - por un importe de:
                    {{ $filters.formatCurrency(item.total) }}
                </p>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, computed, isProxy } from 'vue';
import { useInvoiceNotaCreditoComposable } from '@/app/composables/invoice/useInvoiceNotaCreditoComposable';
import type { ProductForNotaCredito } from '@/app/types/Product';
const { productsForNotaCredito } = useInvoiceNotaCreditoComposable();

type Item = {
    id?: number;
    key?: number;
    name?: string;
    quantity?: number;
    netoImport?: number;
    ivaImport?: number;
    ivaAfipCode?: string;
    ivaID?: number;
    unitPrice?: number;
    total?: number;
};

type Children = {
    invoice: string;
    invoice_id: number;
    items: Item[];
};

type Props = {
    children: Children[];
};

const props = withDefaults(defineProps<Props>(), {
    children: [],
});

const activeKey = ref<string[]>([]);
</script>

<style scoped>
.invoice--previus-nota-credito {
    margin-top: 1rem;
    background-color: white;
    padding: 1rem;
    border-radius: 7px;
}
.invoice--previus-nota-credito > p {
    font-weight: bold;
}
.item--detail {
    margin-left: 2rem;
}
</style>
