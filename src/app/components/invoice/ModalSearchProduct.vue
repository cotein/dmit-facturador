<template>
    <div>
        <a-modal
            v-model:visible="openSearchProduct"
            width="1000px"
            title="Búsqueda de producto"
            :destroyOnClose="true"
            :bodyStyle="{
                height: '8rem',
            }"
            :footer="null"
        >
            <SearchProduct ref="searchProductRef" :view-price-list="true" />
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
import SearchProduct from '../product/search/SearchProduct.vue';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';

const { openSearchProduct } = useInvoiceComposable();
</script>
