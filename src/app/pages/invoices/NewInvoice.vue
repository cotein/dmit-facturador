<template>
	<div>
		<sdPageHeader title="Generar comprobante de venta" class="ninjadash-page-header-main"> </sdPageHeader>
		<ModalSearchProduct />
		<Main>
			<FormInvoice />
		</Main>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { Main } from '../../styled';
import FormInvoice from '../../components/invoice/FormInvoice.vue';
import ModalSearchProduct from '@/app/components/invoice/ModalSearchProduct.vue';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
const { openSearchProduct } = useInvoiceComposable();

const openModal = (event: KeyboardEvent) => {
	if (event.code === 'F12') {
		event.preventDefault();
		openSearchProduct.value = true;
	}
};
onMounted(() => {
	window.addEventListener('keydown', openModal);
});
</script>
