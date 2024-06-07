<template>
    <div v-if="props.sale">
        <span class="product-total-price">{{ $filters.formatCurrency(parseFloat(props.record.sale)) }}</span>
    </div>
    <div v-else>
        <span class="product-total-price">{{ $filters.formatCurrency(parseFloat(props.record.pay)) }}</span>
    </div>
</template>

<script setup lang="ts">
type Props = {
    record: any;
    sale: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    record: undefined,
    sale: undefined,
});
</script>

<style scoped>
div {
    text-align: right;
    width: 100%;
}
</style>
