<template>
    <div>
        <a-modal
            v-model:visible="openModalViewImg"
            title="Información del producto a ingresar"
            @ok="storeProduct"
            okText="Guardar producto"
            width="auto"
            :confirmLoading="loading"
        >
            <ProductInfo />
        </a-modal>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import ProductInfo from './ProductInfo.vue';
import { defineEmits } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { useProductComposable } from '@/app/composables/product/useProductComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { updateProduct } from '@/api/product/product-api';
import { saveProduct } from '@/api/product/product-api';

const route = useRoute();

const router = useRouter();

const emit = defineEmits(['initialStepsProductEvent']);

const { CompanyGetter } = useCompanyComposable();

const emitEventinitialStepsProductEvent = () => {
    emit('initialStepsProductEvent', true);
};

const loading = ref<boolean>(false);

const { product, openModalImg, openModalViewImg } = useProductComposable();

const storeProduct = async () => {
    loading.value = true;

    const payload = {
        company_id: CompanyGetter.value?.id,
        product: product.value,
    };

    try {
        if (route.path.startsWith('/productos/actualizar')) {
            await updateProduct(payload as any);
            message.success('Producto actualizado con éxito');
        } else {
            await saveProduct(payload as any);
            message.success('Producto guardado con éxito');
        }

        emitEventinitialStepsProductEvent();
    } catch (error) {
        message.error('Error al guardar el producto');
    } finally {
        loading.value = false;
        openModalImg();
        router.push('/productos/grilla');
    }
};
</script>
