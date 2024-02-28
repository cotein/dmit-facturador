<template>
	<div>
		<sdPageHeader title="Listado de comprobantes de venta" class="ninjadash-page-header-main"> </sdPageHeader>
		<Main>
			<InvoiceTable :list="invoiceList" :loading="isLoading" />
			<!-- <a-pagination
				:total="totalPages"
				v-model:current="currentPage"
				v-model:page-size="itemsPerPage"
				:page-size-options="pageSizeOptions"
				show-size-changer
				@showSizeChange="onShowSizeChange"
				@change="changeCurrentPage"
				:show-total="showTotal"
			>
				<template #buildOptionText="props">
					<span v-if="props.value !== '50'">{{ props.value }} Comprobantes por pág.</span>
					<span v-else></span>
				</template>
				<template #itemRender="{ type, originalElement }">
					<a v-if="type === 'prev'">Ant.</a>
					<a v-else-if="type === 'next'">Sig.</a>
					<component :is="originalElement" v-else></component>
				</template>
			</a-pagination> -->
		</Main>
	</div>
</template>

<script setup lang="ts">
import { Main } from '@/app/components/invoice/product/styled';
import { ref } from 'vue';
import { useInvoiceListComposable } from '@/app/composables/invoice/useInvoiceListComposable';
import InvoiceTable from '@/app/components/invoice/list/InvoiceTable.vue';

const { currentPage, itemsPerPage, totalPages, invoiceList, isLoading } = useInvoiceListComposable();

const pageSizeOptions = ref<string[]>(['10', '20', '30', '40', '50']);

const showTotal = (totalPages: number, range: any) => {
	console.log('🚀 ~ showTotal ~ range:', range, totalPages);
	return `${range[0]}-${range[1]} de ${totalPages} comprobantes`;
};

/* const onShowSizeChange = (current: number, pageSize: number) => {
	console.log(current, pageSize);
	itemsPerPage.value = pageSize;
}; */

/* const changeCurrentPage = (current: number, pageSize: number) => {
	currentPage.value = current;
	itemsPerPage.value = pageSize;
}; */
</script>
