<template>
    <div>
        <div class="product-info left">
            <sdHeading class="product-info-title" as="h6">
                {{
                    $props.customer?.last_name
                        ? `${$props.customer.name} ${$props.customer.last_name}`
                        : $props.customer!.name
                }}</sdHeading
            >
            <ul class="info-list">
                <li>
                    <span class="info-title">{{ props.customer.fantasy_name ?? '' }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Customer } from '@/app/types/Invoice';

type Props = {
    customer: Customer;
    index: number;
};

const props = withDefaults(defineProps<Props>(), {
    customer: undefined,
    index: undefined,
});
</script>

<style scoped>
.left {
    text-align: left;
}
</style>
