import QrCodeBase from '../QrCodeBase';
import QRious from 'qrious';
import moment from 'moment';

class QrAfip {
	public ver: number;
	public date: string;
	public cuit: number;
	public ptoVta: number;
	public CbteTipo: number;
	public nroCbte: number;
	public importe: number;
	public money: string;
	public ctz: number;
	public tipoDocRec: number;
	public nroDocRec: number;
	public tipoCodAut: string = 'E';
	public codAut: number;
	public url_afip: string = 'https://www.afip.gob.ar/fe/qr/?p=';
	/**
     *
     * @param {*} ver
     * @param {*} date
     * @param {*} cuit
     * @param {*} ptoVta
     * @param {*} CbteTipo
     * @param {*} nroCbte
     * @param {*} importe
     * @param {*} money
     * @param {*} ctz
     * @param {*} tipoDocRec
     * @param {*} nroDocRec
     * @param {*} tipoCodAut
     * @param {*} codAut
     * Especificación Técnica:
        El código QR deberá codificar el siguiente texto:

        {URL}?p={DATOS_CMP_BASE_64}
        Donde:
        {URL} = https://www.afip.gob.ar/fe/ qr/

        {DATOS_CMP_BASE_64} = JSON con datos del comprobante codificado en Base64

        La especificación del JSON con los datos del comprobante es la siguiente (versión 1):
        Campo	Tipo	Descripción	Valor ejemplo
        ver	Numérico 1 digito	OBLIGATORIO – versión del formato de los datos del comprobante	1
        fecha	full-date (RFC3339)	OBLIGATORIO – Fecha de emisión del comprobante	"2020-10-13"
        cuit	Numérico 11 dígitos	OBLIGATORIO – Cuit del Emisor del comprobante	30000000007
        ptoVta	Numérico hasta 5 digitos	OBLIGATORIO – Punto de venta utilizado para emitir el comprobante	10
        tipoCmp	Numérico hasta 3 dígitos	OBLIGATORIO – tipo de comprobante (según Tablas del sistema )	1
        nroCmp	Numérico hasta 8 dígitos	OBLIGATORIO – Número del comprobante	94
        importe	Decimal hasta 13 enteros y 2 decimales	OBLIGATORIO – Importe Total del comprobante (en la moneda en la que fue emitido)	12100
        moneda	3 caracteres	OBLIGATORIO – Moneda del comprobante (según Tablas del sistema )	"DOL"
        ctz	Decimal hasta 13 enteros y 6 decimales	OBLIGATORIO – Cotización en pesos argentinos de la moneda utilizada (1 cuando la moneda sea pesos)	65
        tipoDocRec	Numérico hasta 2 dígitos	DE CORRESPONDER – Código del Tipo de documento del receptor (según Tablas del sistema )	80
        nroDocRec	Numérico hasta 20 dígitos	DE CORRESPONDER – Número de documento del receptor correspondiente al tipo de documento indicado	20000000001
        tipoCodAut	string	OBLIGATORIO – “A” para comprobante autorizado por CAEA, “E” para comprobante autorizado por CAE	"E"
        codAut	Numérico 14 dígitos	OBLIGATORIO – Código de autorización otorgado por AFIP para el comprobante	70417054367476
     */
	constructor(
		ver: number,
		date: string,
		cuit: number,
		ptoVta: number,
		CbteTipo: number,
		nroCbte: number,
		importe: number,
		money: string,
		ctz: number,
		tipoDocRec: number,
		nroDocRec: number,
		tipoCodAut: string,
		codAut: number,
	) {
		this.ver = ver;
		this.date = date;
		this.cuit = cuit;
		this.ptoVta = ptoVta;
		this.CbteTipo = CbteTipo;
		this.nroCbte = nroCbte;
		this.importe = importe;
		this.money = money;
		this.ctz = ctz;
		this.tipoDocRec = tipoDocRec;
		this.nroDocRec = nroDocRec;
		this.tipoCodAut = tipoCodAut;
		this.codAut = codAut;
	}

	generate_base_64() {
		const objJsonStr = JSON.stringify({
			ver: this.ver,
			date: moment(this.date).format('YYYY-MM-DD'),
			cuit: this.cuit,
			ptoVta: this.ptoVta,
			CbteTipo: this.CbteTipo,
			nroCbte: this.nroCbte,
			importe: this.importe,
			money: this.money,
			ctz: this.ctz,
			tipoDocRec: this.tipoDocRec,
			nroDocRec: this.nroDocRec,
			tipoCodAut: this.tipoCodAut,
			codAut: this.codAut,
		});
		console.log('objJsonStr');
		console.log(objJsonStr);
		console.log('objJsonStr');
		return Buffer.from(objJsonStr).toString('base64');
	}

	generate_qr() {
		const qr = new QRious({
			value: this.url_afip + this.generate_base_64(),
		});
		return qr.toDataURL();
	}
}

export default QrAfip;
