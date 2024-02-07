import type { CbteAsoc } from '@/app/types/Afip';
import { AfipInvoiceBaseBuilder } from './AfipInvoiceBaseBuilder';
import { INVOICE_TYPE } from '@/app/types/Constantes';

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

	setImpNeto(ImpNeto: number): void {
		this.FECAEDetRequest.ImpNeto = ImpNeto;
	}

	setIvaAarray(): void {
		delete this.FECAEDetRequest.Iva;
	}

	setCbtesAsoc(cbte: CbteAsoc): void {
		const asoc = [];

		asoc.push({
			Tipo: cbte.Tipo,
			PtoVta: cbte.PtoVta,
			Nro: cbte.Nro,
			Cuit: cbte.Cuit,
			CbteFch: cbte.CbteFch,
		});

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

	/* setFchVtoPago(CbteFch: number, days: number): void {
		delete this.FECAEDetRequest.FchVtoPago;
	} */
}
