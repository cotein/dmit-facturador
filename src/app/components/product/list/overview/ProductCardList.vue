<script setup lang="ts">
import { ProductCard } from "../../Style";
import { computed, toRefs, ref } from "vue";
import { useProductComposable } from "@/app/composables/product/useProductComposable";
import AddProduct from "@/app/components/product/new/AddProduct.vue";

const props = defineProps({
    product_data: Object,
});

const { productsListSpinner, product } = useProductComposable();

const { product_data } = toRefs(props);

const renderData = computed(() => product_data?.value);

const visibleModal = ref<boolean>(false);

const openModal = () => {
    product.value = renderData;
    setTimeout(() => {
        visibleModal.value = true;
    }, 250);
};
</script>

<template>
    <div class="spin" v-if="productsListSpinner"><a-spin /></div>
    <ProductCard v-else class="list-view" :style="{ marginBottom: '20px' }">
        <div class="product-list">
            <a-row :gutter="15">
                <!-- <a-col :md="24" :lg="6" :xs="24">
                    <figure>
                        <img :src="$environment.VITE_SRC_ASSETS + '/img/products/2.png'" :alt="renderData.slug" />
                    </figure>
                </a-col> -->
                <a-col :md="24" :lg="12" :xs="24">
                    <div class="product-single-description">
                        <sdHeading class="product-single-title" as="h5">
                            <!-- <router-link
                                :to="`${matched[1].path}/ecommerce/productDetails/${renderData.id}`"
                                >{{ renderData.name }}</router-link
                            > -->
                            {{ renderData?.name }}
                        </sdHeading>
                        <p>
                            {{
                                renderData.description
                                    ? renderData.description
                                    : "Éste producto no tiene descripción"
                            }}
                        </p>
                    </div>
                </a-col>
                <a-col :md="24" :lg="6" :xs="24">
                    <div class="product-single-info">
                        <p>
                            <!-- <span class="product-single-price__new">${{ renderData.name }} </span> -->
                            <template v-if="renderData?.lista_de_precios.length">
                                <template
                                    v-for="(
                                        price_list, index
                                    ) in renderData.lista_de_precios"
                                    :key="index"
                                >
                                    <span class="">
                                        L. precio: {{ price_list.name }}
                                        {{
                                            $filters.formatCurrency(
                                                parseFloat(price_list.sale_price)
                                            )
                                        }}
                                    </span>

                                    <br />
                                </template>
                            </template>
                        </p>
                        <div class="product-single-action">
                            <!-- <button @click="goToUpdate">Editar</button> -->
                            <a-button @click="openModal"> Editar </a-button>
                            <a-modal
                                v-model:visible="visibleModal"
                                title="Editar informacion del producto"
                                width="auto"
                                class="custom-modal"
                                :closable="false"
                            >
                                <template #footer>
                                    <a-button key="back" @click="visibleModal = false">
                                        Cancelar
                                    </a-button>
                                </template>
                                <AddProduct />
                            </a-modal>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </div>
    </ProductCard>
</template>

<style scoped>
.custom-modal .ant-modal-mask {
    background-color: rgba(0, 0, 0, 0) !important;
}
</style>
