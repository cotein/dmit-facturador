import { AFIP_IVA } from '@/app/types/Constantes';
import type { Iva } from '@/app/types/Iva';
import type { ProductForNotaCredito } from '@/app/types/Product';

export const useIvaImportComposable = () => {
    const iva_import = (product: ProductForNotaCredito): number => {
        const total_iva_import = AFIP_IVA.reduce((acc: number, iva: Iva) => {
            if (iva.code === product.iva_afip_code) {
                const iva_import = (product.unit_price * product.quantity * iva.percentage) / 100;
                return acc + iva_import;
            }
            return acc;
        }, 0);

        return parseFloat(total_iva_import.toFixed(2));
    };

    return { iva_import };
};
