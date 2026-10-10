<template>
    <a-row :gutter="16" @keydown="onKeydown">
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-item
                label="Producto"
                :labelCol="{ xs: { span: 24 }, sm: { span: 6 } }"
                :wrapperCol="{ xs: { span: 24 }, sm: { span: 18 } }"
            >
                <a-select
                    id="search-product-input"
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
                />
            </a-form-item>

            <p v-if="fetchError" class="search-product__error" data-testid="search-product-error">
                No pudimos buscar productos: {{ fetchError }}
                <a-button type="link" size="small" @click="retryFetch">Reintentar</a-button>
            </p>
        </a-col>

        <a-col v-if="props.viewPriceList" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-item
                label="Lista de precio"
                :labelCol="{ xs: { span: 24 }, sm: { span: 6 } }"
                :wrapperCol="{ xs: { span: 24 }, sm: { span: 18 } }"
            >
                <a-select v-model:value="price" style="width: 100%" @select="selectPriceList">
                    <a-select-option v-for="item in priceRows" :key="item.id" :value="item.id">
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
import { computed, nextTick, onMounted, ref } from 'vue';
import { getProducts } from '@/api/product/product-api';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import type { PosProduct, Product, ProductTransformer } from '@/app/types/Product';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { productPriceRows } from '@/app/composables/invoice/usePosCatalogComposable';
import { isMobile } from '@/app/helpers/isMobile';

const { openSearchProduct, productOnInvoiceTable, insertProductOnInvoiceTable } = useInvoiceComposable();

interface Props {
    viewPriceList: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    viewPriceList: false,
});

const aSelectProduct = ref<any>(null);

const price = ref();

const product = ref();

const { CompanyGetter } = useCompanyComposable();

const options = ref<Product[]>([]);

const fetchError = ref('');

/** Última búsqueda tipeada, para poder reintentar sin volver a escribir. */
const lastQuery = ref('');

/**
 * Filas de precio del producto elegido.
 *
 * La API las devuelve en `lista_de_precios`; algunos endpoints viejos devuelven los
 * objetos directamente dentro de `price_list`. Antes se leía sólo `price_list`, que
 * en el listado es un array de ids: el selector quedaba sin opciones y el producto
 * no se podía asignar.
 */
const selectedProductRaw = ref<PosProduct | null>(null);

const priceRows = computed(() => productPriceRows(selectedProductRaw.value));

const selectProduct = (id: number, product: ProductTransformer) => {
    selectedProductRaw.value = product as unknown as PosProduct;

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

    price.value = undefined;
};

const selectPriceList = (id: number) => {
    const row = priceRows.value.find((item) => Number(item.id) === Number(id));

    if (!row) {
        return;
    }

    productOnInvoiceTable.value.priceList = row;
    productOnInvoiceTable.value.unit = row.sale_price;
    productOnInvoiceTable.value.price_base = row.sale_price;
    productOnInvoiceTable.value.subtotal = row.sale_price * productOnInvoiceTable.value.quantity;
    productOnInvoiceTable.value.iva_import =
        (row.sale_price * productOnInvoiceTable.value.quantity * productOnInvoiceTable.value.iva.percentage) / 100;
    productOnInvoiceTable.value.total = productOnInvoiceTable.value.subtotal + productOnInvoiceTable.value.iva_import;
};

/**
 * Antes los errores de red se tragaban con un `.catch(() => {})`, así que una caída
 * de la API se veía igual que "no hay resultados". Ahora se muestran.
 */
const fetchProducts = async (name: string) => {
    if (!CompanyGetter.value) {
        return;
    }

    lastQuery.value = name;

    try {
        const { data } = (await getProducts(CompanyGetter.value.id, name)) || { data: [] };

        if (data) {
            options.value = data;
        }

        fetchError.value = '';
    } catch (e) {
        options.value = [];
        fetchError.value = e instanceof Error && e.message ? e.message : 'error de conexión con el servidor.';
    }
};

const retryFetch = () => {
    fetchProducts(lastQuery.value);
};

const isInserting = ref<boolean>(false);

const setInitalDataOnSelectComponents = () => {
    price.value = undefined;
    product.value = null;
    selectedProductRaw.value = null;
};

const cloneProductByInsert = () => {
    const clonedProduct = JSON.parse(JSON.stringify(productOnInvoiceTable.value));

    insertProductOnInvoiceTable(clonedProduct);

    openSearchProduct.value = false;

    setInitalDataOnSelectComponents();
};

/**
 * Enter agrega y Escape cierra.
 *
 * Antes esto era un `window.addEventListener('keydown', …)` registrado en
 * `onMounted` y nunca quitado: como el modal está montado dos veces y usa
 * `destroyOnClose`, cada apertura sumaba otro listener y un solo Enter agregaba el
 * producto varias veces (la cantidad quedaba inflada). Manejar el evento en el
 * scope del componente —con el `@keydown` del `a-row` de arriba— deja un solo camino.
 */
const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        event.preventDefault();

        openSearchProduct.value = false;

        setInitalDataOnSelectComponents();

        return;
    }

    if (event.key !== 'Enter' || isInserting.value || price.value === undefined) {
        return;
    }

    event.preventDefault();

    isInserting.value = true;

    cloneProductByInsert();

    setTimeout(() => {
        isInserting.value = false;
    }, 250);
};

/**
 * Foco garantizado en el campo de búsqueda.
 *
 * `autofocus` solo no alcanza: el modal monta su contenido después del primer
 * frame, así que el foco podía quedar en cualquier lado. `ModalSearchProduct` llama
 * a esto cuando termina de abrirse.
 */
const focusSearchInput = (): boolean => {
    const instance: any = aSelectProduct.value;

    instance?.focus?.();

    const input: HTMLInputElement | null =
        instance?.$el?.querySelector?.('input') ?? document.getElementById('search-product-input');

    if (!input) {
        return false;
    }

    input.focus();

    return document.activeElement === input;
};

defineExpose({ focusSearchInput });

onMounted(() => {
    nextTick(() => {
        aSelectProduct.value?.focus?.();
    });
});
</script>

<style scoped>
.search-product__error {
    margin: 0 0 12px;
    font-size: 14px;
    color: #ff0f0f;
}
</style>
