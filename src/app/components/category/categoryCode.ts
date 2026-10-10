import type { CategoryRawData } from '@/app/types/Category';

/**
 * Sugiere un código de categoría a partir del padre elegido: para una
 * categoría principal toma el siguiente número libre y para una subcategoría
 * usa el código del padre más una secuencia de dos dígitos.
 *
 * Es sólo una sugerencia editable, nunca una restricción de longitud.
 */
export const suggestCategoryCode = (parent: CategoryRawData | null, all: CategoryRawData[]): string => {
    if (parent) {
        const prefix = `${parent.code}-`;
        const siblings = all.filter((category) => category.parent_id === parent.id);
        let max = 0;

        siblings.forEach((sibling) => {
            const parsed = Number(String(sibling.code ?? '').replace(prefix, ''));
            if (Number.isFinite(parsed)) {
                max = Math.max(max, parsed);
            }
        });

        return `${prefix}${String(max + 1).padStart(2, '0')}`;
    }

    const rootCodes = all
        .filter((category) => category.parent_id === null)
        .map((category) => Number(category.code))
        .filter((code) => Number.isFinite(code));

    return String(rootCodes.length ? Math.max(...rootCodes) + 1 : 1001);
};
