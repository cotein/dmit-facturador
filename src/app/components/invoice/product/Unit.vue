<template>
    <input
        @input="input"
        :value="invoiceTableData[props.index].unit"
        class="custom-input"
        @keypress="onlyNumeric"
        @focus="selectText"
    />
</template>

<script setup lang="ts">
import type { ProductOnInvoiceTable } from '@/app/types/Product';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { onlyNumeric, selectText } from '@/app/helpers/onlyNumbers';
import { ref } from 'vue';

const { invoiceTableData } = useInvoiceComposable();

type Props = {
    record: ProductOnInvoiceTable;
    index: number;
};

const inputValue = ref<any>();

const props = withDefaults(defineProps<Props>(), {
    record: undefined,
    index: undefined,
});

const input = (e: Event) => {
    const target = e.target as HTMLInputElement;
    invoiceTableData.value[props.index].unit = parseFloat(target.value);
    console.log('🚀 ~ input ~ target.value:', target.value);
};

/* const formatCurrency = (e: Event) => {
    const target = e.target as HTMLInputElement;

    const value = parseFloat(target.value);

    if (!isNaN(value)) {
        target.value = new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(value);

        inputValue.value = target.value;
    }
}; */

/* onMounted(() => {
    inputValue.value = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    }).format(props.record.unit);
}); */
</script>

<style scoped>
div {
    text-align: right;
    width: 100%;
}
.fixed-width {
    width: 100%; /* replace with your desired width */
    text-align: right;
}
.custom-input {
    padding: 0 8px;
    vertical-align: middle;
    border-radius: 5px;
    width: 100%;
    min-height: 41px;
    background-color: #ffffff;
    border: 1px solid rgba(157, 155, 153, 0.491);
    transition: all 0.2s ease-in-out 0s;
    font-size: 16px;
    line-height: 18px;
    font-weight: normal;
    text-align: right;
}

.custom-input:focus {
    outline: none;
    border: 1px solid #a2d2df;
    box-shadow: inset 0 0 0 1px #007c89;
}
</style>
