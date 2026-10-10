<template>
    <div class="pos-modebar">
        <div class="pos-modebar__state">
            <span class="pos-modebar__badge" :class="{ 'pos-modebar__badge--normal': !mostradorMode }">
                {{ mostradorMode ? 'Modo mostrador' : 'Modo normal' }}
            </span>
            <span class="pos-modebar__text" data-testid="mode-description">{{ description }}</span>
        </div>

        <div class="pos-mode-switch" role="group" aria-label="Modo de facturación">
            <button
                type="button"
                class="pos-mode-switch__btn"
                data-action="mode-pos"
                :aria-pressed="mostradorMode"
                @click="setMostradorMode(true)"
            >
                Mostrador
            </button>
            <button
                type="button"
                class="pos-mode-switch__btn"
                data-action="mode-normal"
                :aria-pressed="!mostradorMode"
                @click="setMostradorMode(false)"
            >
                Normal
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMostradorModeComposable } from '@/app/composables/invoice/useMostradorModeComposable';

/**
 * Cambio de modo del facturador.
 *
 * Estaba detrás de `!isMobile` (`FormInvoice.vue`), así que desde el celular no se
 * podía ni entrar ni salir del mostrador, y en escritorio era un botón `size="small"`
 * perdido en una fila de ayudas. Ahora está siempre disponible, con el estado
 * escrito y no sólo insinuado por el color.
 */
const { mostradorMode, setMostradorMode } = useMostradorModeComposable();

const description = computed(() =>
    mostradorMode.value
        ? 'Buscá por nombre o código, Enter agrega el ítem y el total queda siempre a la vista.'
        : 'Facturación con todos los datos del comprobante a la vista y búsqueda de productos en ventana.',
);
</script>
