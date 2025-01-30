<template>
    <div>
        <sdPageHeader title="Actualizar producto" class="ninjadash-page-header-main">
        </sdPageHeader>
        <Main>
            <FormComponentsWrap>
                <a-row :gutter="20">
                    <a-col :md="24" :xs="24">
                        <sdCards title="Producto" class="mb-25 rounded-card">
                            <AddProduct />
                        </sdCards>
                    </a-col>
                </a-row>
            </FormComponentsWrap>
        </Main>
    </div>
</template>

<script setup lang="ts">
import { Main } from "../../styled";
import { FormComponentsWrap } from "@/views/forms/overview/Style";
import AddProduct from "@/app/components/product/new/AddProduct.vue";
import { useRoute } from "vue-router";
import { useProductComposable } from "@/app/composables/product/useProductComposable";
import type { ListProductItem } from "@/app/types/Product";
import { onMounted } from "vue";

const { product, products, selectedKeysInPriceListTransfer } = useProductComposable();

const route = useRoute();

onMounted(() => {
    const productId: number = Array.isArray(route.params.id)
        ? parseInt(route.params.id[0])
        : parseInt(route.params.id);

    // Encuentra el primer producto cuyo id coincida con productId y se detiene
    const foundProduct: ListProductItem | undefined = products.value.find(
        (product) => product.id === productId
    );
    console.log("🚀 ~ foundProduct:", foundProduct);
    product.value = foundProduct;
    selectedKeysInPriceListTransfer.value.push(foundProduct?.price_list[0]);
});
</script>
