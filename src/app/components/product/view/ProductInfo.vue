<template>
    <div>
        <a-descriptions bordered :title="product.name.toUpperCase()" size="small">
            <!--  <template #extra>
                <a-button type="primary">Edit</a-button>
            </template> -->
            <a-descriptions-item label="Costo del producto">{{
                $filters.formatCurrency(parseFloat(product.cost))
            }}</a-descriptions-item>
            <a-descriptions-item label="Cantidad de ingreso">{{
                $filters.formatNumberWithThousandsSeparator(product.quantity)
            }}</a-descriptions-item>
            <a-descriptions-item label="IVA">{{ Iva }}</a-descriptions-item>
            <a-descriptions-item label="Stock crítico">{{ product.critical_stock }}</a-descriptions-item>
            <a-descriptions-item label="Se vende por metro">
                {{ product.sale_by_meter ? 'SI' : 'NO' }}
            </a-descriptions-item>
            <a-descriptions-item v-if="product.sale_by_meter" label="Metros por unidad">
                {{ product.meters_by_unity }}
            </a-descriptions-item>
            <a-descriptions-item label="Publicar en tienda">
                {{ product.published_here ? 'SI' : 'NO' }}
            </a-descriptions-item>
            <a-descriptions-item v-if="product.published_here" label="Prioridad de visualización">
                {{ product.priority }}
            </a-descriptions-item>
            <a-descriptions-item v-if="product.published_here" label="Ver precio en tienda">
                {{ product.view_price ? 'SI' : 'NO' }}
            </a-descriptions-item>
            <a-descriptions-item v-if="product.apply_discount" label="Aplica descuento">
                {{ product.view_price ? 'SI' : 'NO' }}
            </a-descriptions-item>
            <a-descriptions-item v-if="product.apply_discount" label="Descuento a partir de">
                {{ product.discount_amount }}
            </a-descriptions-item>
            <a-descriptions-item v-if="product.apply_discount" label="Porcentaje de descuento">
                {{ product.discount_percentage }}
            </a-descriptions-item>
            <a-descriptions-item v-if="product.apply_discount" label="Iva del producto">
                {{ product.iva }}
            </a-descriptions-item>
            <a-descriptions-item label="Categorías a la que pertenece el producto">
                <template v-for="(groupCategory, index) in product.category" :key="index">
                    <template v-for="category in groupCategory" :key="category">
                        {{ rawCategories.find((cat) => cat.id === category)?.name }}
                    </template>
                    <br />
                </template>
            </a-descriptions-item>
            <a-descriptions-item label="Listas de precio que aplican al producto">
                <ul v-for="(pl, index) in product.price_list" :key="index">
                    <li>{{ sale_price(pl) }}</li>
                </ul>
                <br />
            </a-descriptions-item>
        </a-descriptions>
        <a-descriptions-item label="Imágenes">
            <template v-for="(img, index) in product.pictures" :key="index">
                <img :src="(img as FileImg).thumbUrl" style="padding: 1rem" />
            </template>
        </a-descriptions-item>
    </div>
</template>

<script setup lang="ts">
import type { FileImg } from '@/app/types/Files';
import { useCategoryComposable } from '@/app/composables/category/useCategoryComposable';
import { useProductComposable } from '@/app/composables/product/useProductComposable';
import { usePriceListComposable } from '@/app/composables/priceList/usePriceListComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import { onMounted, computed } from 'vue';
import { AFIP_INSCRIPTION, AFIP_IVAS } from '@/app/types/Constantes';

const { CompanyGetter } = useCompanyComposable();
const { product } = useProductComposable();
const { rawCategories } = useCategoryComposable();
const { priceListForTransferComponent } = usePriceListComposable(CompanyGetter!.value.id);

const sale_price = (pl: string) => {
    const listaPrecio = priceListForTransferComponent.value.find((priceList) => priceList.key === pl);

    if (!listaPrecio) {
        return 'Lista de precio no encontrada';
    }

    const profit = listaPrecio.profit_percentage || 0;

    const price =
        parseFloat(product.value.cost.toString()) + (parseFloat(product.value.cost.toString()) * profit) / 100;

    return `${listaPrecio.title} - Gcia. ${profit} % - Precio del producto ${formatCurrency(price, false)}`;
};

const ivas = [
    {
        id: 1,
        code: '3',
        name: '0%',
        percentage: '0',
    },
    {
        id: 2,
        code: '4',
        name: '10,50%',
        percentage: '10.5',
    },
    {
        id: 3,
        code: '5',
        name: '21%',
        percentage: '21',
    },
    {
        id: 4,
        code: '6',
        name: '27%',
        percentage: '27',
    },
    {
        id: 5,
        code: '8',
        name: '5%',
        percentage: '5',
    },
    {
        id: 6,
        code: '9',
        name: '2,50%',
        percentage: '2.5',
    },
];

const Iva = computed(() => {
    return ivas.find((iva) => iva.id === product.value.iva)?.name;
});
onMounted(() => {
    if (
        CompanyGetter.value?.inscription_id === AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO ||
        CompanyGetter.value?.inscription_id === AFIP_INSCRIPTION.IVA_SUJETO_EXENTO
    ) {
        product.value.iva = AFIP_IVAS.AFIP_ID_CERO;
    }
});
</script>

<style scoped></style>
