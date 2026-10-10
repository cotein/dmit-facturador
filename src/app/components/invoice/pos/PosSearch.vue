<template>
    <div class="pos-surface pos-search" data-zone="search" @keydown="onKeydown">
        <label class="pos-search__label" for="pos-search-input">Buscar producto</label>

        <div class="pos-search__row">
            <span class="pos-search__icon" aria-hidden="true"><SearchOutlined /></span>

            <a-input
                id="pos-search-input"
                ref="inputRef"
                v-model:value="term"
                class="pos-search__input"
                data-testid="pos-search-input"
                autocomplete="off"
                allow-clear
                placeholder="Nombre o código (por ejemplo YER1000)"
                :aria-expanded="showPanel"
                :aria-activedescendant="activeOptionId"
                role="combobox"
                aria-autocomplete="list"
                aria-controls="pos-search-results"
                autofocus
                @focus="showPanel = term.trim() !== ''"
                @blur="onBlur"
            />

            <a-spin v-if="isLoading" class="pos-search__spinner" size="small" />
        </div>

        <ul class="pos-search__hint">
            <li v-for="shortcut in searchHints" :key="shortcut.id">
                <kbd v-for="key in shortcut.keys" :key="key">{{ key }}</kbd>
                <span>{{ shortcut.hint }}</span>
            </li>
        </ul>

        <!-- Resultados: se despliegan abajo mientras escribís, sin abrir ninguna ventana -->
        <ul
            v-if="showPanel && results.length > 0"
            id="pos-search-results"
            ref="resultsRef"
            class="pos-results"
            role="listbox"
            aria-label="Resultados de la búsqueda"
        >
            <li
                v-for="(product, index) in results"
                :id="optionId(index)"
                :key="product.id"
                class="pos-result"
                :class="{ 'is-active': index === activeIndex }"
                role="option"
                :aria-selected="index === activeIndex"
                data-testid="pos-result"
                @mouseenter="activeIndex = index"
                @mousedown.prevent="addProduct(product)"
            >
                <span class="pos-result__name">
                    <template v-for="(part, partIndex) in highlightParts(product.name, term)" :key="partIndex">
                        <mark v-if="part.match">{{ part.text }}</mark>
                        <template v-else>{{ part.text }}</template>
                    </template>
                </span>

                <span class="pos-result__price money" data-testid="pos-result-price">{{
                    formatPrice(priceFor(product))
                }}</span>

                <span class="pos-result__meta">
                    <span v-if="product.code" class="pos-result__code">
                        Código:
                        <template v-for="(part, partIndex) in highlightParts(product.code, term)" :key="partIndex">
                            <mark v-if="part.match">{{ part.text }}</mark>
                            <template v-else>{{ part.text }}</template>
                        </template>
                    </span>
                    <span v-else class="pos-result__code">Sin código</span>
                    <span v-if="categoryNamesFor(product).length">{{ categoryNamesFor(product).join(' › ') }}</span>
                </span>
            </li>
        </ul>

        <!-- Cargando catálogo -->
        <div v-else-if="showPanel && isLoading" class="pos-search__message">
            <a-spin size="small" />
            <div>
                <div class="pos-search__message-title">Buscando…</div>
            </div>
        </div>

        <!-- Error de red: se nombra el problema y se ofrece reintentar -->
        <div v-else-if="errorMessage" class="pos-search__message pos-search__message--error" data-testid="pos-error">
            <WarningOutlined class="pos-search__icon" aria-hidden="true" />
            <div>
                <div class="pos-search__message-title">No pudimos buscar productos</div>
                <p class="pos-search__message-text">{{ errorMessage }}</p>
                <div class="pos-search__message-actions">
                    <a-button size="small" data-testid="pos-retry" @click="retrySearch">Reintentar</a-button>
                </div>
            </div>
        </div>

        <!-- Sin resultados -->
        <div v-else-if="showPanel && term.trim() !== ''" class="pos-search__message" data-testid="pos-no-results">
            <WarningOutlined class="pos-search__icon" aria-hidden="true" />
            <div>
                <div class="pos-search__message-title">No encontramos “{{ term.trim() }}” en el catálogo</div>
                <p class="pos-search__message-text">
                    Revisá el código: se busca por nombre y por código tal como está cargado en el producto.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { SearchOutlined, WarningOutlined } from '@ant-design/icons-vue';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { normalizeSearchText, usePosCatalogComposable } from '@/app/composables/invoice/usePosCatalogComposable';
import { usePosSaleComposable } from '@/app/composables/invoice/usePosSaleComposable';
import { usePosShortcuts } from '@/app/composables/invoice/usePosShortcuts';
import type { PosProduct } from '@/app/types/Product';

/**
 * Buscador del modo mostrador.
 *
 * Antes esto vivía adentro de un modal (`ModalSearchProduct`) que consultaba a la
 * API en cada tecla y sólo por nombre. Acá el campo está siempre visible arriba de
 * la lista de ítems, el catálogo se trae una vez y se filtra en memoria por nombre
 * **y por código** (que es lo que se tipea o se escanea), y el flujo completo es
 * tipear → Enter → siguiente ítem.
 */

const { CompanyGetter } = useCompanyComposable();
const { insertProductOnInvoiceTable, TotalComprobante } = useInvoiceComposable();
const { buildInvoiceLine, priceForProduct } = usePosSaleComposable();
const { POS_SHORTCUTS, announce } = usePosShortcuts();

/** Los atajos que se anticipan abajo del campo, tomados del mapa de teclas. */
const searchHints = POS_SHORTCUTS.filter((shortcut) =>
    ['focus-search', 'search-move', 'search-add', 'escape'].includes(shortcut.id),
);

const {
    categoryNamesFor,
    clear,
    dispose,
    errorMessage,
    isLoading,
    load,
    query,
    results,
    retry,
    runSearch,
    usesServerSearch,
} = usePosCatalogComposable();

const term = ref('');
const showPanel = ref(false);
const activeIndex = ref(-1);
const inputRef = ref<any>(null);
const resultsRef = ref<HTMLElement | null>(null);

/**
 * Mantiene el resultado resaltado dentro de la parte visible del panel.
 *
 * Ajusta sólo el scroll de la lista (por rects) y nunca el de la página: con más
 * productos de los que entran, el resaltado se iba por debajo del borde del panel y
 * desde el teclado parecía que las flechas no movían nada.
 */
const scrollActiveIntoView = () => {
    nextTick(() => {
        const list = resultsRef.value;
        const option = list?.querySelector<HTMLElement>(`#${optionId(activeIndex.value)}`);

        if (!list || !option) {
            return;
        }

        const listRect = list.getBoundingClientRect();
        const optionRect = option.getBoundingClientRect();

        if (optionRect.top < listRect.top) {
            list.scrollTop -= listRect.top - optionRect.top;
        } else if (optionRect.bottom > listRect.bottom) {
            list.scrollTop += optionRect.bottom - listRect.bottom;
        }
    });
};

const companyId = () => CompanyGetter.value?.id;

const optionId = (index: number) => `pos-search-option-${index}`;

const activeOptionId = computed(() => (activeIndex.value >= 0 ? optionId(activeIndex.value) : undefined));

const priceFor = (product: PosProduct) => priceForProduct(product) ?? 0;

const formatPrice = (value: number): string =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(value) || 0);

/** Parte el texto en coincidencia / no coincidencia para resaltar lo buscado. */
const highlightParts = (text: string, rawTerm: string): { text: string; match: boolean }[] => {
    const haystack = normalizeSearchText(text);
    const needle = normalizeSearchText(rawTerm);

    if (needle === '') {
        return [{ text, match: false }];
    }

    const at = haystack.indexOf(needle);

    if (at < 0) {
        return [{ text, match: false }];
    }

    return [
        { text: text.slice(0, at), match: false },
        { text: text.slice(at, at + needle.length), match: true },
        { text: text.slice(at + needle.length), match: false },
    ].filter((part) => part.text !== '');
};

watch(term, (value) => {
    showPanel.value = value.trim() !== '';
    runSearch(value, companyId());
});

watch(results, (rows) => {
    // El primer resultado queda seleccionado: tipear un código y dar Enter alcanza.
    activeIndex.value = rows.length > 0 ? 0 : -1;

    // Al cambiar la búsqueda, la lista vuelve arriba: si no, quedaba scrolleada del
    // término anterior y el primer resultado (el seleccionado) aparecía fuera de vista.
    nextTick(() => {
        if (resultsRef.value) {
            resultsRef.value.scrollTop = 0;
        }
    });
});

const focusSearch = () => {
    const input = inputRef.value?.input ?? inputRef.value?.$el?.querySelector?.('input');

    if (input) {
        input.focus();
        input.select?.();
    }
};

const clearSearch = () => {
    term.value = '';
    activeIndex.value = -1;
    showPanel.value = false;
    clear();
};

const addProduct = (product: PosProduct) => {
    const line = buildInvoiceLine(product);

    if (!line) {
        message.warning({
            content: `“${product.name}” no tiene precio cargado en ninguna lista de precios.`,
        });

        announce(`No se agregó ${product.name}: no tiene precio en ninguna lista.`);

        return;
    }

    insertProductOnInvoiceTable(line);

    // Se anuncia lo que entró y para dónde va la venta, para poder seguir sin mirar.
    announce(`Agregado: ${line.product.name} ×${line.quantity} · total ${formatPrice(TotalComprobante.value)}`);

    clearSearch();

    // El campo queda listo para el siguiente ítem sin perder el foco.
    nextTick(focusSearch);
};

const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        event.preventDefault();
        clearSearch();
        return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        if (results.value.length === 0) {
            return;
        }

        event.preventDefault();
        showPanel.value = true;

        const next =
            event.key === 'ArrowDown'
                ? Math.min(activeIndex.value + 1, results.value.length - 1)
                : Math.max(activeIndex.value - 1, 0);

        activeIndex.value = next;

        // Sin esto, con más resultados de los que entran en el panel, el resaltado
        // seguía bajando por fuera de la vista y parecía que las flechas no hacían nada.
        scrollActiveIntoView();

        return;
    }

    if (event.key === 'Enter') {
        event.preventDefault();

        const target = results.value[activeIndex.value] ?? results.value[0];

        if (target) {
            addProduct(target);
        }
    }
};

const onBlur = () => {
    // Se cierra con un pequeño retraso para que el mousedown de la opción llegue antes.
    window.setTimeout(() => {
        showPanel.value = false;
    }, 120);
};

const retrySearch = async () => {
    await retry(companyId());
};

/**
 * El listener global del mostrador (`/`, `F2`, `F12`, `Esc`, `F4`… ) vive en
 * `usePosShortcuts` y se instala una sola vez desde `PosLayout`: este componente
 * no registra nada en `window`, así que no hay forma de que queden dos.
 *
 * Acá sólo se escucha dentro del contenedor del buscador, donde `Esc` limpia el
 * campo y las flechas recorren los resultados; esos `keydown` se consumen
 * (`preventDefault`) y el handler global los respeta.
 */
onMounted(async () => {
    await load(companyId());

    nextTick(focusSearch);
});

onUnmounted(() => {
    dispose();
});

defineExpose({ focusSearch, usesServerSearch, query });
</script>
