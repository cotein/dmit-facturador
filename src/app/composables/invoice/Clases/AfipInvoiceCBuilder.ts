import { AfipInvoiceBaseBuilder } from './AfipInvoiceBaseBuilder';

export class AfipInvoiceCBuilder extends AfipInvoiceBaseBuilder {
	constructor() {
		super();
	}

	setCbteTipo(CbteTipo: any): void {
		this.FeCabReq.CbteTipo = CbteTipo;
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
