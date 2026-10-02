import { notification } from 'ant-design-vue';
import { h } from 'vue';
import type { ArcaResponse } from '@/app/types/Afip';

type NotificationType = 'success' | 'error' | 'info' | 'warning';
type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

/**
 * Muestra una notificación con un tipo, duración y posición especificados.
 *
 * @param {NotificationType} type - El tipo de notificación que se mostrará.
 * @param {string} msg - El mensaje que se mostrará.
 * @param {number} duration - La duración durante la cual se mostrará la notificación - en segundos.
 * @param {NotificationPlacement} placement - La posición donde se mostrará la notificación.
 *
 * @example
 * showNotification('success', 'Operación exitosa', 3, 'topRight');
 * showNotification('error', 'Ocurrió un error', 3, 'bottomLeft');
 * showNotification('info', 'Esto es una información', 3, 'topLeft');
 * showNotification('warning', 'Esto es una advertencia', 3, 'bottomRight');
 */
export const showNotification = (
    type: NotificationType,
    title: string,
    msg: string,
    duration: number,
    placement: NotificationPlacement = 'topRight',
) => {
    notification[type]({
        message: title.toUpperCase(),
        description: msg,
        duration: duration,
        placement: placement,
        style: {
            color: type === 'error' ? 'red' : '#808080',
            fontSize: 'large',
        },
    });
};

/**
 * Muestra lo que contestó ARCA, siempre y tal cual.
 *
 * - Si rechazó el comprobante: lista TODOS los errores y observaciones con su código (por
 *   ejemplo el 10245 de la RG 5616) y la notificación queda abierta hasta que la cierren.
 * - Si aprobó pero con observaciones: avisa igual, con el CAE otorgado.
 * - Si no vino la respuesta de ARCA (falló antes de llegar): muestra el mensaje de la API,
 *   para no dejar al usuario sin motivo.
 *
 * @param {ArcaResponse | null | undefined} arca - Respuesta de ARCA que devuelve la API.
 * @param {string} fallbackMessage - Mensaje de la API cuando no hay respuesta de ARCA.
 */
export const showArcaNotification = (arca?: ArcaResponse | null, fallbackMessage?: string): void => {
    const mensajes = arca?.mensajes ?? [];

    if (mensajes.length === 0) {
        if (fallbackMessage) {
            showNotification('error', 'No se pudo emitir el comprobante', fallbackMessage, 0);
        }

        return;
    }

    const aprobado = arca?.aprobado === true;

    notification[aprobado ? 'warning' : 'error']({
        message: aprobado ? 'ARCA AUTORIZÓ CON OBSERVACIONES' : 'ARCA RECHAZÓ EL COMPROBANTE',
        description: h('div', [
            h(
                'ul',
                { style: 'margin: 0; padding-left: 18px;' },
                mensajes.map((mensaje: string) => h('li', { style: 'margin-bottom: 6px;' }, mensaje)),
            ),
            aprobado && arca?.cae
                ? h('div', { style: 'margin-top: 8px;' }, `CAE ${arca.cae} — vencimiento ${arca.cae_fch_vto ?? '-'}`)
                : null,
        ]),
        duration: aprobado ? 15 : 0,
        placement: 'topRight',
        style: {
            color: aprobado ? '#808080' : 'red',
            fontSize: 'large',
        },
    });
};
