import { A } from '@/app/pdf/invoices/A';
import { B } from '@/app/pdf/invoices/B';
import { C } from '@/app/pdf/invoices/C';

export const usePrinterPdfComposable = () => {
	const getPdfInvoice = (CbteTipo: number): any => {
		switch (CbteTipo) {
			case 1:
				return A;
			case 6:
				return B;
			case 11:
				return C;
			default:
				throw new Error(`Tipo de factura no válido: ${CbteTipo}`);
		}
	};

	return {
		getPdfInvoice,
	};
};
