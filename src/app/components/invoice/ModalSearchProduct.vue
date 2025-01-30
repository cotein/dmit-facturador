<template>
    <div>
        <a-modal
            v-model:visible="openSearchProduct"
            width="75%"
            title="Búsqueda de producto"
            :destroyOnClose="true"
            :bodyStyle="{
                'min-height': '8rem',
                height: '8rem',
                'background-color': '#00f2ff',
            }"
            :footer="null"
            :inert="!openSearchProduct"
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
