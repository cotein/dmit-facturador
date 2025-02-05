<template>
    <a-row :gutter="16">
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-item
                label="Producto"
                :labelCol="{ xs: { span: 24 }, sm: { span: 6 } }"
                :wrapperCol="{ xs: { span: 24 }, sm: { span: 18 } }"
            >
                <a-select
                    ref="aSelectProduct"
                    v-model:value="product"
                    show-search
                    :show-arrow="false"
                    placeholder="Buscar Producto"
                    style="width: 100%"
                    :filter-option="false"
                    :not-found-content="null"
                    :options="options"
                    :field-names="{ label: 'name', value: 'id' }"
                    @search="fetchProducts"
                    @select="selectProduct"
                    autofocus
                >
                    <!-- <template v-if="state.fetching" #notFoundContent>
						<a-spin size="small" />
					</template> -->
                </a-select>
            </a-form-item>
        </a-col>
        <a-col v-if="props.viewPriceList" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-item
                label="Lista de precio"
                :labelCol="{ xs: { span: 24 }, sm: { span: 6 } }"
                :wrapperCol="{ xs: { span: 24 }, sm: { span: 18 } }"
            >
                <a-select v-model:value="price" style="width: 100%" @select="selectPriceList">
                    <a-select-option v-for="item in priceList" :key="item" :value="item.id">
                        <span style="margin-right: 8px"
                            >{{ item.name }} - {{ $filters.formatCurrency(item.sale_price) }}</span
                        >
                    </a-select-option>
                </a-select>
            </a-form-item>
        </a-col>
        <a-col v-if="isMobile" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="text-align: center">
            <a-form-item>
                <a-button type="primary" @click="cloneProductByInsert"> Asignar producto </a-button>
            </a-form-item>
        </a-col>
    </a-row>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getProducts } from '@/api/product/product-api';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useSearchProductComposable } from '@/app/composables/product/useSearchProductComposable';
import type { Product, ProductTransformer } from '@/app/types/Product';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { isMobile } from '@/app/helpers/isMobile';

const { priceList } = useSearchProductComposable();
const { openSearchProduct, productOnInvoiceTable, insertProductOnInvoiceTable } = useInvoiceComposable();

interface Props {
    viewPriceList: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    viewPriceList: false,
});

const aSelectProduct = ref<HTMLInputElement | null>(null);

const price = ref();

const product = ref();

const { CompanyGetter } = useCompanyComposable();

const options = ref<Product[]>([]);

const selectProduct = (id: number, product: ProductTransformer) => {
    productOnInvoiceTable.value.product.id = product.id;
    productOnInvoiceTable.value.product.name = product.name;
    productOnInvoiceTable.value.iva.id = product.iva.id;
    productOnInvoiceTable.value.iva.name = product.iva.name;
    productOnInvoiceTable.value.iva.percentage = product.iva.percentage;
    productOnInvoiceTable.value.iva.afip_code = product.iva.afip_code;
    productOnInvoiceTable.value.quantity = 1;
    productOnInvoiceTable.value.discount = 0;
    productOnInvoiceTable.value.aditional.percentage = 0;
    productOnInvoiceTable.value.aditional.value = 0;
    priceList.value = product.price_list;
};

const selectPriceList = (id: number) => {
    const index = priceList.value.findIndex((pl) => pl.id === id);

    productOnInvoiceTable.value.priceList = priceList.value[index];

    productOnInvoiceTable.value.unit = priceList.value[index].sale_price;
    productOnInvoiceTable.value.price_base = priceList.value[index].sale_price;
    productOnInvoiceTable.value.subtotal = priceList.value[index].sale_price * productOnInvoiceTable.value.quantity;
    productOnInvoiceTable.value.iva_import =
        (priceList.value[index].sale_price *
            productOnInvoiceTable.value.quantity *
            productOnInvoiceTable.value.iva.percentage) /
        100;
    productOnInvoiceTable.value.total = productOnInvoiceTable.value.subtotal + productOnInvoiceTable.value.iva_import;
};

const fetchProducts = async (name: string) => {
    if (!CompanyGetter.value) {
        return;
    }
    const { data } = (await getProducts(CompanyGetter.value.id, name).catch((e) => {})) || {
        data: [],
    };

    if (data) {
        options.value = data;
    }
};

const setInitalDataOnSelectComponents = () => {
    price.value = undefined;
    product.value = null;
};

const cloneProductByInsert = () => {
    const clonedProduct = JSON.parse(JSON.stringify(productOnInvoiceTable.value));

    insertProductOnInvoiceTable(clonedProduct);

    openSearchProduct.value = false;

    isInserting.value = true;

    priceList.value = [];

    setInitalDataOnSelectComponents();
};

const isInserting = ref<boolean>(false);

const closeModal = (event: KeyboardEvent) => {
    isInserting.value = false;
    if (event.key === 'Enter' && !isInserting.value && price.value !== undefined) {
        event.preventDefault();

        cloneProductByInsert();

        setTimeout(() => {
            isInserting.value = false;
        }, 250);
    }

    if (event.key === 'Escape') {
        event.preventDefault();

        openSearchProduct.value = false;

        setInitalDataOnSelectComponents();
    }
};

onMounted(() => {
    window.addEventListener('keydown', closeModal);

    if (aSelectProduct.value) {
        aSelectProduct.value.focus();
    }
});
</script>
