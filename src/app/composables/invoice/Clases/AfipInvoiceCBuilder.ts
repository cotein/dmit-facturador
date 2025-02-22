import type { AfipInvoice } from '@/app/types/Afip';
import { AfipInvoiceBaseBuilder } from './AfipInvoiceBaseBuilder';
import type { ProductOnInvoiceTable } from '@/app/types/Product';

export class AfipInvoiceCBuilder extends AfipInvoiceBaseBuilder {
    constructor() {
        super();
    }

    setCbteTipo(CbteTipo: any): void {
        this.FeCabReq.CbteTipo = CbteTipo;
    }

    setImpTotConc(invoiceTableData: ProductOnInvoiceTable[]): void {
        this.FECAEDetRequest.ImpTotConc = 0;
    }

    setImpOpEx(): void {
        this.FECAEDetRequest.ImpOpEx = 0;
    }

    setImpIVA(): void {
        this.FECAEDetRequest.ImpIVA = 0;
    }

    setImpNeto(invoiceTableData: ProductOnInvoiceTable[]): void {
        const impNeto = invoiceTableData.reduce((acc, item) => {
            return acc + item.total;
        }, 0);

        this.FECAEDetRequest.ImpNeto = parseFloat(impNeto.toFixed(2));
    }

    setImpTotal(invoiceTableData: ProductOnInvoiceTable[]): void {
        const total = invoiceTableData.reduce((acc, item) => {
            return acc + item.total;
        }, 0);

        this.FECAEDetRequest.ImpTotal = parseFloat(total.toFixed(2));
    }

    setImpTrib(invoiceTableData: ProductOnInvoiceTable[]): void {
        delete this.FECAEDetRequest.Tributos;
    }

    setIvaAarray(): void {
        delete this.FECAEDetRequest.Iva;
    }

    setCbtesAsoc(): void {
        delete this.FECAEDetRequest.CbtesAsoc;
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
}
