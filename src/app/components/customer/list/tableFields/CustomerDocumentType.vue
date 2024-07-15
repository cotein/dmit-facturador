<template>
    <div>
        <div class="left">
            {{ props.customer.afip_document.name }}
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
