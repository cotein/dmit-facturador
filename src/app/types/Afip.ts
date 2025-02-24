import type { Dayjs } from 'dayjs';
import type { Customer } from './Invoice';

export type AfipInscription = {
    id: number;
    name: string;
};

export type AfipState = {
    id: number;
    name: string;
};

export type AfipIva = {
    value: number;
    label: string;
    code: string;
};
export type AfipVoucher = {
    value: number;
    label: string;
    code: string;
};

export type DatosGenerales = {
    apellido: string;
    domicilioFiscal: DomicilioFiscal;
    estadoClave: string;
    idPersona: number;
    mesCierre: number;
    nombre?: string;
    razonSocial?: string;
    tipoClave: string;
    tipoPersona: string;
};

export type DomicilioFiscal = {
    codPostal: string;
    descripcionProvincia: string;
    direccion: string;
    idProvincia: number;
    localidad: string;
    tipoDomicilio: string;
};

export type DatosRegimenGeneral = {
    actividad: Actividad[] | Object;
    impuesto: Impuesto[] | Object;
    regimen: Regimen[] | Object;
};

export type Actividad = {
    descripcionActividad: string;
    idActividad: number;
    nomenclador: number;
    orden: number;
    periodo: number;
};

export type Impuesto = {
    descripcionImpuesto: string;
    idImpuesto: number;
    periodo: number;
};

export type Regimen = {
    descripcionRegimen: string;
    idImpuesto: number;
    idRegimen: number;
    periodo: number;
    tipoRegimen: string;
};

export type DatosMonotributo = {
    actividadMonotributista: Actividad;
    categoriaMonotributo: CategoriaMonotributo;
    impuesto: Impuesto;
};

export type CategoriaMonotributo = {
    descripcionCategoria: string;
    idCategoria: number;
    idImpuesto: number;
    periodo: number;
};

export type Metadata = {
    fechaHora: string;
    servidor: string;
};

export type PersonaReturn = {
    idPersonaListReturn?: IdPersonaListReturn;
    errorConstancia?: ErrorConstancia;
    datosGenerales: DatosGenerales;
    datosMonotributo?: DatosMonotributo;
    datosRegimenGeneral: DatosRegimenGeneral;
    metaData: Metadata;
};

export type ErrorConstancia = {
    apellido: string;
    error: string;
    idPersona: number;
    nombre: string;
};

export type IdPersonaListReturn = {
    idPersona: number;
    metadata: Metadata;
};

export type FEUltimoAutorizado = {
    FECompUltimoAutorizadoResult: {
        CbteNro: number;
        CbteTipo: number;
        PtoVta: number;
    };
};

export type AfipInvoice = {
    aditional_percentage: number;
    CantReg: number;
    CbteDesde: number;
    CbteFch: string;
    CbteHasta: number;
    CbteNro: number;
    CbtesAsoc?: CbtesAsoc;
    CbteTipo: number | null;
    comments?: string | null;
    company_id: number | undefined;
    Concepto: string;
    customer: Customer | null;
    CondicionIVAReceptorId: number;
    date: Dayjs | undefined;
    dateVtoPago: Dayjs | undefined;
    DocTipo: number | null;
    FchServDesde: string;
    FchServHasta: string;
    FchVtoPago?: string;
    ImpIVA: number;
    ImpNeto: number;
    ImpOpEx: number;
    ImpTotal: number | null;
    ImpTotConc: number;
    ImpTrib: number;
    Iva?: Iva | null;
    MonCotiz: number;
    MonId: string;
    paymentType: number | null;
    percepIIBB: number | null;
    percepIva: number | null;
    periodoAsoc?: [FchDesde: string, FchHasta: string] | undefined;
    products: [] | null;
    PtoVta: number | null;
    SaleCondition: number;
    Tributos?: Tributos | null;
    type_details: string | null;
    voucher: number | null;
    isMiPyme: boolean;
};

export type VoucherOption = {
    afip_code: string;
    id: number;
    name: string;
};

export type FeCabReq = {
    CantReg: number;
    PtoVta: number;
    CbteTipo: number;
};

export type FeDetReq = {
    FECAEDetRequest: FECAEDetRequest;
};

export type FECAEDetRequest = {
    Actividades?: Actividad[] | null;
    CbteDesde: number;
    CbteFch: string;
    CbteHasta: number;
    CbtesAsoc?: CbteAsoc[] | null;
    Compradores?: Comprador[] | null;
    Concepto: number;
    CondicionIVAReceptorId: number;
    DocNro: number;
    DocTipo: number;
    FchServDesde: string;
    FchServHasta: string;
    FchVtoPago?: string;
    ImpIVA: number;
    ImpNeto: number;
    ImpOpEx: number;
    ImpTotal: number;
    ImpTotConc: number;
    ImpTrib: number;
    Iva?: AlicIva[] | null;
    MonCotiz: number;
    MonId: string;
    Opcionales?: Opcional[] | null;
    PeriodoAsoc?: PeriodoAsoc | null;
    Tributos?: Tributo[] | null;
};

export type CbteAsoc = {
    Tipo: number;
    PtoVta: number;
    Nro: number;
    Cuit: number;
    CbteFch: string;
};

export type CbtesAsoc = CbteAsoc[];

export type Tributo = {
    Id: number;
    Desc: string;
    BaseImp: number;
    Alic: number;
    Importe: number;
};

export type Tributos = Tributo[];

export type AlicIva = {
    Id: number;
    BaseImp: number;
    Importe: number;
};

export type Iva = AlicIva[];

export type Ivas = { name: string; import: number; id: number; subtotal: number };

export const BillingConcepts = [
    {
        key: 'Productos',
        value: '1',
    },
    {
        key: 'Servicios',
        value: '2',
    },
    {
        key: 'Productos y Servicios',
        value: '3',
    },
];

export type Opcional = {
    Id: string;
    Valor: string | number;
};

export type Comprador = {
    DocTipo: number;
    DocNro: number;
    Porcentaje: number;
};

export type PeriodoAsoc = { FchDesde: string; FchHasta: string };

// Generated by https://quicktype.io

export type FEParamGetPtosVentaResultAxiosData = {
    FEParamGetPtosVentaResult: {
        ResultGet: {
            PtoVenta: {
                Nro: number;
                EmisionTipo: string;
                Bloqueado: string;
                FchBaja: string | null;
            }[];
        };
    };
};

export type FEDetResponse = {
    Concepto: number;
    DocTipo: number;
    DocNro: number;
    CbteDesde: number;
    CbteHasta: number;
    Resultado: string;
    CAE: string;
    CbteFch: string;
    CAEFchVto: string;
    Obs: Observaciones;
};

export type Observaciones = {
    Observacion: Observacion[];
};

export type Observacion = {
    Code: number;
    Msg: string;
};

export type FeCabResp = {
    Cuit: number;
    PtoVta: number;
    CbteTipo: number;
    FchProceso: string;
    CantReg: number;
    Resultado: string;
    Reproceso: string;
};

export type Evt = {
    Code: number;
    Msg: string;
};

export type Events = {
    Evt: Evt[];
};

export type Err = {
    Code: number;
    Msg: string;
};

export type Errors = {
    Err: Err[];
};

export type FECAESolicitarResult = {
    FeCabResp: FeCabResp;
    FeDetResp: {
        FEDetResponse: FEDetResponse[];
    };
    Events?: Events;
    Errors?: Errors;
};

export enum INVOICE_CONCEPTS {
    PRODUCTOS = 1,
    SERVICIOS = 2,
    PRODUCTOS_Y_SERVICIOS = 3,
}
