<script setup lang="ts">
import { reactive, ref, onBeforeMount } from 'vue';
import { usePriceListComposable } from '@/app/composables/priceList/usePriceListComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import ActivePriceList from './ActivePriceList.vue';
import IsActive from '../shared/IsActive.vue';
const { CompanyGetter } = useCompanyComposable();
const { PriceListGetter, mutateAsync, isLoading, fetchPriceList } = usePriceListComposable(CompanyGetter.value.id!);
import { message } from 'ant-design-vue';
import type { AxiosError } from 'axios';
const newPriceList = reactive({
    name: '',
    profit_percentage: 0,
});

const priceListFormRef = ref();

const validateMoney = (rule: any, value: any) => {
    const regex = /(^\d+.\d+$)|(^\d+$)/g;

    return new Promise((resolve, reject) => {
        if (value === '') reject('El porcentaje es requerido');
        if (value === 0) reject('El porcentaje debe ser mayor a cero');
        if (!regex.test(value)) reject('El valor debe ser de tipo moneda.');
        resolve(true);
    });
};

const rules = ref({
    name: [
        {
            required: true,
            message: 'El nombre es requerido',
            trigger: 'blur',
        },
        {
            min: 4,
            max: 50,
            message: 'El nombre debe contener entre 4 y 50 caracteres',
            trigger: 'blur',
        },
    ],
    profit_percentage: [
        {
            validator: validateMoney,
            trigger: 'blur',
        },
    ],
});

const resetForm = () => {
    priceListFormRef.value.resetFields();
};

const onSubmit = async (data: { company_id: number; newPriceList: string; profit_percentage: number }) => {
    const validate = await priceListFormRef.value.validate();
    if (validate) {
        await mutateAsync(data);
        resetForm();
    }
};

onBeforeMount(() => {
    fetchPriceList();
});
</script>

<template>
    <FormComponentsWrap>
        <a-row :gutter="25">
            <a-col :md="24" :xs="24">
                <sdCards title="Lista de precios" class="mb-25">
                    <BasicFormWrapper>
                        <a-form
                            name="ninjadash_textarea"
                            layout="vertical"
                            ref="priceListFormRef"
                            :model="newPriceList"
                            :rules="rules"
                        >
                            <a-row :gutter="30">
                                <a-col :lg="9" :xs="24" class="mb-25">
                                    <a-form-item ref="name" name="name" label="Nombre" has-feedback>
                                        <a-input v-model:value="newPriceList.name" size="large">
                                            <template #prefix>
                                                <unicon name="tag-alt" width="14"></unicon>
                                            </template>
                                        </a-input>
                                    </a-form-item>
                                </a-col>
                                <a-col :lg="9" :xs="24" class="mb-25">
                                    <a-form-item
                                        ref="profit_percentage"
                                        name="profit_percentage"
                                        label="Porcentaje de ganancia"
                                    >
                                        <a-input v-model:value="newPriceList.profit_percentage" size="large">
                                            <template #prefix>
                                                <unicon name="tag-alt" width="14"></unicon>
                                            </template>
                                        </a-input>
                                    </a-form-item>
                                </a-col>
                                <a-col :lg="3" :xs="24" class="mb-25">
                                    <a-button
                                        style="margin-top: 2rem"
                                        type="primary"
                                        size="large"
                                        html-type="button"
                                        :disabled="isLoading"
                                        :loading="isLoading"
                                        @click.prevent="
                                            onSubmit({
                                                company_id: CompanyGetter.id!,
                                                newPriceList: newPriceList.name,
                                                profit_percentage: newPriceList.profit_percentage,
                                            })
                                        "
                                        >Guardar
                                    </a-button>
                                </a-col>
                            </a-row>
                        </a-form>
                    </BasicFormWrapper>
                </sdCards>
            </a-col>
        </a-row>

        <a-row :gutter="25">
            <a-col :md="24" :xs="24">
                <sdCards title="Listado de listas de precios" class="mb-25">
                    <a-list
                        :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3, xxxl: 2 }"
                        :data-source="PriceListGetter"
                    >
                        <template #renderItem="{ item }">
                            <a-list-item>
                                {{ item.label }} - {{ item.profit_percentage }} % -
                                <ActivePriceList :priceList="item" />
                                <IsActive :active="item.active" />
                            </a-list-item>
                        </template>
                    </a-list>
                </sdCards>
            </a-col>
        </a-row>
    </FormComponentsWrap>
</template>
<style scoped>
.rounded-card {
    border-radius: 8px;
    max-height: 20rem;
    min-height: 20rem;
}
.price-list {
    max-height: 531px;
    min-height: 531px;
}
</style>
