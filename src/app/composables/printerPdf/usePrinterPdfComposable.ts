import { A } from '@/app/pdf/invoices/A';
import { B } from '@/app/pdf/invoices/B';
import { C } from '@/app/pdf/invoices/C';
import type { Invoice } from '@/app/pdf/invoices/Invoice';
import type { InvoiceList } from '@/app/types/Invoice';
import type { Item as PdfItem } from '@/app/types/Pdf';
import { useCompanyComposable } from '../company/useCompanyComposable';

export const usePrinterPdfComposable = () => {
    const { CompanyGetter } = useCompanyComposable();

    const getPdfInvoice = (CbteTipo: number): any => {
        switch (CbteTipo) {
        case 1:
        case 2:
        case 3:
        case 92:
        case 93:
        case 94:
            return A;
        case 6:
        case 7:
        case 8:
        case 95:
        case 96:
        case 97:
            return B;
        case 11:
        case 12:
        case 13:
        case 98:
        case 99:
        case 100:
            return C;
        default:
            throw new Error(`Tipo de factura no válido: ${CbteTipo}`);
        }
    };

    const createInvoicePdf = (invoice: InvoiceList) => {
        const invoicePdf = getPdfInvoice(invoice.voucher!.voucher_type);

        // El DTO de InvoiceList declara menos campos de los que la API devuelve para cada item:
        // los impresores necesitan iva_afip_code, iva_id y subtotal, que sí están en types/Pdf.
        const items = invoice.items as unknown as PdfItem[];

        return new invoicePdf(
            invoice.company,
            invoice.customer,
            invoice.voucher,
            items,
            invoice.comment,
            CompanyGetter.value?.logo_base64,
        ) as Invoice;
    };

    const printPdf = (invoice: InvoiceList) => {
        const pdf = createInvoicePdf(invoice);
        pdf.print();
    };

    const getPdfFile = async (invoice: InvoiceList) => {
        const pdf = createInvoicePdf(invoice);
        return await pdf.getFilePdf();
    };

    return {
        printPdf,
        getPdfFile,
    };
};
