<script setup lang="ts">
import { ref, onBeforeMount, watch, reactive, type UnwrapRef } from 'vue';
import { BasicFormWrapper } from '../../styled';
import { FormComponentsWrap } from '@/views/forms/overview/Style';
import { useSaveCategoryMutationComposable } from '@/app/composables/category/useSaveCategoryMutationComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import type { CategoryRawData } from '@/app/types/Category';
import { useCategoryComposable } from '@/app/composables/category/useCategoryComposable';

const { CompanyGetter } = useCompanyComposable();
const { mutateAsync, isLoading } = useSaveCategoryMutationComposable(CompanyGetter!.value.id);

const categoryFather: UnwrapRef<CategoryRawData> = reactive({
    name: '',
    code: '',
    slug: null,
    attributes: null,
    company_id: CompanyGetter.value.id,
    parent_id: null,
});

const value = ref<string[]>([]);
const isChildCategory = ref<boolean>(false);
const pathCodeCategory = ref<string>('');

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
    code: [
        {
            required: true,
            message: 'El código es requerido',
            trigger: 'blur',
        },
        {
            min: 4,
            max: 4,
            message: 'El código debe contener 4 caracteres',
            trigger: 'blur',
        },
    ],
});
const { fetchCategories, CategoriesGetter } = useCategoryComposable();

const categoryFormRef = ref();

const onSubmit = async (categoryFather: CategoryRawData) => {
    const validate = await categoryFormRef.value.validate().catch((error: any) => {
        console.log('error', error);
    });
    if (validate) {
        await mutateAsync(categoryFather);
        isChildCategory.value = false;
        value.value = [];
        resetForm();
    }
};

const resetForm = () => {
    categoryFormRef.value.resetFields();
};

const filter: any['filter'] = (inputValue: string, path: Array<string>) => {
    return path.some((option) => {
        return option.name.toUpperCase().indexOf(inputValue.toUpperCase()) > -1;
    });
};

onBeforeMount(() => {
    fetchCategories(CompanyGetter.value.id, 0);
});

const setPathCodeCategory = (value: Array<number>, selectedOptions: object): void => {
    console.log('🚀 ~ file: AddFatherCategory.vue:86 ~ setPathCodeCategory ~ value:', value, selectedOptions);
    let res: string = '';

    Object.values(selectedOptions).forEach((item, index) => {
        index === 0 ? (res = `${res} ${item.code}`) : (res = `${res}-${item.code}`);
    });

    categoryFather.parent_id = value[value.length - 1];

    pathCodeCategory.value = res;
};
</script>

<template>
    <FormComponentsWrap>
        <a-row :gutter="25">
            <a-col :md="16" :xs="24">
                <sdCards title="Categorías" class="mb-25 rounded-card">
                    <BasicFormWrapper>
                        <a-row :gutter="30" style="margin-bottom: 45px">
                            <a-col :span="8">
                                <span>Es categría hija</span>
                                <a-switch
                                    :disabled="CategoriesGetter.length === 0"
                                    v-model:checked="isChildCategory"
                                    style="margin-left: 15px"
                                    checked-children="SÍ"
                                    un-checked-children="NO"
                                />
                            </a-col>
                            <a-col :span="16">
                                <transition name="fade">
                                    <div v-if="isChildCategory">
                                        <a-cascader
                                            class="custom-format"
                                            v-model:value="value"
                                            :match-input-width="true"
                                            :change-on-select="true"
                                            :options="CategoriesGetter"
                                            :show-search="{ filter }"
                                            dropdownClassName="custom-drop-down"
                                            placeholder="Buscar categoría padre"
                                            :field-names="{ label: 'name', value: 'id', children: 'children' }"
                                            @change="setPathCodeCategory"
                                        />
                                    </div>
                                </transition>
                            </a-col>
                        </a-row>

                        <a-form
                            name="ninjadash_textarea"
                            layout="vertical"
                            ref="categoryFormRef"
                            :model="categoryFather"
                            :rules="rules"
                        >
                            <a-row :gutter="30">
                                <a-col :lg="9" :xs="24" class="mb-25">
                                    <a-form-item ref="name" name="name" label="Nombre" has-feedback>
                                        <a-input
                                            :placeholder="isChildCategory ? 'Categoría hija' : 'Categoría padre'"
                                            v-model:value="categoryFather.name"
                                        >
                                            <template #prefix>
                                                <unicon name="layer-group" width="14"></unicon>
                                            </template>
                                        </a-input>
                                    </a-form-item>
                                </a-col>
                                <a-col :lg="12" :xs="24" class="mb-25">
                                    <a-form-item name="code" ref="code" label="Código" has-feedback>
                                        <a-input
                                            placeholder="Código"
                                            v-model:value="categoryFather.code"
                                            :addon-before="isChildCategory ? pathCodeCategory : null"
                                        >
                                        </a-input>
                                    </a-form-item>
                                </a-col>
                                <a-col :lg="3" :xs="24" class="mb-25">
                                    <a-form-item>
                                        <a-button
                                            style="margin-top: 2.2rem"
                                            type="primary"
                                            html-type="button"
                                            :disabled="isLoading"
                                            :loading="isLoading"
                                            @click.prevent="onSubmit(categoryFather)"
                                            >Guardar</a-button
                                        >
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-form>
                    </BasicFormWrapper>
                </sdCards>
            </a-col>
            <a-col :md="8" :xs="24">
                <sdCards title="Listado de categorías Padre" class="mb-25 rounded-card">
                    <a-tag
                        style="margin-bottom: 3px"
                        :key="index"
                        color="blue"
                        v-for="(category, index) in CategoriesGetter"
                        >{{ category.name }}</a-tag
                    >
                </sdCards>
            </a-col>
        </a-row>

        <a-row :gutter="25">
            <a-col :md="24" :xs="24">
                <sdCards title="Árbol de categorías" class="mb-25 rounded-card">
                    <a-tree
                        show-line
                        :show-icon="true"
                        :tree-data="CategoriesGetter"
                        :field-names="{ title: 'name', key: 'id', children: 'children' }"
                    >
                    </a-tree>
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
.custom-format {
    width: 100%;
    height: 40px;
}
.custom-drop-down {
    width: 50%;
    margin-bottom: 0px;
    padding-bottom: 0px;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
@/app/types/Category
