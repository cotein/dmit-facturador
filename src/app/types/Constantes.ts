import type { Iva } from './Iva';

export const COMPANY_MODEL: string = 'App/Model/Company';

export const CUIT_ID: number = 25;

export const URL_UPLOAD_AVATAR: string = 'http://localhost:8001/api/uploadAvatar';

export enum AFIP_INSCRIPTION {
	IVA_RESPONSABLE_INSCRIPTO = 1,
	IVA_RESPONSABLE_NO_INSCRIPTO = 2,
	IVA_NO_RESPONSABLE = 3,
	IVA_SUJETO_EXENTO = 4,
	CONSUMIDOR_FINAL = 5,
	RESPONSABLE_MONOTRIBUTO = 6,
	SUJETO_NO_CATEGORIZADO = 7,
	PROVEEDOR_DEL_EXTERIOR = 8,
	CLIENTE_DEL_EXTERIOR = 9,
	IVA_LIBERADO = 10,
	IVA_RESPONSABLE_INSCRIPTO_AGENTE_DE_PERCEPCION = 11,
	PEQUEÑO_CONTRIBUYENTE = 12,
	MONOTRIBUTISTA_SOCIAL = 13,
	PEQUEÑO_CONTRIBUYENTE_SOCIAL = 14,
}

export enum INVOICE_TYPE {
	FACTURA = 1,
	NOTA_DE_DEBITO = 2,
	NOTA_DE_CREDITO = 3,
	FACTURA_A = 1,
	FACTURA_B = 6,
	FACTURA_C = 11,
	NOTA_DEBITO_A = 2,
	NOTA_DEBITO_B = 7,
	NOTA_DEBITO_C = 12,
	NOTA_CREDITO_A = 3,
	NOTA_CREDITO_B = 8,
	NOTA_CREDITO_C = 13,
}

export const INVOICE_CANT_REG = 1;

export const SELECT_INVOICE_TYPE = {
	[INVOICE_TYPE.FACTURA_A]: INVOICE_TYPE.FACTURA,
	[INVOICE_TYPE.FACTURA_B]: INVOICE_TYPE.FACTURA,
	[INVOICE_TYPE.FACTURA_C]: INVOICE_TYPE.FACTURA,
	[INVOICE_TYPE.NOTA_DEBITO_A]: INVOICE_TYPE.NOTA_DE_DEBITO,
	[INVOICE_TYPE.NOTA_DEBITO_B]: INVOICE_TYPE.NOTA_DE_DEBITO,
	[INVOICE_TYPE.NOTA_DEBITO_C]: INVOICE_TYPE.NOTA_DE_DEBITO,
	[INVOICE_TYPE.NOTA_CREDITO_A]: INVOICE_TYPE.NOTA_DE_CREDITO,
	[INVOICE_TYPE.NOTA_CREDITO_B]: INVOICE_TYPE.NOTA_DE_CREDITO,
	[INVOICE_TYPE.NOTA_CREDITO_C]: INVOICE_TYPE.NOTA_DE_CREDITO,
};

export enum AFIP_VOUCHERS {
	NO_GRAVADO = 2, //son los ids
	EXENTO = 3,
	ZERO_PORCIENTO = 4,
	DIEZ_COMA_CINCO = 5,
	VEINTI_UNO = 6,
	VEINTI_SIETE = 7,
	GRAVADO = 8,
	CINCO = 9,
	DOS_COMA_CINCO = 10,
}

export const AFIP_IVA: Iva[] = [
	{ code: '0', name: 'No Corresponde', percentage: 0 },
	{ code: '1', name: 'No Gravado', percentage: 0 },
	{ code: '2', name: 'Exento', percentage: 0 },
	{ code: '3', name: '0%', percentage: 0 },
	{ code: '4', name: '10,50%', percentage: 10.5 },
	{ code: '5', name: '21%', percentage: 21 },
	{ code: '6', name: '27%', percentage: 27 },
	{ code: '7', name: 'Gravado', percentage: 0 },
	{ code: '8', name: '5%', percentage: 5 },
	{ code: '9', name: '2,50%', percentage: 2.5 },
];
