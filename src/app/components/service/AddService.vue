<template>
  <div>
    <Main>
      <Cards>
        <template #title>
          <div class="ninjadash-card-title-wrap">
            <span class="ninjadash-card-title-text"> Ingresar servicio </span>
          </div>
        </template>
        <a-form
          name="ninjadash_validation-form"
          ref="addServiceFormRef"
          :model="productStore.product"
          :rules="rules"
          layout="vertical"
        >
          <a-row :gutter="31">
            <a-col :md="24" :xs="24" :sm="24">
              <a-form-item
                ref="name"
                label="Descripción del servicio"
                name="name"
                htmlFor="pppppppppppssssssssssssssssssssssssssss"
                help="aaaaaaaaaaaaaa"
              >
                <quill-editor
                  theme="snow"
                  placeholder="Servicio"
                  style="height: 15rem"
                  v-model:content="productStore.product.name"
                  contentType="html"
                ></quill-editor>
              </a-form-item>
            </a-col>
            <a-col :md="10" :xs="24" :sm="24">
              <a-form-item ref="code" label="Código" name="code">
                <a-input
                  v-model:value="productStore.product.code"
                  placeholder="Código del servicio"
                />
              </a-form-item>
            </a-col>
            <a-col :md="14" :xs="24" :sm="24">
              <a-form-item
                ref="category"
                label="Categoría a la que pertenece el producto"
                name="category"
              >
                <a-cascader
                  class="custom-format"
                  v-model:value="productStore.product.category"
                  :match-input-width="true"
                  :change-on-select="true"
                  :options="CategoriesGetter"
                  :show-search="{ filter }"
                  dropdownClassName="custom-drop-down"
                  placeholder="Buscar categoría"
                  :field-names="{ label: 'name', value: 'id', children: 'children' }"
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
        <a-button :loading="loading" type="primary" @click="submit"> Guardar </a-button>
      </Cards>
    </Main>
  </div>
</template>
<script setup lang="ts">
import { Main } from "@/app/styled";
import Cards from "@/components/cards/frame/CardsFrame.vue";
import { reactive, ref, onBeforeMount } from "vue";
import { useCategoryComposable } from "@/app/composables/category/useCategoryComposable";
import { useCompanyComposable } from "@/app/composables/company/useCompanyComposable";
import { useProductComposable } from "@/app/composables/product/useProductComposable";
import type { CategoryRawData } from "@/app/types/Category";
import { message } from "ant-design-vue";

const { productStore, saveProduct } = useProductComposable();
const { CompanyGetter } = useCompanyComposable();
const { CategoriesGetter, fetchCategories } = useCategoryComposable();

const filter: any["filter"] = (inputValue: string, path: Array<string>) => {
  return path.some((option) => {
    return option.name.toUpperCase().indexOf(inputValue.toUpperCase()) > -1;
  });
};

const loading = ref<boolean>(false);

const submit = async () => {
  loading.value = true;

  const payload = {
    company_id: CompanyGetter.value?.id,
    product: productStore.product,
  };

  const data = await saveProduct(payload)
    .catch((err) => {
      message.error({
        content: err.message,
      });
    })
    .finally(() => (loading.value = false));

  if (data) {
    message.success({
      content: "El servicio ha sido guardado correctamente.",
      duration: 3,
    });
    productStore.openModalViewImg = false;
    productStore.productInitialState();
  }
};
</script>
