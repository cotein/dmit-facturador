<script setup lang="ts">
import { ProductCard } from '@/app/components/product/Style';
import { toRefs, computed, ref } from 'vue';
import { useProductComposable } from '@/app/composables/product/useProductComposable';
import { useRoute, useRouter } from 'vue-router';
import DetailsRight from './DetailsRight.vue';
import { ProductDetailsWrapper } from './../../Style';
const props = defineProps({
    product: Object,
});
//const { dispatch, state } = useStore();
//const productsListSpinner = computed(() => state.ecommerce.isProductLoading);
const { productsListSpinner } = useProductComposable();
const router = useRouter();
const { product } = toRefs(props);
const renderData = computed(() => product?.value);
const { matched } = useRoute();
const addWishList = (value: any) => {
    //dispatch('updateWishList', value);
};
const goToUpdateProduct = () => {
    const product_id = renderData.value!.id;

    router.push(`/productos/actualizar/${product_id}`);
};

const openModal = ref<boolean>(false);

interface Iva {
    id: number;
    name: string;
    percentage: string;
    afip_code: number;
}

interface PriceList {
    id: number;
    product_id: number;
    name: string;
    pricelist_id: number | null;
    cost: number;
    profit_percentage: number;
    profit_rate: number;
    sale_price: number;
}

interface Product {
    id: number;
    meli_id: number | null;
    company_id: number;
    name: string;
    code: string;
    sub_title: string;
    description: string;
    money_id: number;
    published_meli: number;
    published_here: number;
    active: number;
    slug: string;
    critical_stock: number;
    sale_by_meters: number;
    meters_by_unity: number;
    apply_discount: number;
    apply_discount_amount: number;
    apply_discount_percentage: number;
    see_price_on_the_web: number;
    price_list: string[];
    iva: Iva;
    category: number[][];
    quantity: number;
    priority: number;
    cost: number;
    lista_de_precios: PriceList[];
}
</script>

<template>
    <div class="spin" v-if="productsListSpinner"><a-spin /></div>
    <ProductCard v-else style="margin-bottom: 30px">
        <figure>
            <!-- <img :src="`../../../../../${renderData?.img}`" :alt="`img${renderData?.id}`" /> -->
            <img :src="$environment.VITE_SRC_ASSETS + '/img/products/2.png'" :alt="renderData.slug" />
        </figure>
        <figcaption>
            <!-- <a @click="() => addWishList(renderData?.id)" class="btn-heart" to="#"> -->
            <!-- <a class="btn-heart" to="#">
                <unicon name="heart" width="14" :style="{ fill: renderData?.code ? '#ff4d4f' : '#9299B8' }"></unicon>
            </a> -->
            <sdHeading class="product-single-title" as="h5">
                <router-link :to="`${matched[1].path}/ecommerce/productDetails/${renderData?.id}`">{{
                    renderData?.name
                }}</router-link>
            </sdHeading>

            <!-- <div class="product-single-rating">
                <a-rate allow-half :value="renderData?.rate" disabled /> 4.9
                <span class="total-reviews"> 778 Reviews</span>
            </div> -->

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
                <!-- <a-button @click="openModal = true"> Ver </a-button>
                <a-modal
                    v-model:visible="openModal"
                    title="Información del producto a ingresar"
                    okText="Producto"
                    width="auto"
                >
                    <ProductDetailsWrapper v-if="renderData">
                        <div class="product-details-box">
                            <a-row :gutter="30">
                                <a-col :xs="24" :lg="10">
                                    <div class="product-details-box__left pdbl">
                                        <figure>
                                            <img
                                                :style="{ width: '100%' }"
                                                :src="renderData && `${renderData.img}`"
                                                alt=""
                                            />
                                        </figure>
                                        <div class="pdbl__slider pdbs">

                                        </div>
                                    </div>
                                </a-col>
                                <a-col :xs="24" :lg="14">
                                    <DetailsRight :product="renderData" />
                                </a-col>
                            </a-row>
                        </div>
                    </ProductDetailsWrapper>
                </a-modal>  -->
            </div>
        </figcaption>
    </ProductCard>
</template>
<style scoped scss></style>
