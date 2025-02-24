import type { ProductOnInvoiceTable } from '@/app/types/Product';
import { AfipInvoiceBaseBuilder } from './AfipInvoiceBaseBuilder';
import { AFIP_IVAS } from '@/app/types/Constantes';
import type { AlicIva } from '@/app/types/Afip';

export class AfipInvoiceBBuilder extends AfipInvoiceBaseBuilder {
    constructor() {
        super();
    }

    setCbteTipo(CbteTipo: any): void {
        this.FeCabReq.CbteTipo = CbteTipo;
    }

    setImpTotConc(invoiceTableData: ProductOnInvoiceTable[]): void {
        this.FECAEDetRequest.ImpTotConc = 0;
    }

    setImpOpEx(invoiceTableData: ProductOnInvoiceTable[]): void {
        this.FECAEDetRequest.ImpOpEx = 0;
    }

    setImpIVA(invoiceTableData: ProductOnInvoiceTable[]): void {
        const ImpIVA = invoiceTableData.reduce((acc, item) => {
            return acc + item.iva_import;
        }, 0);

        this.FECAEDetRequest.ImpIVA = parseFloat(ImpIVA.toFixed(2));
    }

    setImpNeto(invoiceTableData: ProductOnInvoiceTable[]): void {
        const impNeto = invoiceTableData.reduce((acc, item) => {
            return acc + item.subtotal - item.discount;
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
        this.FECAEDetRequest.ImpTrib = 0;
    }

    setIvaAarray(invoiceTableData: ProductOnInvoiceTable[]): void {
        const ivas: AlicIva[] = [];

        invoiceTableData.map((item: ProductOnInvoiceTable) => {
            const index = ivas.findIndex((el) => el.Id === item.iva.afip_code);

            if (index < 0) {
                ivas.push({
                    Id: item.iva.afip_code,
                    BaseImp: item.subtotal - item.discount,
                    Importe: parseFloat(item.iva_import.toFixed(2)),
                });
            } else {
                (ivas[index].BaseImp += item.subtotal - item.discount),
                (ivas[index].Importe += parseFloat(item.iva_import.toFixed(2)));
            }
        });

        this.FECAEDetRequest.Iva = ivas;
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
