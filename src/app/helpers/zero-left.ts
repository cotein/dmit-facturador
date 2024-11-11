/**
 * Formatea un número con ceros a la izquierda.
 * @param num - El número a formatear.
 * @param width - El ancho deseado de la cadena resultante.
 * @returns Una cadena con ceros a la izquierda.
 */
export const zeroLeft = (num: number, width: number): string => {
    const numStr = num.toString();
    return numStr.padStart(width, '0');
};
