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
import { useInvoiceListComposable } from '@/app/composables/invoice/useInvoiceListComposable';
import InvoiceTable from '@/app/components/invoice/list/InvoiceTable.vue';

const { invoiceList, isLoading } = useInvoiceListComposable();
</script>
