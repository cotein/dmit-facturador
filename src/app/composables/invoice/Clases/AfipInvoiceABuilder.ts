import type { AlicIva, Iva, Ivas } from '@/app/types/Afip';
import { AfipInvoiceBaseBuilder } from './AfipInvoiceBaseBuilder';

export class AfipInvoiceABuilder extends AfipInvoiceBaseBuilder {
	constructor() {
		super();
	}

	setIvaAarray(ivas: Ivas[]): void {
		const IVA: Iva = [];

		ivas.map((iva) => {
			const someIva: AlicIva = {
				Id: iva.id,
				BaseImp: iva.subtotal,
				Importe: iva.import,
			};
			IVA.push(someIva);
		});

		this.FECAEDetRequest.Iva = IVA;
	}
}
