<template>
    <div>
        <!-- <span class="product-total-price">{{ $filters.formatCurrency(props.record.discount) }}</span> -->
        <input
            @input="input"
            :value="invoiceTableData[props.index].discount"
            class="custom-input"
            @keypress="onlyNumeric"
            inputmode="numeric"
            @focus="selectText"
        />
    </div>
</template>

<script setup lang="ts">
import type { ProductOnInvoiceTable } from '@/app/types/Product';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { onlyNumeric, selectText } from '@/app/helpers/onlyNumbers';

type Props = {
    record: ProductOnInvoiceTable;
    index: number;
};

const props = withDefaults(defineProps<Props>(), {
    record: undefined,
    index: undefined,
});

const { invoiceTableData } = useInvoiceComposable();

const input = (e: Event) => {
    const target = e.target as HTMLInputElement;
    invoiceTableData.value[props.index].discount = parseFloat(target.value);
};
</script>

<style scoped>
div {
    text-align: right;
    width: 100%;
}
.custom-input {
    padding: 0 8px;
    vertical-align: middle;
    border-radius: 5px;
    width: 95%;
    min-height: 41px;
    background-color: #ffffff;
    border: 1px solid rgba(157, 155, 153, 0.491);
    transition: all 0.2s ease-in-out 0s;
    font-size: 16px;
    line-height: 18px;
    font-weight: normal;
    text-align: right;
    margin-left: 5%;
}

.custom-input:focus {
    outline: none;
    border: 1px solid #a2d2df;
    box-shadow: inset 0 0 0 1px #007c89;
}
</style>
