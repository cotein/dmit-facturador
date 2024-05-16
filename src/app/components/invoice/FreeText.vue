<template>
	<ProductTable>
		<a-row :gutter="15">
			<a-col :md="24">
				<quill-editor
					theme="snow"
					placeholder="Descripción"
					style="height: 15rem"
					v-model:content="invoice.comments"
					contentType="html"
				></quill-editor>
			</a-col>
		</a-row>
	</ProductTable>
	<!-- <Totals /> -->
</template>

<script setup lang="ts">
import { ProductTable } from './Style';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';

const { invoice } = useInvoiceComposable();
</script>

<style scoped></style>
