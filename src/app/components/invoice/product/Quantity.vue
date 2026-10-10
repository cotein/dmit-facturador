<template>
    <div class="cart-single-quantity">
        <button type="button" class="btn-dec" aria-label="Restar una unidad" @click="down">
            <unicon name="minus" width="14"></unicon>
        </button>
        <!-- Sin `v-model`: el valor lo escribe sólo `input()`, que valida. Con v-model,
             el campo vacío entraba al modelo antes de que la guarda pudiera restaurarlo. -->
        <a-input
            :value="invoiceTableData[props.index].quantity"
            @input="input"
            @keypress="onlyNumericInputEvent"
            inputmode="numeric"
            class="custom--input"
            @focus="selectText"
        />
        <!-- {{ invoiceTableData[props.index].quantity }} -->
        <button type="button" class="btn-inc" aria-label="Sumar una unidad" @click="up">
            <unicon name="plus" width="14"></unicon>
        </button>
    </div>
</template>

<script setup lang="ts">
import type { ProductOnInvoiceTable } from '@/app/types/Product';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { onlyNumericInputEvent, selectText } from '@/app/helpers/onlyNumbers';

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
    const value = Number(target.value.replace(',', '.'));
    const line = invoiceTableData.value[props.index];

    // Un campo vacío dejaba `parseFloat('') === NaN` en el modelo y rompía los totales
    // del comprobante sin forma de recuperarlos. Si el valor no sirve se restaura el
    // último válido en el input, en vez de escribir basura en el modelo.
    if (!Number.isFinite(value) || value < 1) {
        target.value = String(line.quantity);

        return;
    }

    line.quantity = value;
};
</script>

<style scoped>
.custom--input {
    width: 5rem;
    text-align: center;
    padding: 6px 5px;
}

/* `sdButton` no está registrado como componente: renderizaba un elemento sin
   semántica ni foco de teclado. Ahora son <button> reales con el mismo aspecto
   (el tamaño, el radio y el hover salen de .btn-inc / .btn-dec en main.css). */
.btn-dec,
.btn-inc {
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
}

.btn-dec:focus-visible,
.btn-inc:focus-visible {
    outline: 2px solid #8231d3;
    outline-offset: 1px;
}
</style>
