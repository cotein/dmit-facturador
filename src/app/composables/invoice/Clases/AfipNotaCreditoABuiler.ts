import type { CbteAsoc, PeriodoAsoc } from './../../../types/Afip';
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
			return acc + item.total;
		}, 0);

		this.FECAEDetRequest.ImpTotal = parseFloat(total.toFixed(2));
	}

	setImpTrib(productsForNotaCredito: ProductForNotaCredito[]): void {
		delete this.FECAEDetRequest.Tributos;
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

	setTributos(): void {
		delete this.FECAEDetRequest.Tributos;
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
