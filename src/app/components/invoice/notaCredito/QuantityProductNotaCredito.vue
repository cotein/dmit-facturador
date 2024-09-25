<template>
    <div class="cart-single-quantity">
        <a-button
            @mousedown="startDown"
            @mouseup="stopInterval"
            @mouseleave="stopInterval"
            size="large"
            class="a-button--height"
            :disabled="!disabledButton"
        >
            <template #icon>
                <MinusOutlined />
            </template>
        </a-button>

        <a-input v-model:value="quantity" class="custom--input custom--input-disabled" disabled />
        <a-button
            @mousedown="startUp"
            @mouseup="stopInterval"
            @mouseleave="stopInterval"
            size="large"
            class="a-button--height"
            :disabled="!disabledButton"
        >
            <template #icon>
                <PlusOutlined />
            </template>
        </a-button>
    </div>
</template>

<script setup lang="ts">
import { onlyNumeric } from '@/app/helpers/onlyNumbers';
import { ref, toRefs, computed, isProxy, onBeforeMount } from 'vue';
import { useInvoiceNotaCreditoComposable } from '@/app/composables/invoice/useInvoiceNotaCreditoComposable';
import type { ProductForNotaCredito } from '@/app/types/Product';
import { useIvaImportComposable } from '@/app/composables/iva/useIvaImportComposable';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons-vue';
const { iva_import } = useIvaImportComposable();
const { productsForNotaCredito, invoiceForNotaCredito } = useInvoiceNotaCreditoComposable();

type Props = {
    record: ProductForNotaCredito;
    index: number;
};

const props = withDefaults(defineProps<Props>(), {
    record: undefined,
    index: undefined,
});

const { record } = toRefs(props);

const intervalId = ref<number | null>(null);

const quantity = ref<number>(record.value.quantity);

const quantityCheckPoint = record.value.quantity;

const down = () => {
    if (quantity.value > 1) {
        quantity.value--;

        const index = productsForNotaCredito.value.findIndex((product) => product.id === record.value.id);

        if (isProxy(productsForNotaCredito.value)) {
            const products = JSON.parse(JSON.stringify(productsForNotaCredito.value));

            products[index].quantity = quantity.value;

            const iva: number = iva_import(products[index]);

            const neto: number = quantity.value * products[index].unit_price;

            const neto_import: number = parseFloat(neto.toFixed(2));

            products[index].neto_import = neto_import;
            products[index].iva_import = iva;
            products[index].percep_iibb_import = neto_import * (products[index].percep_iibb_alicuota / 100);
            products[index].percep_iva_import = neto_import * (products[index].percep_iva_alicuota / 100);
            products[index].total = neto_import + iva;

            productsForNotaCredito.value = products;
        } else {
            productsForNotaCredito.value[index].quantity = quantity.value;
        }
    }
};

const up = () => {
    const index = productsForNotaCredito.value.findIndex((product) => product.id === record.value.id);

    if (quantity.value < quantityCheckPoint) {
        quantity.value++;
        if (isProxy(productsForNotaCredito.value)) {
            const products = JSON.parse(JSON.stringify(productsForNotaCredito.value));

            products[index].quantity = quantity.value;

            const iva: number = iva_import(products[index]);

            const neto: number = quantity.value * products[index].unit_price;

            const neto_import: number = parseFloat(neto.toFixed(2));

            products[index].neto_import = neto_import;
            products[index].iva_import = iva;
            products[index].percep_iibb_import = neto_import * (products[index].percep_iibb_alicuota / 100);
            products[index].percep_iva_import = neto_import * (products[index].percep_iva_alicuota / 100);
            products[index].total = neto_import + iva;

            productsForNotaCredito.value = products;
        } else {
            productsForNotaCredito.value[index].quantity = quantity.value;
        }
    }
};

const disabledButton = computed(() => {
    if (productsForNotaCredito.value.length > 0) {
        const index = productsForNotaCredito.value.findIndex((product) => product.id === record.value.id);
        if (productsForNotaCredito.value[index]) {
            return true;
        }
    }

    return false;
});

const quantityProductsForNotaCreditoComputed = computed(() => {
    let productInNotaCredito: number = 0;

    if (invoiceForNotaCredito.value?.voucher.children.length) {
        productInNotaCredito = invoiceForNotaCredito.value.voucher.children
            .flatMap((invoice) => invoice.items)
            .filter((item) => props.record.name === item.name)
            .reduce((total, item) => total + item.quantity, 0);
    }

    return props.record.quantity - productInNotaCredito;
});

const startDown = () => {
    down();
    intervalId.value = window.setInterval(down, 100);
};

const startUp = () => {
    up();
    intervalId.value = window.setInterval(up, 100);
};

const stopInterval = () => {
    if (intervalId.value !== null) {
        clearInterval(intervalId.value);
        intervalId.value = null;
    }
};

onBeforeMount(() => {
    quantity.value = quantityProductsForNotaCreditoComputed.value;
});
</script>

<style scoped>
.custom--input {
    width: 3rem;
    text-align: center;
    padding: 6px 5px;
    margin-left: 1rem;
    margin-right: 1rem;
    margin-top: 0.5rem;
}
.custom--input-disabled {
    background-color: white !important;
    color: black !important;
    cursor: not-allowed;
    opacity: 1 !important;
}
.a-button--height {
    margin-top: 1rem;
}
</style>
