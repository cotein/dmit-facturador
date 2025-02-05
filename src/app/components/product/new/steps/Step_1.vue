<script setup lang="ts">
import { reactive, ref, onBeforeMount } from 'vue';
import { useCategoryComposable } from '@/app/composables/category/useCategoryComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useProductComposable } from '@/app/composables/product/useProductComposable';
import type { CategoryRawData } from '@/app/types/Category';

const { product } = useProductComposable();
const { CompanyGetter } = useCompanyComposable();
const { CategoriesGetter, fetchCategories } = useCategoryComposable();

const step1FormRef = ref();

const rules = reactive({
    name: [
        {
            required: true,
            message: 'El nombre es requerido',
            trigger: 'blur',
        },
    ],
    code: [
        {
            required: true,
            message: 'El código es requerido',
            trigger: 'blur',
        },
    ],
    category: [
        {
            required: true,
            message: 'La categoría es requerida',
            trigger: 'blur',
        },
    ],
});

const filter: any['filter'] = (inputValue: string, path: Array<string>) => {
    return path.some((option) => {
        return option.name.toUpperCase().indexOf(inputValue.toUpperCase()) > -1;
    });
};

const validateForm = async () => {
    const isValid = await step1FormRef.value.validate().catch((error: any) => {
        console.log('error wwwwwwww', error);
        return false;
    });

    if (isValid) {
        return true;
    } else {
        return false;
    }
};

const findEmptyChildrenIds = (data: CategoryRawData[], parentId: number): CategoryRawData[] => {
    const childCategories = data.filter((category) => category.parent_id === parentId);

    if (childCategories.length === 0) {
        return data.filter((category) => category.id === parentId);
    }

    const allChildCategories = [];

    for (const childCategory of childCategories) {
        const subCategories = findEmptyChildrenIds(data, childCategory.id);
        allChildCategories.push(...subCategories);
    }
    return [
        //...childCategories,
        ...allChildCategories.filter((category, index, self) => self.findIndex((c) => c.id === category.id) === index),
    ];
};

defineExpose({ validateForm });

onBeforeMount(async () => {
    fetchCategories(CompanyGetter.value.id, 0);
});
</script>

<template>
    <div class="content--step">
        <a-form name="ninjadash_validation-form" ref="step1FormRef" :model="product" :rules="rules" layout="vertical">
            <a-row justify="center" align="middle" :gutter="31">
                <a-col :xs="24" :sm="12" :md="10">
                    <a-form-item ref="name" label="Nombre ó título del producto" name="name">
                        <a-input v-model:value="product.name" placeholder="Nombre" />
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :md="4">
                    <a-form-item ref="code" label="Código" name="code">
                        <a-input v-model:value="product.code" placeholder="Código" />
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12">
                    <a-form-item ref="category" label="Categoría a la que pertenece el producto" name="category">
                        <a-cascader
                            class="custom-format"
                            v-model:value="product.category"
                            :match-input-width="true"
                            :change-on-select="true"
                            :options="CategoriesGetter"
                            :show-search="{ filter }"
                            dropdownClassName="custom-drop-down"
                            placeholder="Buscar categoría"
                            :field-names="{
                                label: 'name',
                                value: 'id',
                                children: 'children',
                            }"
                            size="large"
                            multiple
                        >
                            <template #tagRender="data">
                                <a-tag :key="data.value" color="blue">{{ data.label }}</a-tag>
                            </template>
                        </a-cascader>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </div>
</template>

<style scoped>
@media (max-width: 600px) {
    .content--step {
        padding: 10px;
    }
    .ant-form-item {
        margin-bottom: 10px;
    }
}
</style>
@/app/types/Product
