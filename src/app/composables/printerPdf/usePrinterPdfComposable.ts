import { A } from '@/app/pdf/invoices/A';
import { B } from '@/app/pdf/invoices/B';
import { C } from '@/app/pdf/invoices/C';
import type { Invoice } from '@/app/pdf/invoices/Invoice';
import type { InvoiceList } from '@/app/types/Invoice';

export const usePrinterPdfComposable = () => {
	const getPdfInvoice = (CbteTipo: number): any => {
		switch (CbteTipo) {
			case 1:
			case 2:
			case 3:
				return A;
			case 6:
			case 7:
			case 8:
				return B;
			case 11:
			case 12:
			case 13:
				return C;
			default:
				throw new Error(`Tipo de factura no válido: ${CbteTipo}`);
		}
	};

	const printPdf = (invoice: InvoiceList) => {
		const invoicePdf = getPdfInvoice(invoice.voucher.voucher_type);

		const pdf = new invoicePdf(
			invoice.company,
			invoice.customer,
			invoice.voucher,
			invoice.items,
			invoice.comment,
		) as Invoice;

		pdf.print();
	};

	return {
		printPdf,
	};
};
