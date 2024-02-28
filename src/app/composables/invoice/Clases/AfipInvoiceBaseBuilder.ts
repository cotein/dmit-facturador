import type { CbteAsoc } from './../../../types/Afip';
import type { FECAEDetRequest, FeCabReq } from '@/app/types/Afip';
import type { CustomerInvoice, CustomerOnSaleInvoice } from '@/app/types/Customer';
import type { ProductForNotaCredito, ProductOnInvoiceTable } from '@/app/types/Product';
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

	/**
	 *
	 * @param CantReg int (4)
	 * Cantidad de registros del detalle del
	 * comprobante o lote de comprobantes de
	 * ingreso
	 */
	setCantReg(CantReg?: any): void {
		this.FeCabReq.CantReg = parseInt(CantReg);
	}

	/**
	 * Int (5)
	 * Punto de Venta del comprobante que se está
	 * informando. Si se informa más de un
	 * comprobante, todos deben corresponder al
	 * mismo punto de venta.
	 * @param PtoVta
	 */
	setPtoVta(PtoVta?: any): void {
		this.FeCabReq.PtoVta = parseInt(PtoVta);
	}

	/**
	 * Int (3)
	 * Tipo de comprobante que se está
	 * informando. Si se informa más de un
	 * comprobante, todos deben ser del mismo
	 * tipo.
	 * @param CbteTipo
	 */
	setCbteTipo(CbteTipo?: any): void {
		this.FeCabReq.CbteTipo = parseInt(CbteTipo);
	}

	/**
	 * Int(2)
	 * 1 Productos
	 * 2 Servicios
	 * 3 Productos y Servicios
	 * @param Concepto
	 */
	setConcepto(Concepto: string): void {
		this.FECAEDetRequest.Concepto = parseInt(Concepto);
	}

	/**
	 * Código de documento identificatorio del comprador cuit 80 | Long (2)
	 * Viene de invoice
	 * @param customer
	 */
	setDocTipo(customer: CustomerInvoice | CustomerOnSaleInvoice): void {
		if ('value' in customer) {
			this.FECAEDetRequest.DocTipo = parseInt(customer.afip_document.afip_code);
		}

		if ('name' in customer) {
			this.FECAEDetRequest.DocTipo = parseInt(customer.afipDocTipo);
		}
	}

	/**
	 * Nro. De identificación del comprador | Long (11)
	 * Viene de invoice
	 * @param customer
	 */
	setDocNro(customer: CustomerInvoice | CustomerOnSaleInvoice): void {
		this.FECAEDetRequest.DocNro = customer.cuit;
	}

	/**
	 * Long (8) Nro. De comprobante desde Rango 1- 99999999
	 * Viene de invoice
	 * @param nro
	 */
	setCbteDesde(nro: number): void {
		this.FECAEDetRequest.CbteDesde = nro;
	}

	/**
	 * Long (8) Nro. De comprobante hasta Rango 1- 99999999
	 * Viene de invoice
	 * @param nro
	 */
	setCbteHasta(nro: number): void {
		this.FECAEDetRequest.CbteHasta = nro;
	}

	/**
	 * String (8)
	 * Fecha del comprobante (yyyymmdd).
	 * Para concepto igual a 1, la fecha de
	 * emisión del comprobante puede ser hasta
	 * 5 días anteriores o posteriores respecto
	 * de la fecha de generación: La misma no
	 * podrá exceder el mes de presentación. Si
	 * se indica Concepto igual a 2 ó 3 puede
	 * ser hasta 10 días anteriores o posteriores
	 * a la fecha de generación. Si no se envía
	 * la fecha del comprobante se asignará la
	 * fecha de proceso.
	 * Para comprobantes del tipo MiPyMEs
	 * (FCE) del tipo Factura, la fecha de
	 * emisión del comprobante debe ser desde
	 * 5 días anteriores y hasta 1 día posterior
	 * respecto de la fecha de generación. Para
	 * notas de débito y crédito es hasta 5 dias
	 * anteriores y tiene que ser posterior o igual
	 * a la fecha del comprobante asociado.
	 *
	 * Viene de invoice
	 * @param CbteFch
	 */
	setCbteFch(CbteFch: string): void {
		this.FECAEDetRequest.CbteFch = CbteFch.toString();
	}

	/**
	 *
	 * @param invoiceTableData Double  (13+2)
	 * Importe total del comprobante, Debe ser
	 * igual a Importe neto no gravado + Importe
	 * exento + Importe neto gravado + todos los
	 * campos de IVA al XX% + Importe de
	 * tributos.
	 */
	abstract setImpTotal(invoiceTableData: ProductOnInvoiceTable[] | ProductForNotaCredito[]): void; //this.FECAEDetRequest.ImpTotal = ImpTotal;

	/**
	 *
	 * @param invoiceTableData Importe neto no gravado.
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
	abstract setImpTotConc(invoiceTableData: ProductOnInvoiceTable[] | ProductForNotaCredito[]): void; //this.FECAEDetRequest.ImpTotConc = ImpTotConc;

	/**
	 *
	 * @param invoiceTableData Double (13+2)
	 * Importe exento. Debe ser menor o igual a
	 * Importe total y no puede ser menor a
	 * cero.
	 * Para comprobantes tipo C debe ser igual
	 * a cero (0).
	 * Para comprobantes tipo Bienes Usados –
	 * Emisor Monotributista no debe informarse
	 * o debe ser igual a cero (0).
	 */
	abstract setImpOpEx(invoiceTableData: ProductOnInvoiceTable[] | ProductForNotaCredito[]): void; //this.FECAEDetRequest.ImpOpEx = ImpOpEx;

	/**
	 *
	 * @param invoiceTableData Suma de los importes del array de tributos
	 */
	abstract setImpTrib(invoiceTableData: ProductOnInvoiceTable[] | ProductForNotaCredito[]): void; //this.FECAEDetRequest.ImpTrib = parseFloat(ImpTrib);

	/**
	 *
	 * @param invoiceTableData Suma de los importes del array de IVA.
	 * Para comprobantes tipo C debe ser igual
	 * a cero (0).
	 * Para comprobantes tipo Bienes Usados –
	 * Emisor Monotributista no debe informarse
	 * o debe ser igual a cero (0).
	 */
	abstract setImpIVA(invoiceTableData: ProductOnInvoiceTable[] | ProductForNotaCredito[]): void; //this.FECAEDetRequest.ImpIVA = ImpIVA;

	/**
	 *
	 * @param FchServDesde String (8)
	 * @param concepto String (1)
	 * Fecha de inicio del abono para el
	 * servicio a facturar. Dato obligatorio para
	 * concepto 2 o 3 (Servicios / Productos y
	 * Servicios). Formato yyyymmdd
	 *
	 * viene de invoice
	 */
	setFchServDesde(FchServDesde: string): void {
		this.FECAEDetRequest.FchServDesde = FchServDesde;
	}

	/**
	 *
	 * @param FchServHasta String (8)
	 * Fecha de fin del abono para el servicio a
	 * facturar. Dato obligatorio para concepto
	 * 2 o 3 (Servicios / Productos y Servicios).
	 * Formato yyyymmdd. FchServHasta no
	 * puede ser menor a FchServDesde
	 *
	 * viene de invoice
	 */
	setFchServHasta(FchServHasta: string): void {
		this.FECAEDetRequest.FchServHasta = FchServHasta;
	}

	/**
	 * Fecha de vencimiento del pago servicio
	 * a facturar. Dato obligatorio para
	 * concepto 2 o 3 (Servicios / Productos y
	 * Servicios) o Facturas del tipo MiPyMEs
	 * (FCE). Formato yyyymmdd. Debe ser
	 * igual o posterior a la fecha del
	 * comprobante.
	 * @param fchVtoPago
	 * @param days
	 */
	setFchVtoPago(fchVtoPago: string): void {
		this.FECAEDetRequest.FchVtoPago = fchVtoPago;
	}

	/**
	 *
	 * @param MonId String (3)
	 * Código de moneda del comprobante.
	 * Consultar método
	 * FEParamGetTiposMonedas para valores
	 * posibles
	 */
	setMonId(MonId: string): void {
		this.FECAEDetRequest.MonId = MonId.toString();
	}

	setMonCotiz(MonCotiz: number): void {
		this.FECAEDetRequest.MonCotiz = MonCotiz;
	}

	/**
	 * Double (13+2)
	 * Importe neto gravado. Debe ser menor o
	 * igual a Importe total y no puede ser menor
	 * a cero. Para comprobantes tipo C este
	 * campo corresponde al Importe del Sub
	 * Total.
	 * Para comprobantes tipo Bienes Usados –
	 * Emisor Monotributista no debe informarse
	 * o debe ser igual a cero (0).
	 * @param invoiceTableData
	 */
	abstract setImpNeto(invoiceTableData: ProductOnInvoiceTable[] | ProductForNotaCredito[]): void;

	/**
	 * Array para informar las alícuotas y sus
	 * importes asociados a un comprobante
	 * <AlicIva>.
	 * Para comprobantes tipo C y Bienes
	 * Usados – Emisor Monotributista no debe
	 * informar el array.
	 * @param ivas
	 */
	abstract setIvaAarray(invoiceTableData: ProductOnInvoiceTable[] | ProductForNotaCredito[]): void;

	abstract setCbtesAsoc(CbteAsoc?: CbteAsoc): void;

	/**
	 * Array para informar los tributos asociados
	 * a un comprobante <Tributo>.
	 * @param value
	 */
	abstract setTributos(value?: any): void;

	/**
	 *
	 * @param value Array de campos auxiliares. Reservado
	 * usos futuros <Opcional>. Adicionales por
	 * R.G.
	 */
	abstract setOpcionales(value?: any): void;

	/**
	 *
	 * @param value Array para informar los múltiples
	 * compradores.
	 */
	abstract setCompradores(value?: any): void;

	/**
	 * Estructura compuesta por la fecha desde
	 * y la fecha hasta del periodo que se quiere
	 * identificar
	 * @param value
	 */
	abstract setPeriodoAsoc(value?: any): void;

	/**
	 * Array para informar las actividades
	 * asociadas a un comprobante.
	 * @param [value]
	 */
	abstract setActividades(value?: any): void;

	build() {
		return {
			FeCabReq: this.FeCabReq,
			FECAEDetRequest: this.FECAEDetRequest,
		};
	}
}
