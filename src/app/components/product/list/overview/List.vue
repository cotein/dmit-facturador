<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { PaginationWrapper } from '../../Style';
import { useProductComposable } from '@/app/composables/product/useProductComposable';
import { usePaginationComposable } from '@/app/composables/pagination/usePaginationComposable';
import { useCategoryComposable } from '@/app/composables/category/useCategoryComposable';
import { collectCategoryIds, filterProducts, useProductFilters } from './useProductFilters';
import ProductCardList from './ProductCardList.vue';

const router = useRouter();

const { products, productsListSpinner } = useProductComposable();
const { currentPage, itemsPerPage, totalItems } = usePaginationComposable();
const { CategoriesGetter } = useCategoryComposable();
const { search, categoryId } = useProductFilters();

const categoryIds = computed(() =>
    categoryId.value === undefined ? undefined : collectCategoryIds(CategoriesGetter.value, categoryId.value),
);

const filtered = computed(() => filterProducts(products.value, search.value, categoryIds.value));

const hasActiveFilters = computed(() => search.value.trim() !== '' || categoryId.value !== undefined);

const pageSizeOptions = ['10', '20', '30', '40', '50', '100'];

const onShowSizeChange = (newCurrent: number, newPageSize: number) => {
    currentPage.value = newCurrent;
    itemsPerPage.value = newPageSize;
};

const onHandleChange = (newCurrent: number, newPageSize: number) => {
    currentPage.value = newCurrent;
    itemsPerPage.value = newPageSize;
};

const clearFilters = () => {
    search.value = '';
    categoryId.value = undefined;
};
</script>

<template>
    <div>
        <div v-if="productsListSpinner" class="product-list-skeleton">
            <div v-for="index in 4" :key="index" class="product-list-skeleton__item">
                <a-skeleton :paragraph="{ rows: 2 }" active />
            </div>
        </div>

        <template v-else-if="filtered.length">
            <p class="results-count">
                <span class="num">{{ filtered.length }}</span>
                {{ filtered.length === 1 ? 'producto' : 'productos' }}
                <template v-if="hasActiveFilters">de {{ totalItems }}</template>
            </p>
            <div class="product-list-rows">
                <ProductCardList v-for="product in filtered" :key="product.id" :product_data="product" />
            </div>
        </template>

        <div v-else-if="totalItems === 0" class="state-box">
            <p class="state-box__title">Todavía no cargaste productos</p>
            <p class="state-box__text">
                Cargá el primer producto para poder facturarlo: con el costo y una lista de precios ya queda listo.
            </p>
            <div class="state-box__actions">
                <a-button type="primary" data-action="load-first" @click="router.push({ name: 'AddProduct' })">
                    Cargar el primero
                </a-button>
            </div>
        </div>

        <div v-else class="state-box">
            <p class="state-box__title">
                <template v-if="search.trim()">No hay productos para “{{ search.trim() }}”</template>
                <template v-else>No hay productos en esa categoría</template>
            </p>
            <p class="state-box__text">
                Probá con otro término (podés buscar por nombre o por código) o quitá los filtros para ver todo el
                catálogo.
            </p>
            <div class="state-box__actions">
                <a-button data-action="clear-filters-empty" @click="clearFilters">Limpiar filtros</a-button>
            </div>
        </div>

        <PaginationWrapper v-if="filtered.length && totalItems > 0">
            <a-pagination
                style="margin-top: 31px"
                show-size-changer
                :current="currentPage"
                :page-size="itemsPerPage"
                :total="totalItems"
                :page-size-options="pageSizeOptions"
                @showSizeChange="onShowSizeChange"
                @change="onHandleChange"
            >
                <template #buildOptionText="option">
                    <span>{{ option.value }} productos</span>
                </template>
                <template #itemRender="{ type, originalElement }">
                    <a v-if="type === 'prev'">Ant.</a>
                    <a v-else-if="type === 'next'">Sig.</a>
                    <component :is="originalElement" v-else></component>
                </template>
            </a-pagination>
        </PaginationWrapper>
    </div>
</template>

<style scoped>
.product-list-rows {
    display: grid;
    gap: 16px;
}

.product-list-skeleton {
    display: grid;
    gap: 16px;
}

.product-list-skeleton__item {
    padding: 18px;
    background: #ffffff;
    border: 1px solid #e3e6ef;
    border-radius: 4px;
}
</style>
