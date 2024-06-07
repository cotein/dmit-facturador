<template>
    <div>
        <a-steps :current="current">
            <a-step v-for="item in steps" :key="item.title" :title="item.content" />
        </a-steps>
        <div class="steps-content">
            <Step_1 v-show="current === 0" ref="step1Component" />
            <Step_2 v-show="current === 1" ref="step2Component" />
            <Step_3 v-show="current === 2" ref="step3Component" />
            <Step_4 v-show="current === 3" ref="step4Component" />
        </div>
        <div class="steps-action">
            <a-button
                v-if="current < steps.length - 1"
                type="primary"
                @click="next(nextButtonsStep[current].fnValidateForm)"
                >Siguiente</a-button
            >
            <a-button v-if="current == steps.length - 1" type="primary" @click="submit"> Guardar </a-button>
            <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">Anterior</a-button>
            <ProductModal v-on:initialStepsProductEvent="handleCustomEvent" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, onBeforeMount } from 'vue';
import { usePriceListComposable } from '@/app/composables/priceList/usePriceListComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useProductComposable } from '@/app/composables/product/useProductComposable';

import Step_1 from '@/app/components/product/new/steps/Step_1.vue';
import Step_2 from '@/app/components/product/new/steps/Step_2.vue';
import Step_3 from '@/app/components/product/new/steps/Step_3.vue';
import Step_4 from '@/app/components/product/new/steps/Step_4.vue';
import ProductModal from '../view/ProductModal.vue';

interface StepComponent {
    validateForm: () => void;
}

const { productStore } = useProductComposable();
const { CompanyGetter } = useCompanyComposable();
const { fetchPriceList } = usePriceListComposable(CompanyGetter.value.id);

const step1Component = ref<InstanceType<typeof Step_1> | null>(null);
const step2Component = ref<InstanceType<typeof Step_2> | null>(null);
const step3Component = ref<InstanceType<typeof Step_3> | null>(null);
const step4Component = ref<InstanceType<typeof Step_4> | null>(null);

const current = ref<number>(0);

const next = async (fn: Function): Promise<void> => {
    const result = await fn();

    if (result) {
        current.value++;
    }
};
const prev = () => {
    current.value--;
};

const handleCustomEvent = (data: boolean) => {
    if (data) {
        current.value = 0;
    }
};

const steps = [
    {
        title: 'Nombre y Categoría',
        content: 'Nombre y Categoría',
        component: Step_1,
        ref: 'step1Component',
    },
    {
        title: 'Completá la ficha técnica de tu producto',
        content: 'Completá la ficha técnica de tu producto',
        component: Step_2,
        ref: 'step2FormRef',
    },
    {
        title: 'Precio y listas de precios',
        content: 'Precio y listas de precios',
        component: Step_3,
        ref: 'step3FormRef',
    },
    {
        title: 'Agregar imágenes',
        content: 'Agregar imágenes',
        component: Step_4,
        ref: 'step3FormRef',
    },
];

const nextButtonsStep = [
    {
        index: 0,
        fnValidateForm: () => step1Component.value?.validateForm(),
    },
    {
        index: 1,
        fnValidateForm: () => step2Component.value?.validateForm(),
    },
    {
        index: 2,
        fnValidateForm: () => step3Component.value?.validateForm(),
    },
    /* {
		index: 3,
		fnValidateForm: () => step4Component.value?.validateForm(),
	}, */
];

const submit = async () => {
    productStore.openModalViewImg = !productStore.openModalViewImg;
};

onBeforeMount(() => {
    fetchPriceList();
});

onMounted(() => {});

onUnmounted(() => {
    productStore.productInitialState();
});
</script>
<style scoped>
.steps-content {
    margin-top: 16px;
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    min-height: 200px;
    text-align: center;
    padding-top: 80px;
    padding-left: 2rem;
    padding-right: 2rem;
}

.steps-action {
    margin-top: 24px;
}

[data-theme='dark'] .steps-content {
    background-color: #2f2f2f;
    border: 1px dashed #404040;
}
</style>
