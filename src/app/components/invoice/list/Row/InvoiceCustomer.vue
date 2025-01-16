<template>
    <div>
        <div class="product-info left">
            <sdHeading class="product-info-title" as="h6">
                <a-tooltip :title="customerName">
                    <span>{{ truncateText(customerName, 21) }}</span>
                </a-tooltip>
            </sdHeading>
            <ul class="info-list">
                <li>
                    <span class="info-title">{{ props.record.customer.fantasy_name ?? '' }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { InvoiceList } from '@/app/types/Invoice';
import { computed, defineProps, withDefaults } from 'vue';
import { truncateText } from '@/app/helpers/truncateText';

type Props = {
    record: InvoiceList;
    index: number;
};

const props = withDefaults(defineProps<Props>(), {
    record: undefined,
    index: undefined,
});

const customerName = computed(() => {
    return props.record.customer.last_name
        ? `${props.record.customer.name} ${props.record.customer.last_name}`
        : props.record.customer.name;
});
</script>

<style scoped>
.left {
    text-align: left;
}
</style>
