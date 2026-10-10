/**
 * Foco por zonas del modo mostrador.
 *
 * El mostrador se maneja sin mouse, así que "ir a tal lado" tiene que ser una sola
 * operación confiable: el DOM marca cada zona con `data-zone` y este helper busca
 * adentro el primer control realmente utilizable —visible, habilitado y con foco
 * posible— sin que ningún componente tenga que conocer la estructura del otro.
 *
 * Dos detalles que hacen falta sí o sí con Ant Design Vue:
 *
 * 1. Los `a-select` no tienen foco propio: el `div` de arriba es decorativo y lo
 *    que recibe el foco es el `input` interno de `.ant-select-selector`. Ese input
 *    mide 0 px (es un truco de Ant), así que para decidir si el control se ve hay
 *    que medir la caja del selector, no la del input.
 * 2. Si la zona no existe —el caso típico es el ticket vacío, que no dibuja su
 *    contenedor— no se rompe: se cae al buscador, que es donde el operador puede
 *    seguir trabajando.
 */

/** Zonas navegables del mostrador. */
export type PosZone = 'search' | 'voucher' | 'customer' | 'price-list' | 'ticket' | 'checkout';

/** Atributo con el nombre de la zona. */
export const POS_ZONE_ATTRIBUTE = 'data-zone';

/** Marca de cada línea del ticket (foco móvil entre líneas). */
export const POS_LINE_ATTRIBUTE = 'data-pos-line';

const FOCUSABLE_SELECTOR = ['a[href]', 'button', 'input', 'select', 'textarea', '[tabindex]'].join(',');

const isDisabled = (element: HTMLElement): boolean =>
    (element as HTMLInputElement | HTMLButtonElement).disabled === true ||
    element.getAttribute('aria-disabled') === 'true';

/**
 * La caja que hay que medir para saber si el control está a la vista.
 *
 * Para un control normal es el propio control; para lo que vive dentro de un select
 * de Ant es el selector, porque el input interno siempre mide 0 px.
 */
const visibleBoxOf = (element: HTMLElement): HTMLElement =>
    element.closest<HTMLElement>('.ant-select-selector') ?? element.closest<HTMLElement>('.ant-picker') ?? element;

const isReachable = (element: HTMLElement): boolean => {
    if (isDisabled(element) || element.closest('[inert]')) {
        return false;
    }

    const box = visibleBoxOf(element);
    const rect = box.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) {
        return false;
    }

    const style = window.getComputedStyle(box);

    return style.visibility !== 'hidden' && style.display !== 'none';
};

/** Del control que devuelve el DOM al elemento que de verdad recibe el foco. */
export const resolveFocusTarget = (element: HTMLElement): HTMLElement => {
    const select = element.closest<HTMLElement>('.ant-select');

    if (!select) {
        return element;
    }

    return (
        select.querySelector<HTMLElement>('.ant-select-selector input') ??
        select.querySelector<HTMLElement>('.ant-select-selector') ??
        element
    );
};

/** Primer control visible y habilitado dentro de un contenedor. */
export const firstFocusableIn = (host: HTMLElement): HTMLElement | null => {
    const candidates = Array.from(host.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    for (const candidate of candidates) {
        if (candidate.getAttribute('tabindex') === '-1') {
            continue;
        }

        const target = resolveFocusTarget(candidate);

        if (isReachable(candidate) && isReachable(target)) {
            return target;
        }
    }

    return null;
};

/**
 * Enfoca un elemento sin que la página salte y lo acerca a la pantalla.
 *
 * @returns si el foco quedó realmente puesto.
 */
export const focusElement = (element: HTMLElement | null, options: { selectText?: boolean } = {}): boolean => {
    if (!element || !document.contains(element)) {
        return false;
    }

    element.focus({ preventScroll: true });
    visibleBoxOf(element).scrollIntoView({ block: 'nearest', inline: 'nearest' });

    if (options.selectText && element instanceof HTMLInputElement) {
        element.select();
    }

    return document.activeElement === element;
};

/**
 * Lleva el foco a una zona.
 *
 * Si la zona no está en el DOM o no tiene ningún control usable, cae al buscador;
 * y si tampoco existe el buscador, devuelve `null` sin tirar nada.
 */
export const focusZone = (zone: PosZone): HTMLElement | null => {
    const host = document.querySelector<HTMLElement>(`[${POS_ZONE_ATTRIBUTE}="${zone}"]`);
    const target = host ? firstFocusableIn(host) : null;

    if (target && focusElement(target)) {
        return target;
    }

    return zone === 'search' ? null : focusZone('search');
};

/** Elementos de las líneas del ticket, en orden. */
export const getTicketLineElements = (): HTMLElement[] =>
    Array.from(document.querySelectorAll<HTMLElement>(`[${POS_LINE_ATTRIBUTE}]`));

/**
 * Foco móvil del ticket.
 *
 * El índice se recorta a los extremos de la lista: las flechas recorren las líneas
 * y no se escapan hacia el resto de la página.
 */
export const focusTicketLine = (index: number): HTMLElement | null => {
    const lines = getTicketLineElements();

    if (lines.length === 0) {
        return focusZone('ticket');
    }

    const clamped = Math.min(Math.max(index, 0), lines.length - 1);

    return focusElement(lines[clamped]) ? lines[clamped] : null;
};

/**
 * Si el foco está en un lugar donde se escribe.
 *
 * Sirve para no robarle la tecla `/` a un campo de texto. El input interno de los
 * select de Ant es de sólo lectura y no se tipea ahí, así que no cuenta.
 */
export const isTypingTarget = (target: EventTarget | null): boolean => {
    if (!(target instanceof HTMLElement)) {
        return false;
    }

    if (target.isContentEditable) {
        return true;
    }

    if (target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return true;
    }

    if (target instanceof HTMLInputElement) {
        return !target.readOnly;
    }

    return false;
};
