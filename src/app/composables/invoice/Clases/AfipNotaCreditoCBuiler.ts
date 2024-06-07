import type { CbteAsoc } from '@/app/types/Afip';
import { AfipInvoiceBaseBuilder } from './AfipInvoiceBaseBuilder';
import { INVOICE_TYPE } from '@/app/types/Constantes';
import type { ProductForNotaCredito, ProductOnInvoiceTable } from '@/app/types/Product';

export class AfipNotaCreditoCBuiler extends AfipInvoiceBaseBuilder {
    constructor() {
        super();
        this.CbteTipo = INVOICE_TYPE.FACTURA_C;
    }

    setImpTotConc(): void {
        this.FECAEDetRequest.ImpTotConc = 0;
    }

    setImpOpEx(): void {
        this.FECAEDetRequest.ImpOpEx = 0;
    }

    setImpIVA(): void {
        this.FECAEDetRequest.ImpIVA = 0;
    }

    setImpNeto(productForNotaCredito: ProductForNotaCredito[]): void {
        const neto = productForNotaCredito.reduce((acc, product) => {
            return acc + product.neto_import;
        }, 0);

        this.FECAEDetRequest.ImpNeto = neto;
    }

    setImpTotal(productForNotaCredito: ProductForNotaCredito[]): void {
        const total = productForNotaCredito.reduce((acc, product) => {
            return acc + product.total;
        }, 0);

        this.FECAEDetRequest.ImpTotal = total;
    }

    setIvaAarray(): void {
        delete this.FECAEDetRequest.Iva;
    }

    setCbtesAsoc(cbteAsoc: CbteAsoc): void {
        const asoc = [];

        asoc.push(cbteAsoc);

        this.FECAEDetRequest.CbtesAsoc = asoc;
    }

    setTributos(): void {
        delete this.FECAEDetRequest.Tributos;
    }

    setOpcionales(): void {
        delete this.FECAEDetRequest.Opcionales;
    }

    setCompradores(): void {
        delete this.FECAEDetRequest.Compradores;
    }

    setPeriodoAsoc(): void {
        delete this.FECAEDetRequest.PeriodoAsoc;
    }

    setActividades(): void {
        delete this.FECAEDetRequest.Actividades;
    }

    setImpTrib(invoiceTableData: ProductOnInvoiceTable[] | ProductForNotaCredito[]): void {
        this.FECAEDetRequest.ImpTrib = 0;
    }
    /* setFchVtoPago(CbteFch: number, days: number): void {
		delete this.FECAEDetRequest.FchVtoPago;
	} */
}
