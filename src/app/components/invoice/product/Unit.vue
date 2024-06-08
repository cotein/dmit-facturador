<template>
    <div>
        <a-input
            @input="input"
            :value="inputValue"
            class="custom--input fixed-width"
            @keypress="onlyNumeric"
            @focus="selectText"
            @blur="formatCurrency"
        />
    </div>
</template>

<script setup lang="ts">
import type { ProductOnInvoiceTable } from '@/app/types/Product';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { onlyNumeric, selectText } from '@/app/helpers/onlyNumbers';
import { ref } from 'vue';
import { onMounted } from 'vue';

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
};

const formatCurrency = (e: Event) => {
    const target = e.target as HTMLInputElement;

    const value = parseFloat(target.value);

    if (!isNaN(value)) {
        target.value = new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(value);

        inputValue.value = target.value;
    }
};

onMounted(() => {
    inputValue.value = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
    }).format(props.record.unit);
});
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
</style>
