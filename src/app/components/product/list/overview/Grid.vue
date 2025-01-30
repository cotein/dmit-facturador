<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import { PaginationWrapper, NotFoundWrapper } from '../../Style';
import { useProductComposable } from '@/app/composables/product/useProductComposable';
import { usePaginationComposable } from '@/app/composables/pagination/usePaginationComposable';

const { currentPage, itemsPerPage, totalItems } = usePaginationComposable();

const ProductCards = defineAsyncComponent(() => import('./ProductCards.vue'));

const { products, productsListSpinner } = useProductComposable();

const onShowSizeChange = (newCurrent: number, newPageSize: number) => {
    currentPage.value = newCurrent;
    itemsPerPage.value = newPageSize;
};

const pageSizeOptions = ref<string[]>(['1', '2', '10', '20', '30', '40', '50', '100']);

const onHandleChange = (newCurrent: number, newPageSize: number) => {
    currentPage.value = newCurrent;
    itemsPerPage.value = newPageSize;
};
</script>

<template>
    <a-row :gutter="30">
        <a-col v-if="productsListSpinner" :xs="24">
            <div class="spin">
                <a-spin />
            </div>
        </a-col>
        <template v-else-if="products.length">
            <a-col
                v-for="(product, index) in products"
                :xxl="6"
                :lg="12"
                :xs="24"
                :key="index"
                style="min-height: 331px"
            >
                <Suspense>
                    <template #default>
                        <ProductCards :product="product" />
                    </template>
                    <template #fallback>
                        <sdCards headless>
                            <a-skeleton :paragraph="{ rows: 22 }" active />
                        </sdCards>
                    </template>
                </Suspense>
            </a-col>
        </template>

        <a-col v-else :md="24">
            <NotFoundWrapper>
                <sdHeading as="h1">Datos no encontrados</sdHeading>
            </NotFoundWrapper>
        </a-col>

        <a-col :xs="24" class="pb-30" style="display: flex; justify-content: center">
            <PaginationWrapper v-if="products.length">
                <a-pagination
                    :style="{ marginTop: 31 }"
                    :change="onHandleChange"
                    showSizeChanger
                    @showSizeChange="onShowSizeChange"
                    v-model:current="currentPage"
                    v-model:pageSize="itemsPerPage"
                    :defaultCurrent="1"
                    :total="totalItems"
                    :page-size-options="pageSizeOptions"
                >
                    <template #buildOptionText="props">
                        <span>{{ props.value }} productos</span>
                    </template>
                    <template #itemRender="{ type, originalElement }">
                        <a v-if="type === 'prev'">Ant.</a>
                        <a v-else-if="type === 'next'">Sig.</a>
                        <component :is="originalElement" v-else></component>
                    </template>
                </a-pagination>
            </PaginationWrapper>
        </a-col>
    </a-row>
</template>
