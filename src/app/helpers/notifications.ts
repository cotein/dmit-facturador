import { notification } from 'ant-design-vue';

type NotificationType = 'success' | 'error' | 'info' | 'warning';
type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

/**
 * Muestra una notificación con un tipo, duración y posición especificados.
 *
 * @param {NotificationType} type - El tipo de notificación que se mostrará.
 * @param {string} msg - El mensaje que se mostrará.
 * @param {number} duration - La duración durante la cual se mostrará la notificación.
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
