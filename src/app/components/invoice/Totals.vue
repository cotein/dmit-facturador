<template>
	<a-row justify="space-around">
		<a-col :xxl="20">
			<div class="switch-open-editor">
				<!-- <a-switch
					v-model:checked="openEditor"
					checked-children="Quitar comentarios"
					un-checked-children="Agregar comentarios"
				/> -->
			</div>

			<div class="comments">
				<!-- <quill-editor
					theme="snow"
					placeholder="Ingresar descripción"
					style="height: 10rem"
					v-model:content="invoice.comments"
					contentType="html"
				></quill-editor> -->
			</div>
		</a-col>
		<a-col :xxl="4" :xl="5" :sm="8" :xs="14">
			<OrderSummary>
				<div class="invoice-summary-inner">
					<ul class="summary-list">
						<li>
							<span class="summary-list-title">Subtotal :</span>
							<span class="summary-list-text">{{ $filters.formatCurrency(Subtotal) }}</span>
						</li>
						<li>
							<span class="summary-list-title">Descuentos :</span>
							<span class="summary-list-text">{{ $filters.formatCurrency(Discount) }}</span>
						</li>
						<template v-for="(iva, index) in IVAS" :key="index">
							<li>
								<span class="summary-list-title">Iva: {{ iva.name }}</span>
								<span class="summary-list-text">{{ $filters.formatCurrency(iva.import) }}</span>
							</li>
						</template>
					</ul>
					<sdHeading class="summary-total" as="h4">
						<span class="summary-total-label">Total : </span>
						<span class="summary-total-amount">{{ $filters.formatCurrency(TotalComprobante) }}</span>
					</sdHeading>
				</div>
			</OrderSummary>
		</a-col>
	</a-row>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { OrderSummary } from './Style';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
const { invoice, Subtotal, Discount, TotalComprobante, IVAS } = useInvoiceComposable();

const openEditor = ref<boolean>(false);

watch(openEditor, (value) => {
	if (!value) {
		invoice.value.comments = null;
	}
});
</script>

<style scoped>
.comments {
	padding: 2rem;
}
.switch-open-editor {
	padding: 15px;
}
</style>
