<template>
    <div>
        <!-- <span class="product-total-price">{{ $filters.formatCurrency(props.record.discount) }}</span> -->
        <input
            @input="input"
            :value="invoiceTableData[props.index].discount"
            class="custom-input"
            @keypress="onlyNumeric"
            inputmode="decimal"
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
    const value = Number(target.value.replace(',', '.'));
    const line = invoiceTableData.value[props.index];

    // Campo vacío o inválido → `parseFloat` devolvía NaN y el total del comprobante
    // quedaba roto. Se restaura el último descuento válido en el input.
    if (!Number.isFinite(value) || value < 0) {
        target.value = String(line.discount);

        return;
    }

    line.discount = value;
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
    /* Foco visible con el primario del sistema. Antes era `outline: none` con un
       borde y un inset teal ajenos al tema. */
    outline: 2px solid #8231d3;
    outline-offset: 1px;
    border: 1px solid #8231d3;
}
</style>
