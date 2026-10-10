<template>
    <aside
        :id="helpPanelId"
        ref="panelRef"
        class="pos-help"
        role="dialog"
        aria-modal="false"
        aria-labelledby="pos-help-title"
        data-testid="pos-help"
        tabindex="-1"
    >
        <div class="pos-help__head">
            <h2 id="pos-help-title" class="pos-help__title">Atajos del mostrador</h2>
            <button type="button" class="pos-help__close" data-testid="pos-help-close" @click="close">Cerrar</button>
        </div>

        <table class="pos-help__table">
            <caption class="pos-help__caption">
                Todo el mostrador se maneja con el teclado, sin mouse.
            </caption>
            <thead>
                <tr>
                    <th scope="col">Tecla</th>
                    <th scope="col">Qué hace</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="shortcut in shortcuts" :key="shortcut.id" :data-shortcut="shortcut.id">
                    <th scope="row" class="pos-help__keys">
                        <kbd v-for="key in shortcut.keys" :key="key">{{ key }}</kbd>
                    </th>
                    <td>{{ shortcut.action }}</td>
                </tr>
            </tbody>
        </table>

        <p class="pos-help__foot">Se cierra con <kbd>Esc</kbd> o <kbd>?</kbd> y el foco vuelve a donde estabas.</p>
    </aside>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { usePosShortcuts } from '@/app/composables/invoice/usePosShortcuts';

/**
 * Ayuda de teclas del mostrador.
 *
 * Es un panel, no un modal: se abre al costado, sin fondo que tape la venta y sin
 * atrapar el foco. Al abrirse el foco entra al panel (para que el lector de pantalla
 * lo lea) y al cerrarse vuelve al control donde estaba.
 */
const { POS_SHORTCUTS: shortcuts, closePosHelp, helpPanelId } = usePosShortcuts();

const panelRef = ref<HTMLElement | null>(null);

const close = () => {
    closePosHelp();
};

onMounted(() => {
    panelRef.value?.focus({ preventScroll: true });
});
</script>
