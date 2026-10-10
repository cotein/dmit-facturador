<template>
    <li
        class="pos-line"
        data-testid="pos-line"
        :data-pos-line="index"
        role="listitem"
        tabindex="0"
        :aria-label="lineLabel"
        @keydown="onLineKeydown"
        @focusin="onLineFocusIn"
    >
        <div class="pos-line__head">
            <span class="pos-line__index" aria-hidden="true">{{ index + 1 }}</span>
            <div>
                <div class="pos-line__name">{{ line.product.name }}</div>
                <p class="pos-line__meta">
                    <span v-if="productCode" class="pos-result__code">Código: {{ productCode }}</span>
                    <span>IVA {{ line.iva.name }}</span>
                    <span v-if="line.priceList">{{ line.priceList.name }}</span>
                </p>
            </div>
        </div>

        <div class="pos-line__amount">
            <span class="pos-line__total" data-testid="pos-line-total">{{ formatCurrency(line.total) }}</span>
            <span class="pos-line__detail">
                Subtotal {{ formatCurrency(line.subtotal) }} · IVA {{ formatCurrency(line.iva_import) }}
            </span>
        </div>

        <div class="pos-line__controls">
            <label class="pos-field pos-field--pricelist">
                <span class="pos-field__label">Lista de este ítem</span>
                <a-select
                    size="small"
                    :value="priceListId"
                    :options="priceListOptions"
                    style="width: 100%"
                    data-testid="pos-line-pricelist"
                    :aria-label="`Lista de precios de ${line.product.name}`"
                    @change="onPriceListChange"
                />
            </label>

            <label class="pos-field pos-field--unit">
                <span class="pos-field__label">Precio unitario</span>
                <input
                    class="pos-input"
                    type="text"
                    inputmode="numeric"
                    :value="unitAsText"
                    data-testid="pos-line-unit"
                    :aria-label="`Precio unitario de ${line.product.name}`"
                    @focus="selectText"
                    @keypress="onlyNumeric"
                    @input="onUnit"
                />
            </label>

            <div class="pos-field">
                <span class="pos-field__label">Cantidad</span>
                <div class="pos-qty">
                    <button
                        type="button"
                        class="pos-qty__btn"
                        data-testid="pos-line-minus"
                        :disabled="Number(line.quantity) <= 1"
                        :aria-label="`Restar una unidad de ${line.product.name}`"
                        @click="decrease"
                    >
                        −
                    </button>
                    <input
                        ref="quantityInput"
                        class="pos-qty__input"
                        type="text"
                        inputmode="numeric"
                        :value="line.quantity"
                        data-testid="pos-line-qty"
                        :aria-label="`Cantidad de ${line.product.name}`"
                        @focus="selectText"
                        @keypress="onlyNumericInputEvent"
                        @input="onQuantity"
                        @change="announceQuantity"
                    />
                    <button
                        type="button"
                        class="pos-qty__btn"
                        data-testid="pos-line-plus"
                        :aria-label="`Sumar una unidad de ${line.product.name}`"
                        @click="increase"
                    >
                        +
                    </button>
                </div>
            </div>

            <label class="pos-field pos-field--discount">
                <span class="pos-field__label">Descuento</span>
                <input
                    class="pos-input"
                    type="text"
                    inputmode="numeric"
                    :value="discountAsText"
                    data-testid="pos-line-discount"
                    :aria-label="`Descuento de ${line.product.name}`"
                    @focus="selectText"
                    @keypress="onlyNumeric"
                    @input="onDiscount"
                />
            </label>

            <button
                type="button"
                class="pos-line__remove"
                data-testid="pos-line-remove"
                :aria-label="`Quitar ${line.product.name} del ticket`"
                @click="onRemoveClick"
            >
                <DeleteOutlined />
            </button>
        </div>
    </li>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { message } from 'ant-design-vue';
import { DeleteOutlined } from '@ant-design/icons-vue';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import { onlyNumeric, onlyNumericInputEvent, selectText } from '@/app/helpers/onlyNumbers';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { findCatalogProduct, priceRowListId } from '@/app/composables/invoice/usePosCatalogComposable';
import { recalcLine, usePosSaleComposable } from '@/app/composables/invoice/usePosSaleComposable';
import { focusTicketLine } from '@/app/composables/invoice/usePosFocus';
import { usePosShortcuts } from '@/app/composables/invoice/usePosShortcuts';

/**
 * Línea del ticket de mostrador.
 *
 * Todo se edita en la misma fila, sin abrir nada: la lista de precios sólo de esta
 * línea, el precio unitario, la cantidad con − / + y un campo, y el descuento.
 * Cualquier cambio recalcula el subtotal, el IVA y el total de la línea, y con eso
 * el total del panel, que lee los mismos totales del store.
 *
 * Con el teclado, la línea misma es el control: se lleva el foco (`tabindex`), se
 * recorre con las flechas, cambia la cantidad con `+`/`−`, se quita con `Supr` y
 * entra a editar la cantidad con `Enter`. Adentro de un campo las teclas siguen
 * siendo del campo: los atajos de la línea sólo actúan cuando el foco está en el
 * contenedor (`event.target === event.currentTarget`).
 */

type Props = {
    index: number;
};

const props = defineProps<Props>();

const { invoiceTableData } = useInvoiceComposable();
const { linePriceListOptions, setLinePriceList } = usePosSaleComposable();
const { announce, setTicketFocusIndex } = usePosShortcuts();

const quantityInput = ref<HTMLInputElement | null>(null);

const line = computed(() => invoiceTableData.value[props.index]);

const priceListOptions = computed(() => linePriceListOptions(line.value));

const priceListId = computed(() => {
    const row = line.value?.priceList;

    return row ? priceRowListId(row) : undefined;
});

const productCode = computed(() => findCatalogProduct(line.value?.product.id)?.code ?? '');

const unitAsText = computed(() => String(Number(line.value?.unit ?? 0)));
const discountAsText = computed(() => String(Number(line.value?.discount ?? 0)));

/** Lo que se lee al enfocar la línea: producto, cantidad, unitario y subtotal. */
const lineLabel = computed(() => {
    const current = line.value;

    if (!current) {
        return '';
    }

    return [
        current.product.name,
        `cantidad ${current.quantity}`,
        `precio unitario ${formatCurrency(Number(current.unit))}`,
        `subtotal ${formatCurrency(Number(current.subtotal))}`,
        'Enter edita la cantidad, Supr la quita',
    ].join(', ');
});

const announceQuantity = () => {
    const current = line.value;

    if (!current) {
        return;
    }

    announce(`${current.product.name}: cantidad ${current.quantity} · ${formatCurrency(Number(current.total))}`, {
        coalesce: true,
    });
};

const increase = () => {
    line.value.quantity = Number(line.value.quantity) + 1;
    recalcLine(line.value);
    announceQuantity();
};

const decrease = () => {
    if (Number(line.value.quantity) <= 1) {
        announce(`La cantidad mínima es 1 en ${line.value.product.name}.`, { coalesce: true });

        return;
    }

    line.value.quantity = Number(line.value.quantity) - 1;
    recalcLine(line.value);
    announceQuantity();
};

/** `Enter` con el foco en la línea: se edita la cantidad ahí mismo. */
const focusQuantityInput = () => {
    const input = quantityInput.value;

    if (input) {
        input.focus();
        input.select();
    }
};

const onLineFocusIn = () => {
    // La última línea que tuvo foco es a la que vuelve F8.
    setTicketFocusIndex(props.index);
};

/**
 * Teclas de la línea cuando el foco está en el contenedor.
 *
 * Es un mapa y no un `switch` para que sumar una tecla sea una línea.
 */
const LINE_KEYS: Record<string, (() => void) | undefined> = {
    ArrowDown: () => {
        focusTicketLine(props.index + 1);
    },
    ArrowUp: () => {
        focusTicketLine(props.index - 1);
    },
    '+': increase,
    '-': decrease,
    Delete: () => remove(true),
    Enter: focusQuantityInput,
};

const onLineKeydown = (event: KeyboardEvent) => {
    // Adentro de un campo las teclas son del campo: los atajos son del contenedor.
    if (event.defaultPrevented || event.target !== event.currentTarget) {
        return;
    }

    const action = LINE_KEYS[event.key];

    if (!action) {
        return;
    }

    event.preventDefault();
    action();
};

const onQuantity = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);

    // Cantidad vacía o inválida: se restaura el valor vigente en vez de dejar la línea en NaN.
    if (!Number.isFinite(value) || value <= 0) {
        target.value = String(line.value.quantity);

        return;
    }

    line.value.quantity = value;
    recalcLine(line.value);
};

const onUnit = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);

    if (!Number.isFinite(value) || value < 0) {
        target.value = unitAsText.value;

        return;
    }

    line.value.unit = value;
    recalcLine(line.value);
};

const onDiscount = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);

    if (!Number.isFinite(value) || value < 0) {
        target.value = discountAsText.value;

        return;
    }

    line.value.discount = value;
    recalcLine(line.value);
};

const onPriceListChange = (value: number) => {
    if (!setLinePriceList(props.index, value)) {
        message.warning({
            content: `“${line.value.product.name}” no tiene precio cargado en esa lista.`,
        });

        return;
    }

    announce(
        `${line.value.product.name}: lista ${line.value.priceList?.name ?? ''} · ${formatCurrency(
            Number(line.value.unit),
        )}`,
    );
};

/**
 * Quita la línea y deja el foco donde el operador puede seguir.
 *
 * Si el foco estaba adentro de esta línea (se borró con `Supr` o con el botón),
 * el navegador lo devuelve al `body` y el teclado se pierde: se pasa a la línea que
 * ocupa el lugar, o al buscador si el ticket quedó vacío.
 *
 * @param restoreFocus sólo cuando lo pidió el teclado; con el mouse no se mueve nada.
 */
const remove = (restoreFocus = false) => {
    const current = line.value;

    if (!current) {
        return;
    }

    const removedIndex = props.index;
    const name = current.product.name;

    invoiceTableData.value.splice(removedIndex, 1);

    const remaining = invoiceTableData.value.length;

    announce(
        remaining === 0
            ? `Quitamos ${name} del ticket. El ticket quedó vacío.`
            : `Quitamos ${name} del ticket. Quedan ${remaining} ${remaining === 1 ? 'ítem' : 'ítems'}.`,
    );

    if (!restoreFocus) {
        return;
    }

    nextTick(() => {
        // Con el ticket vacío `focusTicketLine` cae solo al buscador.
        focusTicketLine(removedIndex);
    });
};

/** Un clic con `detail === 0` viene del teclado (Enter o Espacio sobre el botón). */
const onRemoveClick = (event: MouseEvent) => {
    remove(event.detail === 0);
};
</script>
