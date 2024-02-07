<template>
	<div>
		<a-modal
			v-model:visible="productStore.openModalViewImg"
			title="Información del producto a ingresar"
			@ok="storeProduct"
			okText="Guardar producto"
			width="auto"
			:confirmLoading="loading"
		>
			<ProductInfo />
		</a-modal>
	</div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import ProductInfo from './ProductInfo.vue';
import { useProductComposable } from '@/app/composables/product/useProductComposable';
import { defineEmits } from 'vue';
import { message } from 'ant-design-vue';

const emit = defineEmits(['initialStepsProductEvent']);

const emitEvent = () => {
	emit('initialStepsProductEvent', true);
};

const loading = ref<boolean>(false);
const { productStore, saveProduct } = useProductComposable();

const storeProduct = async () => {
	loading.value = true;
	const payload = {
		company_id: 1,
		product: productStore.product,
	};
	const data = await saveProduct(payload)
		.catch((err) => {
			message.error({
				content: err.message,
			});
		})
		.finally(() => (loading.value = false));

	if (data) {
		message.success({
			content: 'El producto ha sido guardado correctamente.',
			duration: 3,
		});
		productStore.openModalViewImg = false;
		productStore.productInitialState();
		emitEvent();
	}
};
</script>
