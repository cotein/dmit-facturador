<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { CatalogPage } from '@/app/styles/catalogAdminStyle';
import { fetchProducts } from '@/api/product/product-api';
import { updatePriceList } from '@/api/priceList/price-list-api';
import { usePriceListComposable } from '@/app/composables/priceList/usePriceListComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import { salePriceFor } from '@/app/components/product/productFormModel';
import ActivePriceList from './ActivePriceList.vue';
import type { ListProductItem } from '@/app/types/Product';
import type { PriceList } from '@/app/types/PriceList';

/** Costo de referencia, sólo para mostrar el ejemplo en vivo. */
const REFERENCE_COST = 1000;

const router = useRouter();

const { CompanyGetter } = useCompanyComposable();
const { PriceListGetter, fetchPriceList, mutateAsync, isLoading } = usePriceListComposable(
    CompanyGetter.value?.id ?? 0,
);

const priceListFormRef = ref();

/**
 * El editor vive dentro de un v-for, así que el ref se registra a mano para
 * quedarse con una sola instancia en lugar de un arreglo.
 */
const editFormRef = ref();
const setEditFormRef = (instance: unknown) => {
    editFormRef.value = instance;
};

const newPriceList = reactive({ name: '', profit_percentage: 0 });

const editingId = ref<number | null>(null);
const savingEdit = ref(false);
const editForm = reactive({ name: '', profit_percentage: 0 });

const productCounts = ref<Map<number, number> | null>(null);

const referenceExample = computed(() => salePriceFor(REFERENCE_COST, Number(newPriceList.profit_percentage) || 0));

const keyOf = (priceList: PriceList) => Number(priceList.value ?? priceList.id);

const examplePrice = (priceList: PriceList) => salePriceFor(REFERENCE_COST, Number(priceList.profit_percentage) || 0);

const productsOf = (priceList: PriceList) => productCounts.value?.get(keyOf(priceList));

const loadProductCounts = async () => {
    if (!CompanyGetter.value?.id) {
        return;
    }

    const response = await fetchProducts(CompanyGetter.value.id, 'list', 1, 200).catch(() => undefined);
    const items: ListProductItem[] | undefined = response?.data?.data;

    if (!items) {
        return;
    }

    const counts = new Map<number, number>();

    items.forEach((item) => {
        (item.price_list ?? []).forEach((id) => {
            const key = Number(id);

            counts.set(key, (counts.get(key) ?? 0) + 1);
        });
    });

    productCounts.value = counts;
};

const validatePercentage = (_rule: unknown, value: unknown) => {
    const percentage = Number(value);

    if (!Number.isFinite(percentage) || percentage <= 0) {
        return Promise.reject('Escribí el porcentaje de ganancia (tiene que ser mayor a cero).');
    }

    return Promise.resolve();
};

const buildRules = () => ({
    name: [
        { required: true, message: 'Escribí el nombre de la lista de precios.', trigger: 'blur' },
        { max: 50, message: 'El nombre puede tener hasta 50 caracteres.', trigger: 'blur' },
    ],
    profit_percentage: [{ validator: validatePercentage, trigger: 'blur' }],
});

const rules = reactive(buildRules());
const editRules = reactive(buildRules());

const create = async () => {
    const valid = await priceListFormRef.value?.validate().catch(() => false);

    if (!valid) {
        return;
    }

    if (!CompanyGetter.value?.id) {
        message.error('No pudimos identificar la empresa activa. Volvé a iniciar sesión.');
        return;
    }

    const name = newPriceList.name.trim();

    try {
        await mutateAsync({
            company_id: CompanyGetter.value.id,
            newPriceList: name,
            profit_percentage: Number(newPriceList.profit_percentage),
        });

        await loadProductCounts();

        message.success(`La lista "${name}" quedó disponible.`);
        priceListFormRef.value?.resetFields();
        newPriceList.profit_percentage = 0;
    } catch (error) {
        message.error(
            `No pudimos crear la lista de precios. ${
                error instanceof Error && error.message ? error.message : 'Revisá los datos e intentá de nuevo.'
            }`,
        );
    }
};

const startEdit = (priceList: PriceList) => {
    editingId.value = keyOf(priceList);
    editForm.name = String(priceList.label ?? priceList.name ?? '');
    editForm.profit_percentage = Number(priceList.profit_percentage) || 0;
};

const cancelEdit = () => {
    editingId.value = null;
};

const saveEdit = async () => {
    const valid = await editFormRef.value?.validate().catch(() => false);

    if (!valid || editingId.value === null) {
        return;
    }

    const current = PriceListGetter.value.find((priceList) => keyOf(priceList) === editingId.value);

    if (!current) {
        message.error('No encontramos la lista que querés editar. Recargá la pantalla e intentá de nuevo.');
        return;
    }

    savingEdit.value = true;

    try {
        // La API hace strtoupper del nombre y necesita los cuatro campos del body.
        await updatePriceList({
            id: editingId.value,
            name: editForm.name.trim(),
            profit_percentage: Number(editForm.profit_percentage),
            active: current.active !== false,
        });

        await fetchPriceList();
        message.success('Los cambios de la lista de precios se guardaron.');
        editingId.value = null;
    } catch (error) {
        message.error(
            `No pudimos guardar los cambios. ${
                error instanceof Error && error.message ? error.message : 'Revisá los datos e intentá de nuevo.'
            }`,
        );
    } finally {
        savingEdit.value = false;
    }
};

onMounted(async () => {
    if (!CompanyGetter.value?.id) {
        return;
    }

    await fetchPriceList();
    await loadProductCounts();
});
</script>

<template>
    <CatalogPage class="catalog-page price-list-page">
        <header class="page-head">
            <a-breadcrumb>
                <a-breadcrumb-item>
                    <router-link :to="{ name: 'Dashboard' }">Inicio</router-link>
                </a-breadcrumb-item>
                <a-breadcrumb-item>Listas de precios</a-breadcrumb-item>
            </a-breadcrumb>
            <h1 class="page-head__title">Listas de precios</h1>
            <p class="page-head__sub">
                <span class="num">{{ PriceListGetter.length }}</span>
                {{ PriceListGetter.length === 1 ? 'lista' : 'listas' }} configuradas
            </p>
        </header>

        <div class="catalog-surface">
            <!-- Alta -->
            <section class="form-section">
                <h2 class="section-title">Nueva lista de precios</h2>
                <p class="section-hint">
                    El precio de venta de cada producto se calcula como su costo más este porcentaje de ganancia.
                </p>

                <a-form ref="priceListFormRef" :model="newPriceList" :rules="rules" layout="vertical" @submit.prevent>
                    <div class="field-grid field-grid--2">
                        <a-form-item label="Nombre" name="name" data-field="price-list-name">
                            <a-input
                                v-model:value="newPriceList.name"
                                placeholder="Mayorista"
                                autocomplete="off"
                                :maxlength="50"
                            />
                        </a-form-item>

                        <a-form-item
                            label="Porcentaje de ganancia (%)"
                            name="profit_percentage"
                            data-field="price-list-percentage"
                        >
                            <a-input-number
                                v-model:value="newPriceList.profit_percentage"
                                :min="0"
                                :precision="2"
                                :step="1"
                                style="width: 100%"
                                placeholder="30"
                            />
                        </a-form-item>
                    </div>

                    <p class="price-list-example">
                        <span>
                            Con un costo de {{ formatCurrency(REFERENCE_COST, false) }}, el precio de venta queda en
                        </span>
                        <b>{{ formatCurrency(referenceExample) }}</b>
                    </p>

                    <div class="inline-create__actions">
                        <a-button
                            type="primary"
                            :loading="isLoading"
                            :disabled="isLoading"
                            data-action="save-price-list"
                            @click="create"
                        >
                            Crear lista de precios
                        </a-button>
                    </div>
                </a-form>
            </section>

            <!-- Listado -->
            <section class="form-section">
                <h2 class="section-title">
                    Listas de la empresa
                    <span class="section-count num">({{ PriceListGetter.length }})</span>
                </h2>

                <ul v-if="PriceListGetter.length" class="price-list-rows">
                    <li
                        v-for="priceList in PriceListGetter"
                        :key="keyOf(priceList)"
                        class="price-list-row"
                        :data-price-list="keyOf(priceList)"
                    >
                        <template v-if="editingId === keyOf(priceList)">
                            <a-form
                                :ref="setEditFormRef"
                                class="price-list-editor"
                                :model="editForm"
                                :rules="editRules"
                                layout="vertical"
                                @submit.prevent
                            >
                                <a-form-item label="Nombre" name="name">
                                    <a-input v-model:value="editForm.name" :maxlength="50" autocomplete="off" />
                                </a-form-item>
                                <a-form-item label="Ganancia (%)" name="profit_percentage">
                                    <a-input-number
                                        v-model:value="editForm.profit_percentage"
                                        :min="0"
                                        :precision="2"
                                        :step="1"
                                        style="width: 100%"
                                    />
                                </a-form-item>
                                <p class="price-list-row__example">
                                    Precio de venta de ejemplo:
                                    <b>{{
                                        formatCurrency(
                                            salePriceFor(REFERENCE_COST, Number(editForm.profit_percentage) || 0),
                                        )
                                    }}</b>
                                </p>
                                <div class="price-list-row__actions">
                                    <a-button
                                        type="primary"
                                        :loading="savingEdit"
                                        :data-action="`save-price-list-${keyOf(priceList)}`"
                                        @click="saveEdit"
                                    >
                                        Guardar cambios
                                    </a-button>
                                    <a-button :disabled="savingEdit" @click="cancelEdit">Cancelar</a-button>
                                </div>
                            </a-form>
                        </template>

                        <template v-else>
                            <span class="price-list-row__name">{{ priceList.label ?? priceList.name }}</span>

                            <span class="price-list-row__pct">+{{ priceList.profit_percentage }} %</span>

                            <span class="price-list-row__example">
                                Costo {{ formatCurrency(REFERENCE_COST, false) }} →
                                <b>{{ formatCurrency(examplePrice(priceList)) }}</b>
                            </span>

                            <span v-if="productsOf(priceList) !== undefined" class="price-list-row__count num">
                                {{ productsOf(priceList) }}
                                {{ productsOf(priceList) === 1 ? 'producto' : 'productos' }}
                            </span>
                            <span v-else class="price-list-row__count">Sin datos de productos</span>

                            <div class="price-list-row__actions">
                                <ActivePriceList :price-list="priceList" @updated="loadProductCounts" />
                                <a-button
                                    :data-action="`edit-price-list-${keyOf(priceList)}`"
                                    @click="startEdit(priceList)"
                                >
                                    Editar
                                </a-button>
                            </div>
                        </template>
                    </li>
                </ul>

                <div v-else class="state-box">
                    <p class="state-box__title">Todavía no hay listas de precios</p>
                    <p class="state-box__text">
                        Una lista de precios define el porcentaje de ganancia que se le suma al costo. Es lo que le da
                        precio de venta a cada producto, así que conviene tenerla antes de cargar el primero.
                    </p>
                    <div class="state-box__actions">
                        <a-button
                            type="primary"
                            data-action="load-first-product"
                            @click="router.push({ name: 'AddProduct' })"
                        >
                            Cargar el primer producto
                        </a-button>
                    </div>
                </div>
            </section>
        </div>
    </CatalogPage>
</template>
