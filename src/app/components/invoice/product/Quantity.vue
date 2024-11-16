<template>
    <div class="cart-single-quantity">
        <sdButton class="btn-dec" type="default" @click="down">
            <unicon name="minus" width="14"></unicon>
        </sdButton>
        <a-input
            @input="input"
            @keypress="onlyNumericInputEvent"
            v-model:value="invoiceTableData[props.index].quantity"
            class="custom--input"
        />
        <!-- {{ invoiceTableData[props.index].quantity }} -->
        <sdButton class="btn-inc" type="default" @click="up">
            <unicon name="plus" width="14"></unicon>
        </sdButton>
    </div>
</template>

<script setup lang="ts">
import type { ProductOnInvoiceTable } from '@/app/types/Product';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { onlyNumericInputEvent } from '@/app/helpers/onlyNumbers';

const { invoiceTableData } = useInvoiceComposable();

type Props = {
    record: ProductOnInvoiceTable;
    index: number;
};
const props = withDefaults(defineProps<Props>(), {
    record: undefined,
    index: undefined,
});

const down = () => {
    if (invoiceTableData.value[props.index].quantity > 1) {
        invoiceTableData.value[props.index].quantity--;
    }
};

const up = () => {
    invoiceTableData.value[props.index].quantity++;
};

const input = (e: Event) => {
    const target = e.target as HTMLInputElement;
    invoiceTableData.value[props.index].quantity = parseFloat(target.value);
    console.log('🚀 ~ input ~ target.value:', target.value);
};
</script>

<style scoped>
.custom--input {
    width: 5rem;
    text-align: center;
    padding: 6px 5px;
}
</style>
