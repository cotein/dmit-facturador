import type { CbteAsoc, PeriodoAsoc, Tributos } from './../../../types/Afip';
import type { ProductForNotaCredito } from '@/app/types/Product';
import { AfipInvoiceBaseBuilder } from './AfipInvoiceBaseBuilder';
import type { AlicIva } from '@/app/types/Afip';

export class AfipNotaCreditoABuiler extends AfipInvoiceBaseBuilder {
    constructor() {
        super();
    }

    setCbteTipo(CbteTipo: any): void {
        this.FeCabReq.CbteTipo = CbteTipo;
    }

    setImpTotConc(productsForNotaCredito: ProductForNotaCredito[]): void {
        /* const IVA_ID_NO_GRAVADO = 2;

		const ImpTotConc = productsForNotaCredito.reduce((acc, item) => {
			if (item.iva_id === IVA_ID_NO_GRAVADO) {
				return acc + item.total;
			}
			return acc + 0;
		}, 0);

		this.FECAEDetRequest.ImpTotConc = parseFloat(ImpTotConc.toFixed(2)); */
        this.FECAEDetRequest.ImpTotConc = 0;
    }

    setImpOpEx(productsForNotaCredito: ProductForNotaCredito[]): void {
        /* const IVA_ID_EXENTO = 3;

		const ImpOpEx = productsForNotaCredito.reduce((acc, item) => {
			if (item.iva_id === IVA_ID_EXENTO) {
				return acc + item.total;
			}
			return acc + 0;
		}, 0);
		this.FECAEDetRequest.ImpOpEx = parseFloat(ImpOpEx.toFixed(2)); */
        this.FECAEDetRequest.ImpOpEx = 0;
    }

    setImpIVA(productsForNotaCredito: ProductForNotaCredito[]): void {
        const ImpIVA = productsForNotaCredito.reduce((acc, item) => {
            return acc + item.iva_import;
        }, 0);

        this.FECAEDetRequest.ImpIVA = parseFloat(ImpIVA.toFixed(2));
    }

    setImpNeto(productsForNotaCredito: ProductForNotaCredito[]): void {
        const impNeto = productsForNotaCredito.reduce((acc, item) => {
            return acc + item.neto_import;
        }, 0);

        this.FECAEDetRequest.ImpNeto = parseFloat(impNeto.toFixed(2));
    }

    setImpTotal(productsForNotaCredito: ProductForNotaCredito[]): void {
        const total = productsForNotaCredito.reduce((acc, item) => {
            return acc + item.total + item.percep_iibb_import! + item.percep_iva_import!;
        }, 0);

        this.FECAEDetRequest.ImpTotal = parseFloat(total.toFixed(2));
    }

    setImpTrib(impTrib: number): void {
        this.FECAEDetRequest.ImpTrib = impTrib;
    }

    setIvaAarray(productsForNotaCredito: ProductForNotaCredito[]): void {
        const ivas: AlicIva[] = [];
        productsForNotaCredito.map((item: ProductForNotaCredito) => {
            const index = ivas.findIndex((el) => el.Id === parseInt(item.iva_afip_code));

            if (index < 0) {
                ivas.push({
                    Id: parseInt(item.iva_afip_code),
                    BaseImp: item.neto_import,
                    Importe: item.iva_import,
                });
            } else {
                ivas[index].BaseImp += item.neto_import;
                ivas[index].Importe += item.iva_import;
            }
        });

        this.FECAEDetRequest.Iva = ivas;
    }

    setCbtesAsoc(cbteAsoc: CbteAsoc): void {
        const asoc = [];

        asoc.push(cbteAsoc);

        this.FECAEDetRequest.CbtesAsoc = asoc;
    }

    setTributos(productsForNotaCredito: ProductForNotaCredito[]): void {
        const tributos: Tributos = [];

        if (productsForNotaCredito) {
            const {
                sumaPercepIVA3,
                baseImpPercepIVA3,
                sumaPercepIVA15,
                baseImpPercepIVA15,
                sumaPercepIIBB,
                baseImpPercepIIBB,
                alicIIBB,
            } = productsForNotaCredito.reduce(
                (acc, product) => {
                    console.log(
                        '🚀 ~ AfipNotaCreditoABuiler ~ setTributos ~ product:',
                        typeof product.percep_iibb_import,
                    );
                    if (product.percep_iva_alicuota === 1.5 && product.percep_iva_import) {
                        acc.sumaPercepIVA15 += product.percep_iva_import;
                        acc.baseImpPercepIVA15 += product.neto_import;
                    }

                    if (product.percep_iva_alicuota === 3 && product.percep_iva_import) {
                        acc.sumaPercepIVA3 += product.percep_iva_import;
                        acc.baseImpPercepIVA3 += product.neto_import;
                    }

                    if (product.percep_iibb_alicuota && product.percep_iibb_import) {
                        acc.sumaPercepIIBB += product.percep_iibb_import;
                        acc.baseImpPercepIIBB += product.neto_import;
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
                const baseImponible: number = parseFloat(baseImpPercepIVA15.toFixed(2));
                const total: number = parseFloat(sumaPercepIVA15.toFixed(2));

                tributos.push({
                    Id: 6,
                    Desc: 'Percepción de IVA',
                    BaseImp: baseImponible,
                    Alic: 1.5,
                    Importe: total,
                });
            }

            if (sumaPercepIVA3 > 0) {
                const baseImponible: number = parseFloat(baseImpPercepIVA3.toFixed(2));
                const total: number = parseFloat(sumaPercepIVA3.toFixed(2));

                tributos.push({
                    Id: 6,
                    Desc: 'Percepción de IVA',
                    BaseImp: baseImponible,
                    Alic: 3,
                    Importe: total,
                });
            }

            if (sumaPercepIIBB > 0) {
                const baseImponible: number = parseFloat(baseImpPercepIIBB.toFixed(2));
                const total: number = parseFloat(sumaPercepIIBB.toFixed(2));

                tributos.push({
                    Id: 7,
                    Desc: 'Percepción de IIBB',
                    BaseImp: baseImponible,
                    Alic: alicIIBB,
                    Importe: total,
                });
            }

            if (tributos.length > 0) {
                this.FECAEDetRequest.Tributos = tributos;
                const impTrib = tributos.reduce((acc, item) => {
                    return acc + item.Importe;
                }, 0);

                this.setImpTrib(impTrib);
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

    setPeriodoAsoc(periodoAsoc: PeriodoAsoc): void {
        delete this.FECAEDetRequest.PeriodoAsoc;
        /* if (periodoAsoc && periodoAsoc.FchDesde != '') {
			this.FECAEDetRequest.PeriodoAsoc!.FchDesde = periodoAsoc.FchDesde;
			this.FECAEDetRequest.PeriodoAsoc!.FchHasta = periodoAsoc.FchHasta;
		} else {
		} */
    }

    setActividades(): void {
        delete this.FECAEDetRequest.Actividades;
    }
}
