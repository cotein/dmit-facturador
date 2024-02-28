import { AFIP_IVA } from '@/app/types/Constantes';
import type { Iva } from '@/app/types/Iva';

export const useIvaImportComposable = () => {
	const iva_import = (iva_afip_code: string, unit_price: number, quantity: number) => {
		return AFIP_IVA.reduce((acc: number, iva: Iva) => {
			if (iva.code === iva_afip_code) {
				return acc + (unit_price * quantity * iva.percentage) / 100;
			}
			return acc;
		}, 0);
	};

	return { iva_import };
};
