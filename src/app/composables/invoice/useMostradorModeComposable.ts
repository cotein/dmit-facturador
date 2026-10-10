import { ref, watch } from 'vue';

/**
 * Modo de trabajo del punto de venta.
 *
 * Vive en un módulo compartido (y no dentro de un componente) porque lo necesitan
 * piezas que no son padre e hijo: `FormInvoice` dibuja el layout y `NewInvoice`
 * decide a dónde manda la tecla F12. Antes cada uno leía `localStorage` por su
 * cuenta y el estado podía quedar desincronizado.
 *
 * El valor elegido se guarda en `localStorage` con la misma clave de siempre
 * (`mostradorMode`), así que quien ya lo tenía activado sigue igual.
 */
const STORAGE_KEY = 'mostradorMode';

const readStoredMode = (): boolean => {
    try {
        return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
        return false;
    }
};

const mostradorMode = ref<boolean>(readStoredMode());

watch(mostradorMode, (value) => {
    try {
        localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
        /* modo privado o storage lleno: el modo sigue funcionando en memoria */
    }
});

export const useMostradorModeComposable = () => {
    const setMostradorMode = (value: boolean) => {
        mostradorMode.value = value;
    };

    const toggleMostradorMode = () => {
        mostradorMode.value = !mostradorMode.value;
    };

    return {
        mostradorMode,
        setMostradorMode,
        toggleMostradorMode,
    };
};
