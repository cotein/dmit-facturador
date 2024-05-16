import type { AlicIva, Iva, Ivas } from '@/app/types/Afip';
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
		/* const ImpTotConc = invoiceTableData.reduce((acc, item) => {
			if (item.iva.afip_code === AFIP_IVAS.AFIP_CODE_CERO) {
				return acc + item.total;
			}
			return acc + 0;
		}, 0);

		this.FECAEDetRequest.ImpTotConc = parseFloat(ImpTotConc.toFixed(2)); */
		this.FECAEDetRequest.ImpTotConc = 0;
	}

	setImpOpEx(invoiceTableData: ProductOnInvoiceTable[]): void {
		/* const ImpOpEx = invoiceTableData.reduce((acc, item) => {
			if (item.iva.id === AFIP_IVAS.ID_EXENTO) {
				return acc + item.total;
			}
			return acc + 0;
		}, 0);
		this.FECAEDetRequest.ImpOpEx = parseFloat(ImpOpEx.toFixed(2)); */
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
			return acc + item.total;
		}, 0);

		this.FECAEDetRequest.ImpTotal = parseFloat(total.toFixed(2));
	}

	setImpTrib(invoiceTableData: ProductOnInvoiceTable[]): void {
		delete this.FECAEDetRequest.Tributos;
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
