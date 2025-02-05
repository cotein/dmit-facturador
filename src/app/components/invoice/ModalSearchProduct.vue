<template>
    <div>
        <a-modal
            v-model:visible="openSearchProduct"
            :width="widthModal"
            title="Búsqueda de producto"
            :destroyOnClose="true"
            :footer="null"
            :inert="!openSearchProduct"
            :bodyStyle="bodyStyle"
        >
            <SearchProduct ref="searchProductRef" :view-price-list="true" />
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
import SearchProduct from '../product/search/SearchProduct.vue';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { isMobile } from '@/app/helpers/isMobile';
import { computed } from 'vue';

const widthModal = isMobile ? '90%' : '70%';

const { openSearchProduct } = useInvoiceComposable();

const bodyStyle = computed(() => {
    return isMobile ? { height: '65%' } : null;
});
</script>
