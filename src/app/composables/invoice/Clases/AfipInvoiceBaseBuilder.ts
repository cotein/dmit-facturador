import type { AlicIva, FECAEDetRequest, FeCabReq, Iva, Ivas } from '@/app/types/Afip';
import moment from 'moment';

export abstract class AfipInvoiceBaseBuilder {
	public FeCabReq: FeCabReq;
	public FECAEDetRequest: FECAEDetRequest;
	public CbteTipo: any;

	constructor() {
		this.FeCabReq = {
			CantReg: 0,
			PtoVta: 0,
			CbteTipo: 0,
		};

		this.FECAEDetRequest = {
			Concepto: 0,
			DocTipo: 0,
			DocNro: 0,
			CbteDesde: 0,
			CbteHasta: 0,
			CbteFch: '',
			ImpTotal: 0,
			ImpTotConc: 0,
			ImpNeto: 0,
			ImpOpEx: 0,
			ImpTrib: 0,
			ImpIVA: 0,
			FchServDesde: '',
			FchServHasta: '',
			FchVtoPago: '',
			MonId: '',
			MonCotiz: 0,
			CbtesAsoc: [],
			Tributos: [],
			Iva: [],
			Opcionales: [],
			Compradores: [],
			PeriodoAsoc: {
				FchDesde: '',
				FchHasta: '',
			},
			Actividades: [],
		};
	}

	reset(): void {
		this.FeCabReq = {
			CantReg: 0,
			PtoVta: 0,
			CbteTipo: 0,
		};

		this.FECAEDetRequest = {
			Concepto: 0,
			DocTipo: 0, //Código de documento identificatorio del comprador
			DocNro: 0,
			CbteDesde: 0,
			CbteHasta: 0,
			CbteFch: '',
			ImpTotal: 0,
			ImpTotConc: 0,
			ImpNeto: 0,
			ImpOpEx: 0,
			ImpTrib: 0,
			ImpIVA: 0,
			FchServDesde: '',
			FchServHasta: '',
			FchVtoPago: '',
			MonId: '',
			MonCotiz: 0,
			CbtesAsoc: [],
			Tributos: [],
			Iva: [],
			Opcionales: [],
			Compradores: [],
			PeriodoAsoc: {
				FchDesde: '',
				FchHasta: '',
			},
			Actividades: [],
		};
	}

	setCantReg(CantReg?: any): void {
		this.FeCabReq.CantReg = parseInt(CantReg);
	}
	setPtoVta(PtoVta?: any): void {
		this.FeCabReq.PtoVta = parseInt(PtoVta);
	}
	setCbteTipo(CbteTipo?: any): void {
		this.FeCabReq.CbteTipo = parseInt(CbteTipo);
	}
	setConcepto(Concepto?: any): void {
		this.FECAEDetRequest.Concepto = parseInt(Concepto);
	}

	setDocTipo(DocTipo?: any): void {
		this.FECAEDetRequest.DocTipo = parseInt(DocTipo);
	}

	setDocNro(DocNro?: any): void {
		this.FECAEDetRequest.DocNro = DocNro;
	}

	setCbteDesde(nro?: any): void {
		this.FECAEDetRequest.CbteDesde = nro;
	}

	setCbteHasta(nro?: any): void {
		this.FECAEDetRequest.CbteHasta = nro;
	}

	setCbteFch(CbteFch?: any): void {
		this.FECAEDetRequest.CbteFch = CbteFch.toString();
	}

	setImpTotal(ImpTotal: number): void {
		this.FECAEDetRequest.ImpTotal = ImpTotal;
	}
	/**
	 *
	 * @param ImpTotConc Importe neto no gravado.
	 * Debe ser menor o igual a Importe total y
	 * no puede ser menor a cero.
	 * No puede ser mayor al Importe total de la
	 * operación ni menor a cero (0).
	 * Para comprobantes tipo C debe ser igual
	 * a cero (0).
	 * Para comprobantes tipo Bienes Usados –
	 * Emisor Monotributista este campo
	 * corresponde al importe subtotal.
	 */
	setImpTotConc(ImpTotConc: number = 0): void {
		this.FECAEDetRequest.ImpTotConc = ImpTotConc;
	}

	setImpOpEx(ImpOpEx: number = 0): void {
		this.FECAEDetRequest.ImpOpEx = ImpOpEx;
	}

	setImpTrib(ImpTrib?: any): void {
		this.FECAEDetRequest.ImpTrib = parseFloat(ImpTrib);
	}

	setImpIVA(ImpIVA: number = 0): void {
		this.FECAEDetRequest.ImpIVA = ImpIVA;
	}

	setFchServDesde(FchServDesde?: any): void {
		this.FECAEDetRequest.FchServDesde = FchServDesde.toString();
	}

	setFchServHasta(FchServHasta?: any): void {
		this.FECAEDetRequest.FchServHasta = FchServHasta.toString();
	}

	setFchVtoPago(CbteFch: string, days: number): void {
		this.FECAEDetRequest.FchVtoPago = moment(CbteFch, 'YYYYMMDD').add(days, 'days').format('YYYYMMDD').toString();
	}

	setMonId(MonId?: any): void {
		this.FECAEDetRequest.MonId = MonId.toString();
	}

	setMonCotiz(MonCotiz?: any): void {
		this.FECAEDetRequest.MonCotiz = parseFloat(MonCotiz);
	}

	abstract setImpNeto(ImpNeto: number): void;

	abstract setIvaAarray(ivas?: Ivas[]): void;

	abstract setCbtesAsoc(value?: any): void;

	abstract setTributos(value?: any): void;

	abstract setOpcionales(value?: any): void;

	abstract setCompradores(value?: any): void;

	abstract setPeriodoAsoc(value?: any): void;

	abstract setActividades(value?: any): void;

	build() {
		return {
			FeCabReq: this.FeCabReq,
			FECAEDetRequest: this.FECAEDetRequest,
		};
	}
}
