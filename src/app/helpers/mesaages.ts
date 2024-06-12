import { message } from 'ant-design-vue';

/**
 * Muestra un mensaje con un tipo y duración especificados.
 *
 * @param {('success' | 'error' | 'info' | 'warning' | 'loading')} type - El tipo de mensaje que se mostrará.
 * @param {string} msg - El mensaje que se mostrará.
 * @param {number} duration - La duración durante la cual se mostrará el mensaje.
 * @param {string} title - Algún título para el mensaje.
 *
 * @example
 * showMessage('success', 'Operación exitosa', 3);
 * showMessage('error', 'Ocurrió un error', 3);
 * showMessage('info', 'Esto es una información', 3);
 * showMessage('warning', 'Esto es una advertencia', 3);
 * showMessage('loading', 'Cargando...', 3);
 */
export const showMessage = (
    type: 'success' | 'error' | 'info' | 'warning' | 'loading',
    msg: string,
    duration: number,
) => {
    message[type]({
        content: () => msg,
        duration: duration,
        style: {
            color: type === 'error' ? 'red' : '#808080',
            fontSize: 'large',
        },
    });
};
