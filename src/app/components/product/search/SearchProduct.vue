<template>
    <a-row :gutter="16">
        <a-col :span="props.viewPriceList ? 14 : 24">
            <a-form-item label="Producto">
                <a-select
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
        <a-col v-if="props.viewPriceList" :span="10">
            <a-form-item label="Lista de precio">
                <a-select v-model:value="price" style="width: 100%" @select="selectPriceList">
                    <a-select-option v-for="item in priceList" :key="item" :value="item.id">
                        <span style="margin-right: 8px"
                            >{{ item.name }} - {{ $filters.formatCurrency(item.sale_price) }}</span
                        >
                    </a-select-option>
                </a-select>
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

const { priceList } = useSearchProductComposable();
const { openSearchProduct, productOnInvoiceTable, insertProductOnInvoiceTable } = useInvoiceComposable();

interface Props {
    viewPriceList: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    viewPriceList: false,
});

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

const selectPriceList = (id: number, _: any) => {
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

const closeModal = (event: KeyboardEvent) => {
    let isInserting = false;

    if (event.key === 'Enter' && !isInserting && price.value !== undefined) {
        event.preventDefault();

        const clonedProduct = JSON.parse(JSON.stringify(productOnInvoiceTable.value));

        insertProductOnInvoiceTable(clonedProduct);

        openSearchProduct.value = false;

        isInserting = true;

        priceList.value = [];

        setInitalDataOnSelectComponents();

        setTimeout(() => {
            isInserting = false;
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
});
</script>
