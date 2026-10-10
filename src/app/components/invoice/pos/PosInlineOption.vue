<template>
    <div class="pos-inline" :data-testid="testId">
        <button
            v-if="!open"
            type="button"
            class="pos-inline__trigger"
            :data-action="actionName"
            :data-testid="`${testId}-trigger`"
            @click="start"
        >
            <PlusOutlined aria-hidden="true" />
            {{ triggerLabel }}
        </button>

        <div v-else class="pos-inline__form" :data-testid="`${testId}-form`">
            <!-- Sin alarmismo: es una aclaración de alcance, no un error. -->
            <p class="pos-inline__hint">
                Se usa en esta venta. Por ahora no queda guardado en el catálogo de la empresa.
            </p>

            <label class="pos-inline__field">
                <span class="pos-inline__label">{{ nameLabel }}</span>
                <a-input
                    ref="nameRef"
                    v-model:value="name"
                    size="small"
                    :maxlength="60"
                    :placeholder="placeholder"
                    :data-testid="`${testId}-name`"
                    @keydown.enter.prevent="confirm"
                />
            </label>

            <label v-if="withDays" class="pos-inline__field">
                <span class="pos-inline__label">Días para el vencimiento de pago</span>
                <a-input-number
                    v-model:value="days"
                    size="small"
                    :min="0"
                    :max="365"
                    :precision="0"
                    style="width: 100%"
                    :data-testid="`${testId}-days`"
                    @keydown.enter.prevent="confirm"
                />
            </label>

            <div class="pos-inline__actions">
                <a-button
                    size="small"
                    type="primary"
                    :disabled="!canConfirm"
                    :data-testid="`${testId}-submit`"
                    @click="confirm"
                >
                    Usar en esta venta
                </a-button>
                <a-button size="small" :data-testid="`${testId}-cancel`" @click="cancel">Cancelar</a-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { usePosShortcuts } from '@/app/composables/invoice/usePosShortcuts';

/**
 * Alta al vuelo de una opción que todavía no está en el catálogo.
 *
 * Un botón "＋ …" que abre un campo para escribir el nombre y, al confirmar, deja la
 * opción creada y elegida en la venta. Lo usan la condición de venta y el modo de pago:
 * los dos tienen el mismo problema y la misma salida.
 *
 * El alta no persiste nada —el backend todavía no guarda estas dos— así que lo dice en
 * una línea, sin dramatizar, y el valor vive en `usePosInlineOptions` (memoria, esta
 * pantalla).
 */
type Props = {
    /** Texto del botón cerrado. */
    triggerLabel: string;
    /** Etiqueta del campo donde se escribe el nombre. */
    nameLabel: string;
    /** Ejemplo dentro del campo. */
    placeholder: string;
    /** Cómo se llama lo creado en el anuncio para lectores de pantalla. */
    announceLabel: string;
    /** `data-action` del botón que abre el campo. */
    actionName: string;
    /** Prefijo de los `data-testid` de este bloque. */
    testId: string;
    /** Pide además los días (la condición de venta los usa para el vencimiento). */
    withDays?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    withDays: false,
});

const emit = defineEmits<{
    (event: 'create', payload: { name: string; days: number }): void;
}>();

const { announce } = usePosShortcuts();

const open = ref(false);
const name = ref('');
const days = ref<number | null>(0);
const nameRef = ref<{ $el?: HTMLElement } | null>(null);

const canConfirm = computed(() => name.value.trim() !== '');

const focusName = () => {
    nextTick(() => {
        const host = nameRef.value?.$el;
        const input = host instanceof HTMLInputElement ? host : host?.querySelector('input');

        input?.focus();
    });
};

const start = () => {
    name.value = '';
    days.value = 0;
    open.value = true;

    focusName();
};

const cancel = () => {
    open.value = false;
    name.value = '';
    days.value = 0;
};

const confirm = () => {
    const clean = name.value.trim();

    if (clean === '') {
        focusName();

        return;
    }

    emit('create', { name: clean, days: Number(days.value ?? 0) });

    announce(`${props.announceLabel}: ${clean} (se usa en esta venta)`);

    open.value = false;
    name.value = '';
    days.value = 0;
};
</script>

<style scoped>
/* El componente se monta adentro del mostrador y también en el drawer, que se teleporta
   fuera de la página: por eso los colores van escritos, con los mismos tokens del tema
   (primario #8231D3, bordes #E3E6EF y #F1F2F6, gris #F8F9FB, texto #404040 y #585858). */
.pos-inline {
    margin-top: 6px;
}

.pos-inline__trigger {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    min-height: 24px;
    padding: 2px 10px;
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    color: #8231d3;
    background: #ffffff;
    border: 1px solid #e3e6ef;
    border-radius: 4px;
    cursor: pointer;
    transition: border-color 180ms cubic-bezier(0.16, 1, 0.3, 1);
}

.pos-inline__trigger:hover {
    border-color: #8231d3;
}

.pos-inline__trigger:focus-visible {
    outline: 2px solid #8231d3;
    outline-offset: 2px;
}

/* Ant apaga el outline de sus campos de texto: el anillo del sistema se repone acá. */
.pos-inline__form :deep(input:focus-visible) {
    outline: 2px solid #8231d3 !important;
    outline-offset: 2px;
}

.pos-inline__form {
    display: grid;
    gap: 8px;
    padding: 10px 12px;
    background: #f8f9fb;
    border: 1px solid #f1f2f6;
    border-radius: 4px;
}

.pos-inline__hint {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: #585858;
}

.pos-inline__field {
    display: grid;
    gap: 4px;
    cursor: text;
}

.pos-inline__label {
    font-size: 13px;
    font-weight: 600;
    color: #404040;
}

.pos-inline__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
}

@media (prefers-reduced-motion: reduce) {
    .pos-inline__trigger {
        transition: none;
    }
}
</style>
