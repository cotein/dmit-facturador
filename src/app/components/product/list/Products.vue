<script setup lang="ts">
import { computed, onBeforeMount, onMounted, provide, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Main } from '../../../styled';
import { getCategories } from '@/api/category/category-api';
import { CatalogPage } from '@/app/styles/catalogAdminStyle';
import { PRODUCT_FILTERS_KEY } from './overview/useProductFilters';
import { useProductComposable } from '@/app/composables/product/useProductComposable';
import { usePaginationComposable } from '@/app/composables/pagination/usePaginationComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useCategoryComposable } from '@/app/composables/category/useCategoryComposable';
import type { Category } from '@/app/types/Category';

const { CompanyGetter } = useCompanyComposable();
const { useFetchProducts } = useProductComposable();
const { totalItems } = usePaginationComposable();
const { CategoriesGetter, rawCategories, transform_categories, setCategories } = useCategoryComposable();

const route = useRoute();
const router = useRouter();

const listPath = computed(() => route.matched[1]?.path ?? '/sistema/productos');
const viewMode = computed<'grilla' | 'listado'>(() => (route.path.endsWith('/listado') ? 'listado' : 'grilla'));

/* ---------------------------------------------------------------- filtros */
const search = ref('');
const categoryId = ref<number | undefined>(undefined);

provide(PRODUCT_FILTERS_KEY, { search, categoryId });

const flattenCategories = (tree: Category[], depth = 0): { value: number; label: string }[] =>
    tree.flatMap((node) => [
        { value: Number(node.id), label: `${'\u00A0\u00A0'.repeat(depth)}${node.name}` },
        ...flattenCategories(node.children ?? [], depth + 1),
    ]);

const categoryOptions = computed(() => flattenCategories(CategoriesGetter.value));

const hasActiveFilters = computed(() => search.value.trim() !== '' || categoryId.value !== undefined);

const clearFilters = () => {
    search.value = '';
    categoryId.value = undefined;
};

/**
 * Las categorías se piden de forma imperativa: el listado las necesita para
 * los nombres de cada producto y para el filtro, sin depender de otro observer.
 */
const loadCategories = async () => {
    const id = CompanyGetter.value?.id;

    if (!id) {
        return;
    }

    const { data } = await getCategories(id, 0);

    rawCategories.value = data;
    setCategories(transform_categories(data));
};

onBeforeMount(() => {
    if (CompanyGetter.value?.id) {
        useFetchProducts(CompanyGetter.value.id);
    }
});

onMounted(async () => {
    if (!route.matched[2]) {
        router.push(`${listPath.value}/grilla`);
    }

    await loadCategories();
});
</script>

<template>
    <Main>
        <CatalogPage class="catalog-page products-page">
            <header class="page-head">
                <a-breadcrumb>
                    <a-breadcrumb-item>
                        <router-link :to="{ name: 'Dashboard' }">Inicio</router-link>
                    </a-breadcrumb-item>
                    <a-breadcrumb-item>Productos</a-breadcrumb-item>
                </a-breadcrumb>

                <div class="page-head__row">
                    <div>
                        <h1 class="page-head__title">Productos</h1>
                        <p class="page-head__sub">
                            <span class="num">{{ totalItems }}</span>
                            {{ totalItems === 1 ? 'producto' : 'productos' }} en el catálogo
                        </p>
                    </div>
                    <a-button type="primary" data-action="new-product" @click="router.push({ name: 'AddProduct' })">
                        Cargar producto
                    </a-button>
                </div>
            </header>

            <div class="catalog-surface">
                <div class="toolbar">
                    <a-input-search
                        v-model:value="search"
                        class="toolbar__search"
                        placeholder="Buscar por nombre o código"
                        allow-clear
                        data-field="product-search"
                    />

                    <a-select
                        v-model:value="categoryId"
                        class="toolbar__select"
                        placeholder="Todas las categorías"
                        :options="categoryOptions"
                        allow-clear
                        show-search
                        option-filter-prop="label"
                        data-field="product-category-filter"
                    />

                    <a-button v-if="hasActiveFilters" type="link" data-action="clear-filters" @click="clearFilters">
                        Limpiar filtros
                    </a-button>

                    <span class="toolbar__spacer"></span>

                    <div class="view-toggle" role="group" aria-label="Forma de ver el listado">
                        <router-link
                            :to="`${listPath}/grilla`"
                            :class="{ 'is-active': viewMode === 'grilla' }"
                            title="Ver en grilla"
                        >
                            <unicon name="apps" width="16"></unicon>
                            <span class="visually-hidden">Ver en grilla</span>
                        </router-link>
                        <router-link
                            :to="`${listPath}/listado`"
                            :class="{ 'is-active': viewMode === 'listado' }"
                            title="Ver en listado"
                        >
                            <unicon name="list-ul" width="16"></unicon>
                            <span class="visually-hidden">Ver en listado</span>
                        </router-link>
                    </div>
                </div>

                <div class="results-view">
                    <router-view name="grid"></router-view>
                </div>
            </div>
        </CatalogPage>
    </Main>
</template>

<style scoped>
.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
</style>
