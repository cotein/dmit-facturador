<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { useQueryClient } from '@tanstack/vue-query';
import { CatalogPage } from '@/app/styles/catalogAdminStyle';
import { getCategories, saveCategory } from '@/api/category/category-api';
import { fetchProducts } from '@/api/product/product-api';
import { useCategoryComposable } from '@/app/composables/category/useCategoryComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { suggestCategoryCode } from '@/app/components/category/categoryCode';
import type { Category, CategoryRawData } from '@/app/types/Category';
import type { ListProductItem } from '@/app/types/Product';

const queryClient = useQueryClient();

const { CompanyGetter } = useCompanyComposable();
const { CategoriesGetter, rawCategories, transform_categories, setCategories } = useCategoryComposable();

const companyId = computed(() => CompanyGetter.value?.id ?? 0);

const formRef = ref();
const nameInput = ref();
const saving = ref(false);

const parentId = ref<number | null>(null);
const selectedKeys = ref<number[]>([]);
const expandedKeys = ref<number[]>([]);

const form = reactive({ name: '', code: '' });

/* -------------------------------------------------------------- productos */
const productCounts = ref<Map<number, number> | null>(null);

const collectIds = (node: Category): number[] => {
    const ids: number[] = [Number(node.id)];
    const walk = (current: Category) =>
        (current.children ?? []).forEach((child) => {
            ids.push(Number(child.id));
            walk(child);
        });

    walk(node);

    return ids;
};

const countProducts = (items: ListProductItem[]) => {
    const counts = new Map<number, number>();

    const walk = (tree: Category[]) =>
        tree.forEach((node) => {
            const ids = collectIds(node);
            const total = items.filter((item) =>
                (item.category ?? [])
                    .flatMap((entry) => (Array.isArray(entry) ? entry : [entry]))
                    .map(Number)
                    .some((id) => ids.includes(id)),
            ).length;

            counts.set(Number(node.id), total);
            walk(node.children ?? []);
        });

    walk(CategoriesGetter.value);

    return counts;
};

/* -------------------------------------------------------------- categorías */
const parentNode = computed<CategoryRawData | null>(() => {
    if (parentId.value === null) {
        return null;
    }

    return rawCategories.value.find((category) => category.id === parentId.value) ?? null;
});

const formTitle = computed(() => (parentNode.value ? 'Nueva subcategoría' : 'Nueva categoría'));

const parentLabel = computed(() => parentNode.value?.name ?? 'Sin categoría padre (queda en el primer nivel)');

const refreshCategories = async () => {
    if (!companyId.value) {
        return;
    }

    const { data } = await getCategories(companyId.value, 0);

    rawCategories.value = data;
    setCategories(transform_categories(data));
    queryClient.invalidateQueries({ queryKey: ['categories'], exact: false });
};

const applySuggestedCode = () => {
    form.code = suggestCategoryCode(parentNode.value, rawCategories.value);
};

const startNewRoot = () => {
    parentId.value = null;
    selectedKeys.value = [];
    form.name = '';
    applySuggestedCode();
};

const startSubcategory = (node: CategoryRawData) => {
    parentId.value = node.id;
    selectedKeys.value = [node.id];
    expandedKeys.value = Array.from(new Set([...expandedKeys.value, Number(node.id)]));
    form.name = '';
    applySuggestedCode();

    setTimeout(() => {
        (nameInput.value as { focus?: () => void } | undefined)?.focus?.();
    }, 0);
};

const onTreeSelect = (keys: (string | number)[]) => {
    const key = keys.length ? Number(keys[0]) : null;

    selectedKeys.value = key === null ? [] : [key];
    parentId.value = key;
    applySuggestedCode();
};

const codeAlreadyUsed = (code: string) =>
    rawCategories.value.some(
        (category) =>
            String(category.code ?? '')
                .trim()
                .toUpperCase() === code.trim().toUpperCase() && category.parent_id === parentId.value,
    );

const rules = reactive({
    name: [
        { required: true, message: 'Escribí el nombre de la categoría.', trigger: 'blur' },
        { max: 50, message: 'El nombre puede tener hasta 50 caracteres.', trigger: 'blur' },
    ],
    code: [
        { required: true, message: 'Escribí un código para la categoría.', trigger: 'blur' },
        { max: 20, message: 'El código puede tener hasta 20 caracteres.', trigger: 'blur' },
        {
            validator: (_rule: unknown, value: unknown) => {
                const code = String(value ?? '').trim();

                if (code && codeAlreadyUsed(code)) {
                    return Promise.reject('Ya existe una categoría con ese código. Probá con otro.');
                }

                return Promise.resolve();
            },
            trigger: 'blur',
        },
    ],
});

const submit = async () => {
    const valid = await formRef.value?.validate().catch(() => false);

    if (!valid) {
        return;
    }

    if (!companyId.value) {
        message.error('No pudimos identificar la empresa activa. Volvé a iniciar sesión.');
        return;
    }

    saving.value = true;

    try {
        const response = await saveCategory({
            active: true,
            attributes: null,
            code: form.code.trim(),
            company_id: companyId.value,
            id: 0,
            name: form.name.trim(),
            parent_id: parentId.value,
            slug: null,
        });

        const created = response.data as unknown as CategoryRawData | undefined;

        await refreshCategories();

        if (created?.id) {
            const createdId = Number(created.id);

            // La nueva categoría queda seleccionada en el árbol y como padre del
            // formulario: el árbol siempre muestra con qué se está trabajando.
            selectedKeys.value = [createdId];
            parentId.value = createdId;
            expandedKeys.value = Array.from(new Set([...expandedKeys.value, createdId]));
        }

        if (productCounts.value) {
            await refreshProductCounts();
        }

        message.success(`Categoría "${form.name.trim()}" creada.`);
        form.name = '';
        applySuggestedCode();
        formRef.value?.clearValidate();
    } catch (error) {
        message.error(
            `No pudimos crear la categoría. ${
                error instanceof Error && error.message ? error.message : 'Revisá los datos e intentá de nuevo.'
            }`,
        );
    } finally {
        saving.value = false;
    }
};

/** Devuelve null si no se pudieron traer: así no mostramos contadores en falso. */
const loadProductsForCounts = async (): Promise<ListProductItem[] | null> => {
    if (!companyId.value) {
        return null;
    }

    const response = await fetchProducts(companyId.value, 'list', 1, 200).catch(() => undefined);

    return response?.data?.data ?? null;
};

const refreshProductCounts = async () => {
    const items = await loadProductsForCounts();

    if (items) {
        productCounts.value = countProducts(items);
    }
};

onMounted(async () => {
    if (!companyId.value) {
        return;
    }

    await refreshCategories();
    applySuggestedCode();

    expandedKeys.value = CategoriesGetter.value.map((node) => Number(node.id));

    await refreshProductCounts();
});
</script>

<template>
    <CatalogPage class="catalog-page categories-page">
        <header class="page-head">
            <a-breadcrumb>
                <a-breadcrumb-item>
                    <router-link :to="{ name: 'Dashboard' }">Inicio</router-link>
                </a-breadcrumb-item>
                <a-breadcrumb-item>Categorías</a-breadcrumb-item>
            </a-breadcrumb>
            <h1 class="page-head__title">Categorías</h1>
            <p class="page-head__sub">
                El árbol muestra cómo está organizado el catálogo. Elegí un nodo para colgarle una subcategoría.
            </p>
        </header>

        <div class="catalog-surface">
            <div class="category-layout">
                <!-- Árbol: el centro de la pantalla -->
                <section class="form-section">
                    <h2 class="section-title">
                        Árbol de categorías
                        <span class="section-count num">({{ rawCategories.length }})</span>
                    </h2>
                    <p class="section-hint">
                        Seleccioná una categoría para usarla como padre, o creá una nueva en el primer nivel.
                    </p>

                    <a-button type="link" data-action="new-root-category" @click="startNewRoot">
                        Nueva categoría de primer nivel
                    </a-button>

                    <a-tree
                        v-if="CategoriesGetter.length"
                        show-line
                        :tree-data="CategoriesGetter"
                        :field-names="{ title: 'name', key: 'id', children: 'children' }"
                        :selected-keys="selectedKeys"
                        :expanded-keys="expandedKeys"
                        @select="onTreeSelect"
                        @expand="(keys: (string | number)[]) => (expandedKeys = keys.map(Number))"
                    >
                        <template #title="node">
                            <span class="tree-node">
                                <button
                                    type="button"
                                    class="tree-node__name"
                                    :data-action="`select-category-${node.id}`"
                                    :aria-label="`Usar ${node.name} como categoría padre`"
                                    @click.stop="startSubcategory(node)"
                                >
                                    {{ node.name }}
                                </button>
                                <span class="tree-node__code num">{{ node.code }}</span>
                                <span v-if="productCounts" class="tree-node__count num">
                                    {{ productCounts.get(Number(node.id)) ?? 0 }} prod.
                                </span>
                                <a-button
                                    size="small"
                                    class="tree-node__add"
                                    :data-action="`add-subcategory-${node.id}`"
                                    @click.stop="startSubcategory(node)"
                                >
                                    Agregar subcategoría
                                </a-button>
                            </span>
                        </template>
                    </a-tree>

                    <div v-else class="state-box">
                        <p class="state-box__title">Todavía no hay categorías</p>
                        <p class="state-box__text">
                            Creá la primera categoría con el formulario de la derecha; después vas a poder colgarle
                            subcategorías.
                        </p>
                    </div>
                </section>

                <!-- Alta -->
                <section class="form-section category-layout__aside">
                    <h2 class="section-title">{{ formTitle }}</h2>
                    <p class="section-hint">
                        La categoría padre sale del nodo que elijas en el árbol, no se escribe a mano.
                    </p>

                    <div class="parent-chip">
                        <span class="muted">Categoría padre:</span>
                        <strong>{{ parentLabel }}</strong>
                        <button
                            v-if="parentId !== null"
                            type="button"
                            class="parent-chip__clear"
                            data-action="clear-parent"
                            @click="startNewRoot"
                        >
                            Quitar
                        </button>
                    </div>

                    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" @submit.prevent>
                        <a-form-item label="Nombre" name="name" data-field="category-name">
                            <a-input
                                ref="nameInput"
                                v-model:value="form.name"
                                placeholder="Almacén seco"
                                autocomplete="off"
                                :maxlength="50"
                            />
                        </a-form-item>

                        <a-form-item
                            label="Código"
                            name="code"
                            data-field="category-code"
                            extra="Sirve para armar los códigos de los productos y de las subcategorías. Te lo proponemos, podés cambiarlo."
                        >
                            <a-input v-model:value="form.code" placeholder="1005" autocomplete="off" :maxlength="20" />
                        </a-form-item>

                        <div class="inline-create__actions">
                            <a-button type="primary" :loading="saving" data-action="save-category" @click="submit">
                                Crear categoría
                            </a-button>
                            <a-button type="link" :disabled="saving" @click="applySuggestedCode">
                                Volver al código sugerido
                            </a-button>
                        </div>
                    </a-form>
                </section>
            </div>
        </div>
    </CatalogPage>
</template>

<style scoped>
.tree-node__name {
    font-weight: 500;
}

.parent-chip {
    margin-bottom: 20px;
}
</style>
