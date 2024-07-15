<template>
    <div>
        <div class="product-info center">
            {{ $props.customer!.status }}
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
.center {
    text-align: center;
}
</style>
