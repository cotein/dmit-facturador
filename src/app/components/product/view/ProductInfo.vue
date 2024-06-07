<template>
    <div>
        <a-descriptions bordered :title="productStore.product.name" size="small">
            <template #extra>
                <a-button type="primary">Edit</a-button>
            </template>
            <a-descriptions-item label="Costo del producto">{{ productStore.product.cost }}</a-descriptions-item>
            <a-descriptions-item label="Cantidad de ingreso">{{ productStore.product.quantity }}</a-descriptions-item>
            <a-descriptions-item label="Stock crítico">{{ productStore.product.critical_stock }}</a-descriptions-item>
            <a-descriptions-item label="Se vende por metro">
                {{ productStore.product.sale_by_meter ? 'SI' : 'NO' }}
            </a-descriptions-item>
            <a-descriptions-item v-if="productStore.product.sale_by_meter" label="Metros por unidad">
                {{ productStore.product.meters_by_unity }}
            </a-descriptions-item>
            <a-descriptions-item label="Publicar en tienda">
                {{ productStore.product.published_here ? 'SI' : 'NO' }}
            </a-descriptions-item>
            <a-descriptions-item v-if="productStore.product.published_here" label="Prioridad de visualización">
                {{ productStore.product.priority }}
            </a-descriptions-item>
            <a-descriptions-item v-if="productStore.product.published_here" label="Ver precio en tienda">
                {{ productStore.product.view_price ? 'SI' : 'NO' }}
            </a-descriptions-item>
            <a-descriptions-item v-if="productStore.product.apply_discount" label="Aplica descuento">
                {{ productStore.product.view_price ? 'SI' : 'NO' }}
            </a-descriptions-item>
            <a-descriptions-item v-if="productStore.product.apply_discount" label="Descuento a partir de">
                {{ productStore.product.discount_amount }}
            </a-descriptions-item>
            <a-descriptions-item v-if="productStore.product.apply_discount" label="Porcentaje de descuento">
                {{ productStore.product.discount_percentage }}
            </a-descriptions-item>
            <a-descriptions-item v-if="productStore.product.apply_discount" label="Iva del producto">
                {{ productStore.product.iva }}
            </a-descriptions-item>
            <a-descriptions-item label="Categorías a la que pertenece el producto">
                <template v-for="(groupCategory, index) in productStore.product.category" :key="index">
                    <template v-for="category in groupCategory" :key="category">
                        {{ rawCategories.find((cat) => cat.id === category)?.name }}
                    </template>
                    <br />
                </template>
            </a-descriptions-item>
            <a-descriptions-item label="Listas de precio que aplican al producto">
                <template v-for="(pl, index) in productStore.selectedPriceList" :key="index">
                    {{ pl }}
                    <br />
                </template>
            </a-descriptions-item>
        </a-descriptions>
        <a-descriptions-item label="Imágenes">
            <template v-for="(img, index) in productStore.product.pictures" :key="index">
                <img :src="(img as FileImg).thumbUrl" style="padding: 1rem" />
            </template>
        </a-descriptions-item>
    </div>
</template>

<script setup lang="ts">
import type { FileImg } from '@/app/types/Files';
import { useCategoryComposable } from '@/app/composables/category/useCategoryComposable';
import { useProductComposable } from '@/app/composables/product/useProductComposable';

const { productStore } = useProductComposable();
const { rawCategories } = useCategoryComposable();
</script>

<style scoped></style>
