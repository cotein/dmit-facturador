import { ApiHttp } from '../base-api';

/**
 * Código de Operación de Traslado (COT) de ARBA.
 *
 * El COT se genera STANDALONE: es una entidad previa al traslado y nunca sale de
 * una factura. La factura es el respaldo y se referencia por id interno.
 */

export type CotSujetoGenerador = 'E' | 'D';

export type CotProducto = {
    codigo: string;
    cantidad: string | number;
    importe: string | number;
};

export type CotDomicilio = {
    provincia: string;
    localidad: string;
    domicilio: string;
    codigoPostal: string;
};

export type CotBorrador = {
    sujetoGenerador: CotSujetoGenerador;
    fechaEmision: string;
    fechaSalidaTransporte: string;
    puntoVenta: string;
    numeroRemito: string;
    origen: CotDomicilio;
    destino: CotDomicilio & {
        cuit: string;
        razonSocial: string;
    };
    productos: CotProducto[];
    facturaId?: number | null;
};

export type CotCatalogos = {
    provincias: Array<{ codigo: string; nombre: string }>;
    puntosTraslado: Array<{ id: number; nombre: string }>;
    nomenclador: Array<{ codigo: string; descripcion: string; unidadMedida: string }>;
};

export type CotEstado = 'borrador' | 'encolado' | 'emitido' | 'rechazado' | 'anulado';

export type Cot = CotBorrador & {
    id: number;
    estado: CotEstado;
    numeroCot: string | null;
    numeroComprobante: string | null;
    errores: string[] | null;
    archivoNombre: string | null;
};

export type CotListado = {
    data: Cot[];
    meta: { currentPage: number; lastPage: number; total: number; perPage: number };
};

/** Catálogos que necesita la pantalla para llenar los selects. */
export const getCotCatalogos = async (): Promise<CotCatalogos> => {
    const { data } = await ApiHttp.get<CotCatalogos>('/arba/cot/catalogos');

    return data;
};

/** Crea el COT en borrador. Todavía no se contacta a ARBA. */
export const crearCot = async (borrador: CotBorrador): Promise<Cot> => {
    const { data } = await ApiHttp.post<Cot>('/arba/cot', borrador);

    return data;
};

export const listarCots = async (params: Record<string, string | number> = {}): Promise<CotListado> => {
    const { data } = await ApiHttp.get<CotListado>('/arba/cot', { params });

    return data;
};

export const obtenerCot = async (id: number): Promise<Cot> => {
    const { data } = await ApiHttp.get<Cot>(`/arba/cot/${id}`);

    return data;
};

/** Sólo se puede editar mientras el COT siga en borrador. */
export const actualizarCot = async (id: number, borrador: CotBorrador): Promise<Cot> => {
    const { data } = await ApiHttp.put<Cot>(`/arba/cot/${id}`, borrador);

    return data;
};

/** Encola la emisión: arma el TXT, lo manda a ARBA y guarda el resultado. */
export const emitirCot = async (id: number): Promise<Cot> => {
    const { data } = await ApiHttp.post<Cot>(`/arba/cot/${id}/emitir`);

    return data;
};

export const anularCot = async (id: number): Promise<Cot> => {
    const { data } = await ApiHttp.post<Cot>(`/arba/cot/${id}/anular`);

    return data;
};

/** Descarga el TXT tal como se envió a ARBA. */
export const descargarCot = async (id: number): Promise<Blob> => {
    const { data } = await ApiHttp.get(`/arba/cot/${id}/archivo`, { responseType: 'blob' });

    return data as Blob;
};
