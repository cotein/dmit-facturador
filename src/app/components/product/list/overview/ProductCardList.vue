<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useProductComposable } from '@/app/composables/product/useProductComposable';
import { useCategoryComposable } from '@/app/composables/category/useCategoryComposable';
import { toProductForm } from '@/app/components/product/productFormModel';
import type { ListProductItemWithCost } from '@/app/components/product/productFormModel';
import type { ListProductPriceList } from '@/app/types/Product';

const props = defineProps({
    product_data: { type: Object, required: true },
});

const router = useRouter();

const { product } = useProductComposable();
const { rawCategories } = useCategoryComposable();

const { product_data } = toRefs(props);
const item = computed(() => product_data.value as ListProductItemWithCost);

const MAX_VISIBLE_PRICES = 3;

const priceLists = computed<ListProductPriceList[]>(() => item.value.lista_de_precios ?? []);

const visiblePriceLists = computed(() => priceLists.value.slice(0, MAX_VISIBLE_PRICES));

const hiddenPricesCount = computed(() => Math.max(0, priceLists.value.length - MAX_VISIBLE_PRICES));

const categoryLabel = computed(() => {
    const paths = item.value.category ?? [];

    return paths
        .map((path) => {
            const id = Array.isArray(path) ? path[path.length - 1] : path;

            return rawCategories.value.find((category) => category.id === Number(id))?.name ?? '';
        })
        .filter(Boolean)
        .join(', ');
});

const meta = computed(() => [item.value.code, categoryLabel.value].filter(Boolean).join(' · '));

const edit = () => {
    product.value = toProductForm(item.value);
    router.push({ name: 'EditProduct', params: { id: item.value.id } });
};
</script>

<template>
    <article class="product-row">
        <div>
            <h3 class="product-card__name">{{ item.name }}</h3>
            <p class="product-card__meta">{{ meta || 'Sin código ni categoría' }}</p>
        </div>

        <ul v-if="priceLists.length" class="product-row__prices">
            <li v-for="priceList in visiblePriceLists" :key="priceList.pricelist_id">
                <span>{{ priceList.name }}</span>
                <b>{{ $filters.formatCurrency(Number(priceList.sale_price)) }}</b>
            </li>
            <li v-if="hiddenPricesCount">
                <span>y {{ hiddenPricesCount }} más</span>
            </li>
        </ul>
        <p v-else class="product-card__empty">Sin listas de precios: todavía no tiene precio de venta.</p>

        <div class="product-card__actions">
            <a-button :data-action="`edit-${item.id}`" @click="edit">Editar</a-button>
        </div>
    </article>
</template>
