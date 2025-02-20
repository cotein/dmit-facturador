import type { Iva } from './Iva';

export const COMPANY_MODEL: string = 'App/Model/Company';

export const CUIT_ID: number = 25;

export const ZERO = 0;

export const URL_UPLOAD_AVATAR: string = `${import.meta.env.VITE_URL_BASE_API}/api/uploadAvatar`;
export const URL_UPLOAD_COMPANY_LOGO: string = `${import.meta.env.VITE_URL_BASE_API}/api/company/uploadLogo`;

export enum CONCEPTO {
    PRODUCTOS = 1,
    SERVICIOS = 2,
    PRODUCTOS_Y_SERVICIOS = 3,
}
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
    MIPYME_FACTURA_A = 201,
    MIPYME_FACTURA_B = 206,
    MIPYME_FACTURA_C = 211,
    MIPYME_NOTA_DEBITO_A = 202,
    MIPYME_NOTA_DEBITO_B = 207,
    MIPYME_NOTA_DEBITO_C = 212,
    MIPYME_NOTA_CREDITO_A = 203,
    MIPYME_NOTA_CREDITO_B = 208,
    MIPYME_NOTA_CREDITO_C = 213,
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

export enum AFIP_IVAS {
    AFIP_CODE_CERO = 3,
    AFIP_CODE_DIEZ_COMA_CINCO = 4,
    AFIP_CODE_VEINTI_UNO = 5,
    AFIP_CODE_VEINTI_SIETE = 6,
    AFIP_CODE_CINCO = 8,
    AFIP_CODE_DOS_COMA_CINCO = 9,
    AFIP_ID_CERO = 1,
    AFIP_ID_DIEZ_COMA_CINCO = 2,
    AFIP_ID_VEINTI_UNO = 3,
    AFIP_ID_VEINTI_SIETE = 4,
    AFIP_ID_CINCO = 5,
    AFIP_ID_DOS_COMA_CINCO = 2,
}

export const AFIP_IVA: Iva[] = [
    { code: '3', name: '0%', percentage: 0 },
    { code: '4', name: '10,50%', percentage: 10.5 },
    { code: '5', name: '21%', percentage: 21 },
    { code: '6', name: '27%', percentage: 27 },
    { code: '8', name: '5%', percentage: 5 },
    { code: '9', name: '2,50%', percentage: 2.5 },
];

export const TypeCompany = {
    JURIDICA: 1 as 1,
    FISICA: 2 as 2,
    UNDEFINED: undefined as undefined,
};

export type TypeCompany = (typeof TypeCompany)[keyof typeof TypeCompany];

// SE UTILIZA PARA DEFINIR EL HEIGHT Y WIDTH DEL DIV DONDE SE
// IMPRIMIRAN LOS COMENTARIOS DE LOS COMPROBANTES DE VENTAS
export const HTML2CANVAS_SCALE = {
    scale_02: {
        scale: 0.2,
        width: '910px',
        height: '500px',
    },
};

export enum TYPE_USER {
    ROOT = 1000,
    ADMINISTRADOR = 900,
    USUARIO = 100,
}

// PAGINATION
export const DEFAULT_CURRENT_PAGE = 1;
export const PAGINATION_ITEMS_PER_PAGE_200 = 200;
export const PAGINATION_ITEMS_PER_PAGE_150 = 150;
export const PAGINATION_ITEMS_PER_PAGE_100 = 100;
export const PAGINATION_ITEMS_PER_PAGE_50 = 50;
export const PAGINATION_ITEMS_PER_PAGE_30 = 30;
export const PAGINATION_ITEMS_PER_PAGE_10 = 10;
export const PAGINATION_ITEMS_PER_PAGE_5 = 5;
export const PAGINATION_PAGE_ONE = 1;

//HOURS IN MLS
export const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
export const ONE_MINUTE_IN_MS = 1000 * 60;
export const ONE_HOUR_IN_MS = 1000 * 60 * 60;
