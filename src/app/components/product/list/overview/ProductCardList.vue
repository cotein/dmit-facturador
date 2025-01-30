<script setup lang="ts">
import { ProductCard } from '../../Style';
import { computed, toRefs } from 'vue';
import { useProductComposable } from '@/app/composables/product/useProductComposable';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
    product: {
        type: Object,
        default: () => {},
    },
});

const { productsListSpinner } = useProductComposable();

const { product } = toRefs(props);
const renderData = computed(() => product.value);
const router = useRouter();
const { matched } = useRoute();

const addWishList = (value: any) => {
    //dispatch('updateWishList', value);
};

const goToUpdateProduct = () => {
    const product_id = renderData.value!.id;

    router.push(`/productos/actualizar/${product_id}`);
};
</script>

<template>
    <div class="spin" v-if="productsListSpinner"><a-spin /></div>
    <ProductCard v-else class="list-view" :style="{ marginBottom: '20px' }">
        <div class="product-list">
            <a-row :gutter="15">
                <a-col :md="24" :lg="6" :xs="24">
                    <figure>
                        <img :src="$environment.VITE_SRC_ASSETS + '/img/products/2.png'" :alt="renderData.slug" />
                    </figure>
                </a-col>
                <a-col :md="24" :lg="12" :xs="24">
                    <div class="product-single-description">
                        <sdHeading class="product-single-title" as="h5">
                            <router-link :to="`${matched[1].path}/ecommerce/productDetails/${renderData.id}`">{{
                                renderData.name
                            }}</router-link>
                        </sdHeading>
                        <p>
                            {{ renderData.description ? renderData.description : 'Éste producto no tiene descripción' }}
                        </p>
                    </div>
                </a-col>
                <a-col :md="24" :lg="6" :xs="24">
                    <div class="product-single-info">
                        <p>
                            <!-- <span class="product-single-price__new">${{ renderData.name }} </span> -->
                            <template v-if="renderData?.lista_de_precios.length">
                                <template v-for="(price_list, index) in renderData.lista_de_precios" :key="index">
                                    <span class="">
                                        L. precio: {{ price_list.name }}
                                        {{ $filters.formatCurrency(parseFloat(price_list.sale_price)) }}
                                    </span>

                                    <br />
                                </template>
                            </template>
                        </p>
                        <div class="product-single-action">
                            <a-button @click="goToUpdateProduct"> Editar </a-button>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </div>
    </ProductCard>
</template>
