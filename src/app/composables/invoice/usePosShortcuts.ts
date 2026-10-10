import { nextTick, ref } from 'vue';
import { focusTicketLine, focusZone, isTypingTarget } from './usePosFocus';
import { describeCheckoutOutcome } from './useInvoiceCheckoutComposable';

/**
 * Atajos de teclado del modo mostrador.
 *
 * Todo el mapa vive acá: la tabla que se muestra en la ayuda, la línea que anticipa
 * los atajos en pantalla y el único listener global del mostrador. Los componentes
 * no reparten teclas por su cuenta —consumen este módulo— así que agregar o mover un
 * atajo es tocar un solo archivo.
 *
 * Reglas del listener global:
 *
 * - Corre en la fase de burbuja, así los controles pueden quedarse con una tecla:
 *   si un `keydown` llega ya `defaultPrevented` (lo consumió la línea del ticket o
 *   el desplegable de Ant), acá no se hace nada.
 * - Con la ayuda abierta sólo funcionan `?` y `Esc`: ninguna otra tecla tiene que
 *   dispararse detrás del panel. Esas dos se resuelven en fase de CAPTURA, antes de
 *   cualquier otro handler y sin mirar `defaultPrevented`: si no, un `Esc` que un
 *   control de Ant ya hubiera consumido dejaba la ayuda abierta y sin salida.
 * - `Ctrl`/`Meta`/`Alt` quedan para el navegador y para los atajos de
 *   `NewInvoice` (`Ctrl+F11`, `Ctrl+F10`).
 */

export type PosShortcutId =
    | 'focus-search'
    | 'search-move'
    | 'search-add'
    | 'focus-voucher'
    | 'focus-customer'
    | 'focus-price-list'
    | 'focus-ticket'
    | 'ticket-move'
    | 'ticket-quantity'
    | 'ticket-remove'
    | 'ticket-edit'
    | 'escape'
    | 'checkout'
    | 'help';

export type PosShortcutGroup = 'Buscador' | 'Ticket' | 'Venta' | 'Ayuda';

export type PosShortcut = {
    id: PosShortcutId;
    /** Teclas tal como se muestran, en `<kbd>`. */
    keys: string[];
    /** Qué hace la tecla, en una línea. */
    action: string;
    /** Texto corto para las líneas de ayuda en pantalla. */
    hint: string;
    group: PosShortcutGroup;
    /** Los que se anticipan en la línea visible del mostrador. */
    primary?: boolean;
};

/** El mapa de teclas aprobado. Única fuente de verdad. */
export const POS_SHORTCUTS: PosShortcut[] = [
    {
        id: 'focus-search',
        // `F2` y `/` primero a propósito: en un Chrome de escritorio `F12` lo suele tomar
        // el navegador (DevTools) y la página no puede cancelarlo, así que no es la tecla
        // que conviene anunciar. Sigue funcionando donde el navegador lo permita.
        keys: ['/', 'F2', 'F12'],
        action: 'Ir al buscador desde cualquier punto (si el navegador no se queda con F12, usá / o F2)',
        hint: 'ir al buscador',
        group: 'Buscador',
        primary: true,
    },
    {
        id: 'search-move',
        keys: ['↑', '↓'],
        action: 'Elegir el resultado de la búsqueda',
        hint: 'elegir resultado',
        group: 'Buscador',
    },
    {
        id: 'search-add',
        keys: ['Enter'],
        action: 'Agregar el ítem resaltado al ticket',
        hint: 'agregar al ticket',
        group: 'Buscador',
    },
    {
        id: 'escape',
        keys: ['Esc'],
        action: 'Limpiar la búsqueda, cerrar lo abierto o volver al buscador',
        hint: 'volver al buscador',
        group: 'Buscador',
    },
    {
        id: 'focus-voucher',
        keys: ['F4'],
        action: 'Ir al tipo de comprobante',
        hint: 'comprobante',
        group: 'Venta',
        primary: true,
    },
    {
        id: 'focus-customer',
        keys: ['Ctrl', 'F11'],
        action: 'Abrir los datos del cliente',
        hint: 'cliente',
        group: 'Venta',
    },
    {
        id: 'focus-price-list',
        keys: ['F7'],
        action: 'Ir a la lista de precios de la venta',
        hint: 'lista de precios',
        group: 'Venta',
        primary: true,
    },
    {
        id: 'focus-ticket',
        keys: ['F8'],
        action: 'Ir al ticket: primera línea, o la última que tuvo foco',
        hint: 'ir al ticket',
        group: 'Ticket',
        primary: true,
    },
    {
        id: 'ticket-move',
        keys: ['↑', '↓'],
        action: 'Recorrer las líneas del ticket',
        hint: 'recorrer líneas',
        group: 'Ticket',
    },
    {
        id: 'ticket-quantity',
        keys: ['+', '−'],
        action: 'Subir o bajar la cantidad de la línea',
        hint: 'subir o bajar la cantidad',
        group: 'Ticket',
    },
    {
        id: 'ticket-remove',
        keys: ['Supr'],
        action: 'Quitar la línea',
        hint: 'quitar la línea',
        group: 'Ticket',
    },
    {
        id: 'ticket-edit',
        keys: ['Enter'],
        action: 'Editar la cantidad de la línea',
        hint: 'editar la cantidad',
        group: 'Ticket',
    },
    {
        id: 'checkout',
        keys: ['F9'],
        action: 'Facturar directo',
        hint: 'facturar',
        group: 'Venta',
        primary: true,
    },
    {
        id: 'help',
        keys: ['?'],
        action: 'Mostrar u ocultar esta ayuda',
        hint: 'ayuda',
        group: 'Ayuda',
        primary: true,
    },
];

/** Teclas que se anticipan en la línea visible del mostrador, tomadas de la tabla. */
export const POS_SHORTCUT_HINTS: PosShortcut[] = POS_SHORTCUTS.filter((shortcut) => shortcut.primary === true);

/** Lo que puede hacer el listener global cuando no es puro foco. */
export type PosShortcutHandlers = {
    /** F9: facturar. La validación y el anuncio del resultado viven en el layout. */
    submit: () => void | Promise<void>;
};

const ANNOUNCE_COALESCE_MS = 350;
const HELP_PANEL_ID = 'pos-help';

/* ------------------------------------------------------------------ anuncios */

type PosAnnouncement = { id: number; text: string };

let announcementSequence = 0;
let pendingAnnouncement = 0;

/**
 * Último mensaje para la región `aria-live` del mostrador.
 *
 * Cambia de `id` en cada anuncio para que el lector de pantalla lea el mensaje
 * nuevo aunque el texto se repita.
 */
const announcement = ref<PosAnnouncement>({ id: 0, text: '' });

const flushAnnouncement = (text: string): void => {
    announcement.value = { id: (announcementSequence += 1), text };
};

/**
 * Anuncia algo al operador (y al lector de pantalla).
 *
 * Con `coalesce` se espera un instante y se manda un solo mensaje: subir la cantidad
 * cinco veces seguidas no puede terminar en cinco anuncios, pero "ítem agregado" o el
 * resultado de la emisión tienen que salir ya.
 */
export const announce = (text: string, options: { coalesce?: boolean } = {}): void => {
    const clean = text.trim();

    if (clean === '') {
        return;
    }

    if (pendingAnnouncement !== 0) {
        window.clearTimeout(pendingAnnouncement);
        pendingAnnouncement = 0;
    }

    if (!options.coalesce) {
        flushAnnouncement(clean);

        return;
    }

    pendingAnnouncement = window.setTimeout(() => {
        pendingAnnouncement = 0;
        flushAnnouncement(clean);
    }, ANNOUNCE_COALESCE_MS);
};

/** Anuncia lo que falta para poder facturar, tal como lo lista `invoiceValidation`. */
export const announceBlockers = (blockers: string[]): void => {
    announce(
        blockers.length > 0 ? `No se facturó. Falta: ${blockers.join(' ')}` : 'No se facturó: la venta no está lista.',
    );
};

/** Anuncia el resultado de la emisión, con el CAE cuando ARCA ya lo devolvió. */
export const announceCheckoutOutcome = (issued: boolean): void => {
    announce(describeCheckoutOutcome(issued));
};

/* --------------------------------------------------------------- ayuda de teclas */

const helpOpen = ref(false);
let helpReturnFocus: HTMLElement | null = null;

export const openPosHelp = (): void => {
    if (helpOpen.value) {
        return;
    }

    // Se recuerda el foco antes de abrir: al cerrar hay que volver exactamente ahí.
    helpReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    helpOpen.value = true;
};

export const closePosHelp = (): void => {
    if (!helpOpen.value) {
        return;
    }

    helpOpen.value = false;

    const previous = helpReturnFocus;
    helpReturnFocus = null;

    nextTick(() => {
        if (previous && document.contains(previous) && document.activeElement !== previous) {
            previous.focus({ preventScroll: true });

            return;
        }

        focusZone('search');
    });
};

/**
 * Cierra la ayuda sin devolver el foco.
 *
 * Lo usa el layout cuando se desmonta (por ejemplo al volver al modo normal): ahí el
 * foco anterior ya no existe y restaurarlo dejaría el cursor en cualquier lado.
 */
export const resetPosHelp = (): void => {
    helpOpen.value = false;
    helpReturnFocus = null;
};

export const togglePosHelp = (): void => {
    if (helpOpen.value) {
        closePosHelp();

        return;
    }

    openPosHelp();
};

/* ------------------------------------------------------------------- el listener */

/** Índice de la última línea del ticket que tuvo foco: F8 vuelve ahí. */
const ticketFocusIndex = ref(0);

export const setTicketFocusIndex = (index: number): void => {
    ticketFocusIndex.value = index;
};

const focusSearchZone = (): void => {
    const search = focusZone('search');

    if (search instanceof HTMLInputElement) {
        search.select();
    }
};

const focusTicket = (): void => {
    focusTicketLine(ticketFocusIndex.value);
};

const isAntSelectOpen = (target: EventTarget | null): boolean => {
    const element = target instanceof HTMLElement ? target : null;

    return Boolean(element?.closest('.ant-select')?.classList.contains('ant-select-open'));
};

/** Un drawer o un modal abierto manejan su propio `Esc` (el cliente, por ejemplo). */
const hasOpenOverlay = (): boolean =>
    document.querySelector('.ant-drawer-open') !== null ||
    document.querySelector('.ant-modal-wrap:not([style*="display: none"])') !== null;

const handleEscape = (event: KeyboardEvent): void => {
    // El desplegable de un select se cierra solo: no hay que llevarse el foco.
    if (isAntSelectOpen(event.target) || hasOpenOverlay()) {
        return;
    }

    event.preventDefault();
    focusSearchZone();
};

let installedWith: symbol | null = null;

const handlers: PosShortcutHandlers = { submit: () => undefined };

/**
 * Teclas de función del mostrador.
 *
 * Es un mapa y no un `switch` para que sumar una tecla sea una línea: el resto del
 * listener (guardas, `preventDefault`, orden) queda igual para todas.
 */
const POS_FUNCTION_KEYS: Record<string, (() => void) | undefined> = {
    F2: focusSearchZone,
    F12: focusSearchZone,
    F4: () => focusZone('voucher'),
    F7: () => focusZone('price-list'),
    F8: focusTicket,
    F9: () => void handlers.submit(),
};

/**
 * `?` y `Esc` con la ayuda abierta, resueltos en fase de CAPTURA.
 *
 * El listener de burbuja que está abajo arranca con `if (event.defaultPrevented)`:
 * tiene que hacerlo, porque si la línea del ticket o un desplegable de Ant ya se
 * quedaron con la tecla el mostrador no puede volver a reaccionar. El problema es que
 * ese mismo corte escondía la rama de la ayuda: con la ayuda abierta, un `Esc` que
 * cualquier otro control hubiera consumido antes —un select de Ant, el date picker,
 * el drawer— nunca llegaba a cerrarla y el panel quedaba abierto sin salida con el
 * teclado.
 *
 * Acá se evalúa primero que nada, en la ventana y en captura, y corta la
 * propagación: mientras la ayuda está abierta esas dos teclas son de la ayuda y de
 * nadie más (tampoco `F9`, que queda en la rama de abajo).
 */
const onWindowKeydownCapture = (event: KeyboardEvent): void => {
    if (!helpOpen.value || (event.key !== '?' && event.key !== 'Escape')) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();
    closePosHelp();
};

const onWindowKeydown = (event: KeyboardEvent): void => {
    /**
     * La ayuda se mira primero, antes del corte por `defaultPrevented`: es la única
     * forma de que cerrarla no dependa de quién haya consumido la tecla. La captura
     * de arriba ya cubre los dos casos; esto queda como red de seguridad por si el
     * evento llegara a la burbuja sin haber pasado por la captura.
     */
    if (helpOpen.value) {
        if (event.key === '?' || event.key === 'Escape') {
            event.preventDefault();
            closePosHelp();
        }

        return;
    }

    if (event.defaultPrevented) {
        return;
    }

    if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
    }

    const functionKey = POS_FUNCTION_KEYS[event.code];

    if (functionKey) {
        event.preventDefault();
        functionKey();

        return;
    }

    /**
     * `?` abre la ayuda desde cualquier lado, incluso con el foco en el buscador: es
     * la única forma de descubrir el resto de los atajos, y el carácter no se usa en
     * ningún campo del mostrador (cantidad, precio y descuento son numéricos).
     */
    if (event.key === '?') {
        event.preventDefault();
        openPosHelp();

        return;
    }

    if (event.key === '/') {
        if (!isTypingTarget(event.target)) {
            event.preventDefault();
            focusSearchZone();
        }

        return;
    }

    if (event.key === 'Escape') {
        handleEscape(event);
    }
};

/**
 * Instala el listener global del mostrador. Debe existir UNA sola vez por pantalla.
 *
 * @returns la función para quitarlo (se llama en `onUnmounted`).
 */
export const installPosShortcuts = (next: PosShortcutHandlers): (() => void) => {
    Object.assign(handlers, next);

    if (installedWith !== null) {
        // Segundo montaje del mostrador: el listener que ya está escuchando alcanza.
        return () => undefined;
    }

    const token = Symbol('pos-shortcuts');
    installedWith = token;
    window.addEventListener('keydown', onWindowKeydownCapture, true);
    window.addEventListener('keydown', onWindowKeydown);

    return () => {
        if (installedWith !== token) {
            return;
        }

        installedWith = null;
        window.removeEventListener('keydown', onWindowKeydownCapture, true);
        window.removeEventListener('keydown', onWindowKeydown);
    };
};

export const usePosShortcuts = () => ({
    POS_SHORTCUTS,
    POS_SHORTCUT_HINTS,
    announce,
    announceBlockers,
    announceCheckoutOutcome,
    announcement,
    closePosHelp,
    focusTicketLine,
    focusZone,
    helpOpen,
    helpPanelId: HELP_PANEL_ID,
    installPosShortcuts,
    openPosHelp,
    resetPosHelp,
    setTicketFocusIndex,
    ticketFocusIndex,
    togglePosHelp,
});
