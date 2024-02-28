<template>
	<div class="cart-single-quantity">
		<a-button size="large" class="a-button--height" @click="down" :disabled="!disabledButton">
			<template #icon>
				<MinusOutlined />
			</template>
		</a-button>

		<a-input v-model:value="quantity" class="custom--input" disabled />
		<a-button size="large" class="a-button--height" @click="up" :disabled="!disabledButton">
			<template #icon>
				<PlusOutlined />
			</template>
		</a-button>
	</div>
</template>

<script setup lang="ts">
import { ref, toRefs, computed, toRaw, isProxy } from 'vue';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue';
import { useInvoiceNotaCreditoComposable } from '@/app/composables/invoice/useInvoiceNotaCreditoComposable';
import type { ProductForNotaCredito } from '@/app/types/Product';
import { useIvaImportComposable } from '@/app/composables/iva/useIvaImportComposable';

const { iva_import } = useIvaImportComposable();
const { productsForNotaCredito } = useInvoiceNotaCreditoComposable();

type Props = {
	record: ProductForNotaCredito;
	index: number;
};

const props = withDefaults(defineProps<Props>(), {
	record: undefined,
	index: undefined,
});

const { record } = toRefs(props);

const quantity = ref(record.value.quantity);

const quantityCheckPoint = record.value.quantity;

const down = () => {
	if (quantity.value > 1) {
		quantity.value--;

		if (isProxy(productsForNotaCredito.value)) {
			const products = JSON.parse(JSON.stringify(productsForNotaCredito.value));
			const iva = iva_import(
				products[props.index].iva_afip_code,
				products[props.index].unit_price,
				products[props.index].quantity,
			);
			products[props.index].quantity = quantity.value;
			products[props.index].neto_import = quantity.value * products[props.index].unit_price;
			products[props.index].iva_import = iva;
			products[props.index].total = quantity.value * products[props.index].unit_price + iva;

			productsForNotaCredito.value = products;
			console.log('🚀 ~ down ~ productsForNotaCredito.value:', productsForNotaCredito.value);
		} else {
			productsForNotaCredito.value[props.index].quantity = quantity.value;
		}
	}
};

const up = () => {
	if (quantity.value < quantityCheckPoint) {
		quantity.value++;
		productsForNotaCredito.value[props.index].quantity = quantity.value;
	}
};

const disabledButton = computed(() => {
	if (productsForNotaCredito.value.length > 0 && productsForNotaCredito.value[props.index]) {
		return true;
	}

	return false;
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
</style>
