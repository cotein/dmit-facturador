import type { AlicIva, Iva, Ivas, Tributo, Tributos } from '@/app/types/Afip';
import { AfipInvoiceBaseBuilder } from './AfipInvoiceBaseBuilder';
import type { ProductOnInvoiceTable } from '@/app/types/Product';

export class AfipInvoiceABuilder extends AfipInvoiceBaseBuilder {
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
            return acc + item.subtotal;
        }, 0);

        this.FECAEDetRequest.ImpNeto = parseFloat(impNeto.toFixed(2));
    }

    setImpTotal(invoiceTableData: ProductOnInvoiceTable[]): void {
        const total = invoiceTableData.reduce((acc, item) => {
            return acc + item.total + item.percep_iibb_import! + item.percep_iva_import!;
        }, 0);

        this.FECAEDetRequest.ImpTotal = parseFloat(total.toFixed(2));
    }

    setImpTrib(impTrib: number): void {
        this.FECAEDetRequest.ImpTrib = impTrib;
    }

    setIvaAarray(invoiceTableData: ProductOnInvoiceTable[]): void {
        const ivas: AlicIva[] = [];
        invoiceTableData.map((item: ProductOnInvoiceTable) => {
            const index = ivas.findIndex((el) => el.Id === item.iva.afip_code);

            if (index < 0) {
                ivas.push({
                    Id: item.iva.afip_code,
                    BaseImp: item.subtotal,
                    Importe: item.iva_import,
                });
            } else {
                ivas[index].BaseImp += item.subtotal;
                ivas[index].Importe += item.iva_import;
            }
        });

        this.FECAEDetRequest.Iva = ivas;
    }

    setCbtesAsoc(): void {
        delete this.FECAEDetRequest.CbtesAsoc;
    }

    setTributos(invoiceTableData: ProductOnInvoiceTable[]): void {
        const tributos: Tributos = [];

        if (invoiceTableData && Array.isArray(invoiceTableData)) {
            const {
                sumaPercepIVA3,
                baseImpPercepIVA3,
                sumaPercepIVA15,
                baseImpPercepIVA15,
                sumaPercepIIBB,
                baseImpPercepIIBB,
                alicIIBB,
            } = invoiceTableData.reduce(
                (acc, product) => {
                    if (product.percep_iva_alicuota === 1.5 && product.percep_iva_import) {
                        acc.sumaPercepIVA15 += product.percep_iva_import;
                        acc.baseImpPercepIVA15 += product.subtotal;
                    }

                    if (product.percep_iva_alicuota === 3 && product.percep_iva_import) {
                        acc.sumaPercepIVA3 += product.percep_iva_import;
                        acc.baseImpPercepIVA3 += product.subtotal;
                    }

                    if (product.percep_iibb_alicuota && product.percep_iibb_import) {
                        acc.sumaPercepIIBB += product.percep_iibb_import;
                        acc.baseImpPercepIIBB += product.subtotal;
                        acc.alicIIBB = product.percep_iibb_alicuota;
                    }

                    return acc;
                },
                {
                    sumaPercepIVA15: 0,
                    baseImpPercepIVA15: 0,
                    sumaPercepIVA3: 0,
                    baseImpPercepIVA3: 0,
                    sumaPercepIIBB: 0,
                    baseImpPercepIIBB: 0,
                    alicIIBB: 0,
                },
            );

            if (sumaPercepIVA15 > 0) {
                tributos.push({
                    Id: 6,
                    Desc: 'Percepción de IVA',
                    BaseImp: baseImpPercepIVA15,
                    Alic: 1.5,
                    Importe: parseFloat(sumaPercepIVA15.toFixed(2)),
                });
            }

            if (sumaPercepIVA3 > 0) {
                tributos.push({
                    Id: 6,
                    Desc: 'Percepción de IVA',
                    BaseImp: baseImpPercepIVA3,
                    Alic: 3,
                    Importe: parseFloat(sumaPercepIVA3.toFixed(2)),
                });
            }

            if (sumaPercepIIBB > 0) {
                tributos.push({
                    Id: 7,
                    Desc: 'Percepción de IIBB',
                    BaseImp: baseImpPercepIIBB,
                    Alic: alicIIBB,
                    Importe: parseFloat(sumaPercepIIBB.toFixed(2)),
                });
            }

            if (tributos.length > 0) {
                console.log('🚀 ~ AfipInvoiceABuilder ~ setTributos ~ tributos:', tributos);
                this.FECAEDetRequest.Tributos = tributos;
                const impTrib = tributos.reduce((acc, item) => {
                    return acc + item.Importe;
                }, 0);

                this.setImpTrib(parseFloat(impTrib.toFixed(2)));
            } else {
                delete this.FECAEDetRequest.Tributos;
                this.setImpTrib(0);
            }
        }
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
