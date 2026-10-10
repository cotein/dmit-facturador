<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import { useQueryClient } from '@tanstack/vue-query';
import { CatalogPage } from '@/app/styles/catalogAdminStyle';
import { fetchProducts, saveProduct, updateProduct } from '@/api/product/product-api';
import { getCategories } from '@/api/category/category-api';
import { useProductComposable } from '@/app/composables/product/useProductComposable';
import { usePriceListComposable } from '@/app/composables/priceList/usePriceListComposable';
import { useSaveCategoryMutationComposable } from '@/app/composables/category/useSaveCategoryMutationComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useCategoryComposable } from '@/app/composables/category/useCategoryComposable';
import { apiAfipGetIvas } from '@/api/afip/afip-iva';
import { useAfipIvaStore } from '@/app/store/afip/useAfipIvaStore';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import { AFIP_INSCRIPTION, AFIP_IVAS } from '@/app/types/Constantes';
import { suggestCategoryCode } from '@/app/components/category/categoryCode';
import { normalizeCategoryPaths, salePriceFor, toProductForm } from '@/app/components/product/productFormModel';
import type { ListProductItemWithCost } from '@/app/components/product/productFormModel';
import type { CategoryRawData } from '@/app/types/Category';
import type { PriceList } from '@/app/types/PriceList';

const route = useRoute();
const router = useRouter();
const queryClient = useQueryClient();

const { CompanyGetter } = useCompanyComposable();
const { CategoriesGetter, rawCategories, transform_categories, setCategories } = useCategoryComposable();
const { IvasGetter } = storeToRefs(useAfipIvaStore());
const { setIvasAction } = useAfipIvaStore();

const { product, products, productInitialState } = useProductComposable();

const companyId = computed(() => CompanyGetter.value?.id ?? 0);

const { PriceListGetter, fetchPriceList, mutateAsync: createPriceListAsync } = usePriceListComposable(companyId.value);

const { mutateAsync: createCategoryAsync } = useSaveCategoryMutationComposable(companyId.value);

const formRef = ref();

const editId = computed(() => {
    const id = Number(route.params.id);

    return Number.isFinite(id) && id > 0 ? id : null;
});

const isEditing = computed(() => editId.value !== null);
const saveLabel = computed(() => (isEditing.value ? 'Guardar cambios' : 'Guardar producto'));
const pageTitle = computed(() => (isEditing.value ? 'Editar producto' : 'Nuevo producto'));

const describeError = (error: unknown): string => {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    return 'Revisá los datos e intentá de nuevo.';
};

/* -------------------------------------------------------------------------- */
/* Impuesto                                                                    */
/* -------------------------------------------------------------------------- */

const ivaZeroPercent = computed(
    () =>
        CompanyGetter.value?.inscription_id === AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO ||
        CompanyGetter.value?.inscription_id === AFIP_INSCRIPTION.IVA_SUJETO_EXENTO,
);

watch(ivaZeroPercent, (isZero) => {
    if (isZero) {
        product.value.iva = AFIP_IVAS.AFIP_ID_CERO;
    }
});

const ivaLabel = computed(
    () => IvasGetter.value.find((iva) => Number(iva.value) === Number(product.value.iva))?.label ?? '',
);

/**
 * Las alícuotas se piden de forma imperativa: el composable de AFIP sólo
 * consulta si ya hay caché, así que en una sesión nueva quedaba vacío.
 */
const loadIvas = async () => {
    if (IvasGetter.value.length) {
        return;
    }

    const ivas = await apiAfipGetIvas().catch(() => undefined);

    if (ivas?.length) {
        setIvasAction(ivas);
    }
};

/* -------------------------------------------------------------------------- */
/* Categorías                                                                  */
/* -------------------------------------------------------------------------- */

const categoryFilter = (inputValue: string, path: CategoryRawData[]): boolean =>
    path.some(
        (option) =>
            String(option?.name ?? '')
                .toUpperCase()
                .indexOf(inputValue.toUpperCase()) > -1,
    );

const categoryNames = computed(() => {
    const names = new Map<number, string>();
    rawCategories.value.forEach((category) => names.set(category.id, category.name));

    return names;
});

const selectedCategoryLabel = computed(() => {
    const paths = product.value.category;

    if (!paths.length) {
        return '';
    }

    return paths
        .map((path) => categoryNames.value.get(Number(path[path.length - 1])) ?? '')
        .filter(Boolean)
        .join(', ');
});

const creatingCategory = ref(false);
const savingCategory = ref(false);
const newCategory = reactive({ name: '', code: '' });

const refreshCategories = async () => {
    const id = companyId.value;

    if (!id) {
        return;
    }

    const { data } = await getCategories(id, 0);

    rawCategories.value = data;
    setCategories(transform_categories(data));
    queryClient.invalidateQueries({ queryKey: ['categories'], exact: false });
};

const openCategoryCreator = () => {
    creatingCategory.value = true;
    newCategory.name = '';
    newCategory.code = suggestCategoryCode(null, rawCategories.value);
};

const cancelCategoryCreator = () => {
    creatingCategory.value = false;
    newCategory.name = '';
    newCategory.code = '';
};

const createCategory = async () => {
    const name = newCategory.name.trim();
    const code = newCategory.code.trim();

    if (!name) {
        message.error('Escribí el nombre de la categoría para crearla.');
        return;
    }

    if (!code) {
        message.error('Escribí el código de la categoría para crearla.');
        return;
    }

    if (!companyId.value) {
        message.error('No pudimos identificar la empresa activa. Volvé a iniciar sesión.');
        return;
    }

    savingCategory.value = true;

    try {
        const response = await createCategoryAsync({
            active: true,
            attributes: null,
            code,
            company_id: companyId.value,
            id: 0,
            name,
            parent_id: null,
            slug: null,
        });

        const created = response.data as unknown as CategoryRawData | undefined;

        await refreshCategories();

        if (created?.id) {
            product.value.category = [...product.value.category, [Number(created.id)]];
        }

        formRef.value?.clearValidate(['category']);
        message.success(`Categoría "${name}" creada.`);
        cancelCategoryCreator();
    } catch (error) {
        message.error(`No pudimos crear la categoría "${name}". ${describeError(error)}`);
    } finally {
        savingCategory.value = false;
    }
};

/* -------------------------------------------------------------------------- */
/* Listas de precios                                                           */
/* -------------------------------------------------------------------------- */

const priceLists = computed(() => PriceListGetter.value);

const isPriceListUsable = (priceList: PriceList) => priceList.active !== false;

const priceListKey = (priceList: PriceList) => Number(priceList.value ?? priceList.id);

const creatingPriceList = ref(false);
const savingPriceList = ref(false);
const newPriceList = reactive({ name: '', profit_percentage: 0 });

const costValue = computed(() => Number(product.value.cost) || 0);

const priceFor = (priceList: PriceList) => salePriceFor(costValue.value, Number(priceList.profit_percentage) || 0);

const selectedPriceLists = computed(() =>
    priceLists.value.filter((priceList) =>
        product.value.price_list.map(String).includes(String(priceListKey(priceList))),
    ),
);

const openPriceListCreator = () => {
    creatingPriceList.value = true;
    newPriceList.name = '';
    newPriceList.profit_percentage = 0;
};

const createPriceList = async () => {
    const name = newPriceList.name.trim();
    const percentage = Number(newPriceList.profit_percentage);

    if (!name) {
        message.error('Escribí el nombre de la lista de precios para crearla.');
        return;
    }

    if (!Number.isFinite(percentage) || percentage <= 0) {
        message.error('El porcentaje de ganancia tiene que ser mayor a cero.');
        return;
    }

    savingPriceList.value = true;

    try {
        await createPriceListAsync({ company_id: companyId.value, newPriceList: name, profit_percentage: percentage });

        // Recargamos para no depender del orden en que la API resuelve el alta.
        await fetchPriceList();

        const created = priceLists.value.find(
            (priceList) => String(priceList.label ?? priceList.name ?? '').toUpperCase() === name.toUpperCase(),
        );

        if (created) {
            product.value.price_list = [...product.value.price_list.map(Number), priceListKey(created)];
        }

        formRef.value?.clearValidate(['price_list']);
        message.success(`Lista de precios "${name}" creada.`);
        creatingPriceList.value = false;
    } catch (error) {
        message.error(`No pudimos crear la lista de precios. ${describeError(error)}`);
    } finally {
        savingPriceList.value = false;
    }
};

/* -------------------------------------------------------------------------- */
/* Validaciones                                                                */
/* -------------------------------------------------------------------------- */

const requiredList = (messageText: string) => ({
    validator: (_rule: unknown, value: unknown) =>
        Array.isArray(value) && value.length > 0 ? Promise.resolve() : Promise.reject(messageText),
    trigger: 'change' as const,
});

const rules = reactive({
    name: [{ required: true, message: 'Escribí el nombre del producto.', trigger: 'blur' }],
    code: [{ required: true, message: 'Escribí un código para identificarlo en el listado.', trigger: 'blur' }],
    category: [requiredList('Elegí a qué categoría pertenece el producto.')],
    quantity: [{ required: true, message: 'Indicá la cantidad inicial (si no tenés stock, dejá 0).', trigger: 'blur' }],
    critical_stock: [{ required: true, message: 'Indicá el stock crítico del producto.', trigger: 'blur' }],
    iva: [{ required: true, message: 'Elegí la alícuota de IVA que le corresponde.', trigger: 'change' }],
    cost: [
        {
            validator: (_rule: unknown, value: unknown) => {
                const cost = Number(value);

                if (!Number.isFinite(cost) || cost <= 0) {
                    return Promise.reject('Ingresá el costo del producto en pesos (tiene que ser mayor a cero).');
                }

                return Promise.resolve();
            },
            trigger: 'blur',
        },
    ],
    price_list: [requiredList('Tildá al menos una lista de precios: sin lista el producto no tiene precio de venta.')],
});

/* -------------------------------------------------------------------------- */
/* Carga y guardado                                                            */
/* -------------------------------------------------------------------------- */

const submitError = ref('');
const saving = ref(false);

const focusFirstError = () => {
    const control = document.querySelector(
        '[data-field="name"] input, [data-field="code"] input, [data-field="cost"] input',
    );

    if (control instanceof HTMLElement) {
        control.focus();
    }
};

const applyProduct = (item: ListProductItemWithCost) => {
    product.value = toProductForm(item);

    if (ivaZeroPercent.value) {
        product.value.iva = AFIP_IVAS.AFIP_ID_CERO;
    }
};

const loadProductForEdit = async (id: number) => {
    const cached = products.value.find((item) => item.id === id) as ListProductItemWithCost | undefined;

    if (cached) {
        applyProduct(cached);
        return;
    }

    const response = await fetchProducts(companyId.value, 'list', 1, 200).catch(() => undefined);
    const found = response?.data?.data?.find((item) => item.id === id) as ListProductItemWithCost | undefined;

    if (!found) {
        message.error('No encontramos el producto que querés editar. Volvé al listado e intentá de nuevo.');
        router.push({ name: 'ProductList' });
        return;
    }

    applyProduct(found);
};

const submit = async () => {
    submitError.value = '';

    const valid = await formRef.value?.validate().catch(() => false);

    if (!valid) {
        submitError.value = 'Revisá los campos marcados para poder guardar.';
        focusFirstError();
        return;
    }

    if (!companyId.value) {
        submitError.value = 'No pudimos identificar la empresa activa. Volvé a iniciar sesión.';
        return;
    }

    saving.value = true;

    const payload = {
        company_id: companyId.value,
        product: {
            ...product.value,
            category: normalizeCategoryPaths(product.value.category),
            price_list: product.value.price_list.map(Number),
        },
    };

    try {
        if (isEditing.value) {
            await updateProduct(payload as never);
            message.success('Los cambios del producto se guardaron.');
        } else {
            await saveProduct(payload as never);
            message.success('El producto se guardó.');
        }

        productInitialState();
        queryClient.removeQueries({ queryKey: ['products'] });

        router.push({ name: 'ProductList' });
    } catch (error) {
        submitError.value = describeError(error);
        message.error(`No pudimos guardar el producto. ${describeError(error)}`);
    } finally {
        saving.value = false;
    }
};

const cancel = () => {
    productInitialState();
    router.push({ name: 'ProductList' });
};

onMounted(async () => {
    // El formulario arranca siempre limpio: sin esto se arrastraba el producto
    // que se había abierto antes en modo edición.
    productInitialState();

    if (ivaZeroPercent.value) {
        product.value.iva = AFIP_IVAS.AFIP_ID_CERO;
    }

    if (!companyId.value) {
        return;
    }

    await Promise.all([loadIvas(), fetchPriceList(), refreshCategories()]);

    if (isEditing.value) {
        await loadProductForEdit(editId.value as number);
    }
});
</script>

<template>
    <CatalogPage class="catalog-page product-form">
        <header class="page-head">
            <a-breadcrumb>
                <a-breadcrumb-item>
                    <router-link :to="{ name: 'ProductList' }">Productos</router-link>
                </a-breadcrumb-item>
                <a-breadcrumb-item>{{ isEditing ? 'Editar' : 'Alta' }}</a-breadcrumb-item>
            </a-breadcrumb>
            <h1 class="page-head__title">{{ pageTitle }}</h1>
            <p class="page-head__sub">
                Cargá el producto en una sola pantalla. El precio de venta de cada lista se calcula solo.
            </p>
        </header>

        <div class="catalog-surface">
            <a-form ref="formRef" :model="product" :rules="rules" layout="vertical" @submit.prevent>
                <!-- Sección 1: identidad -->
                <section class="form-section">
                    <h2 class="section-title">Qué es</h2>
                    <p class="section-hint">
                        El nombre y el código son los que vas a ver en el listado y en las facturas.
                    </p>

                    <div class="field-grid field-grid--3">
                        <a-form-item label="Nombre del producto" name="name" data-field="name">
                            <a-input
                                v-model:value="product.name"
                                placeholder="Yerba mate 1 kg"
                                autocomplete="off"
                                :maxlength="100"
                            />
                        </a-form-item>

                        <a-form-item label="Código" name="code" data-field="code">
                            <a-input v-model:value="product.code" placeholder="YER1000" autocomplete="off" />
                        </a-form-item>

                        <a-form-item label="Categoría" name="category" data-field="category">
                            <a-cascader
                                v-model:value="product.category"
                                :options="CategoriesGetter"
                                :field-names="{ label: 'name', value: 'id', children: 'children' }"
                                :show-search="{ filter: categoryFilter }"
                                placeholder="Buscar categoría"
                                :change-on-select="true"
                                :match-input-width="true"
                                multiple
                                allow-clear
                            />
                        </a-form-item>
                    </div>

                    <div class="inline-create">
                        <a-button
                            v-if="!creatingCategory"
                            type="link"
                            data-action="open-category-creator"
                            @click="openCategoryCreator"
                        >
                            Crear categoría
                        </a-button>

                        <div v-else class="inline-create__panel">
                            <a-form-item label="Nombre de la categoría">
                                <a-input
                                    v-model:value="newCategory.name"
                                    placeholder="Almacén seco"
                                    autocomplete="off"
                                />
                            </a-form-item>
                            <a-form-item label="Código">
                                <a-input v-model:value="newCategory.code" placeholder="1005" autocomplete="off" />
                            </a-form-item>
                            <div class="inline-create__actions">
                                <a-button
                                    type="primary"
                                    :loading="savingCategory"
                                    data-action="create-category"
                                    @click="createCategory"
                                >
                                    Crear categoría
                                </a-button>
                                <a-button :disabled="savingCategory" @click="cancelCategoryCreator">Cancelar</a-button>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Sección 2: stock e impuesto -->
                <section class="form-section">
                    <h2 class="section-title">Stock e impuesto</h2>
                    <p class="section-hint">
                        Con qué cantidad arrancás, a partir de cuándo lo ves como stock crítico y qué IVA le
                        corresponde.
                    </p>

                    <div class="field-grid field-grid--3">
                        <a-form-item label="Cantidad inicial" name="quantity" data-field="quantity">
                            <a-input-number
                                v-model:value="product.quantity"
                                :min="0"
                                :precision="0"
                                :step="1"
                                style="width: 100%"
                            />
                        </a-form-item>

                        <a-form-item label="Stock crítico" name="critical_stock" data-field="critical_stock">
                            <a-input-number
                                v-model:value="product.critical_stock"
                                :min="0"
                                :precision="0"
                                :step="1"
                                style="width: 100%"
                            />
                        </a-form-item>

                        <a-form-item label="IVA del producto" name="iva" data-field="iva">
                            <a-select
                                v-model:value="product.iva"
                                :options="IvasGetter"
                                :disabled="ivaZeroPercent"
                                placeholder="Elegí la alícuota"
                                :not-found-content="null"
                            />
                            <p v-if="ivaZeroPercent" class="field-help field-help--note">
                                De acuerdo a su inscripción en ARCA sus artículos no gravan IVA.
                            </p>
                        </a-form-item>
                    </div>
                </section>

                <!-- Sección 3: precio y listas -->
                <section class="form-section">
                    <h2 class="section-title">Precio y listas de precios</h2>
                    <p class="section-hint">
                        El precio de venta de cada lista es el costo más el porcentaje de ganancia de esa lista.
                    </p>

                    <div class="field-grid field-grid--2">
                        <a-form-item label="Costo por unidad ($)" name="cost" data-field="cost">
                            <a-input-number
                                v-model:value="product.cost"
                                :min="0"
                                :precision="2"
                                :step="100"
                                style="width: 100%"
                                placeholder="0,00"
                            />
                        </a-form-item>
                    </div>

                    <a-form-item name="price_list" data-field="price_list" label="Listas de precios del producto">
                        <div v-if="priceLists.length" class="price-list-picker">
                            <a-checkbox-group v-model:value="product.price_list">
                                <a-checkbox
                                    v-for="priceList in priceLists"
                                    :key="priceListKey(priceList)"
                                    :value="priceListKey(priceList)"
                                >
                                    <span class="price-list-picker__body">
                                        <span class="price-list-picker__name">
                                            {{ priceList.label ?? priceList.name }}
                                            <template v-if="!isPriceListUsable(priceList)"> (inactiva)</template>
                                        </span>
                                        <span class="price-list-picker__pct">+{{ priceList.profit_percentage }} %</span>
                                        <span class="price-list-picker__price money">{{
                                            formatCurrency(priceFor(priceList))
                                        }}</span>
                                    </span>
                                </a-checkbox>
                            </a-checkbox-group>
                        </div>

                        <div v-else class="state-box">
                            <p class="state-box__title">Todavía no hay listas de precios</p>
                            <p class="state-box__text">
                                Una lista de precios define cuánto se le suma al costo. Sin al menos una lista el
                                producto no tiene precio de venta y no se puede facturar.
                            </p>
                        </div>
                    </a-form-item>

                    <div class="inline-create">
                        <a-button
                            v-if="!creatingPriceList"
                            type="link"
                            data-action="open-price-list-creator"
                            @click="openPriceListCreator"
                        >
                            Crear lista de precios
                        </a-button>

                        <div v-else class="inline-create__panel">
                            <a-form-item label="Nombre de la lista">
                                <a-input v-model:value="newPriceList.name" placeholder="Mayorista" autocomplete="off" />
                            </a-form-item>
                            <a-form-item label="Porcentaje de ganancia (%)">
                                <a-input-number
                                    v-model:value="newPriceList.profit_percentage"
                                    :min="0"
                                    :precision="2"
                                    :step="1"
                                    style="width: 100%"
                                />
                            </a-form-item>
                            <div class="inline-create__actions">
                                <a-button
                                    type="primary"
                                    :loading="savingPriceList"
                                    data-action="create-price-list"
                                    @click="createPriceList"
                                >
                                    Crear lista de precios
                                </a-button>
                                <a-button :disabled="savingPriceList" @click="creatingPriceList = false">
                                    Cancelar
                                </a-button>
                            </div>
                        </div>
                    </div>
                </section>
            </a-form>

            <!-- Barra de acciones fija: resumen de lo que se va a guardar -->
            <div class="action-bar">
                <div class="action-bar__summary">
                    <div class="action-bar__name">{{ product.name || 'Producto sin nombre' }}</div>
                    <div class="action-bar__meta">
                        <span>{{ selectedCategoryLabel || 'Sin categoría' }}</span>
                        <span class="action-bar__sep">·</span>
                        <span class="num">Costo {{ formatCurrency(costValue) }}</span>
                        <span class="action-bar__sep">·</span>
                        <span>IVA {{ ivaLabel || 'sin definir' }}</span>
                        <span class="action-bar__sep">·</span>
                        <span class="num">{{ selectedPriceLists.length }} lista(s) de precios</span>
                    </div>
                    <ul v-if="selectedPriceLists.length" class="action-bar__prices">
                        <li v-for="priceList in selectedPriceLists" :key="priceListKey(priceList)">
                            <span>{{ priceList.label ?? priceList.name }}</span>
                            <b>{{ formatCurrency(priceFor(priceList)) }}</b>
                        </li>
                    </ul>
                </div>

                <div class="action-bar__actions">
                    <span v-if="submitError" class="action-bar__error" role="alert">{{ submitError }}</span>
                    <a-button :disabled="saving" @click="cancel">Cancelar</a-button>
                    <a-button type="primary" :loading="saving" data-action="save-product" @click="submit">
                        {{ saveLabel }}
                    </a-button>
                </div>
            </div>
        </div>
    </CatalogPage>
</template>
