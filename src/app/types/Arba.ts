export type Contribuyente = {
    cuitContribuyente: string;
    alicuotaPercepcion: string;
    alicuotaRetencion: string;
    grupoPercepcion: string;
    grupoRetencion: string;
};

export type Contribuyentes = {
    '@attributes': Record<string, any>;
    contribuyente: Contribuyente;
};

export type SimpleXMLElementArba = {
    numeroComprobante: string;
    fechaDesde: string;
    fechaHasta: string;
    cantidadContribuyentes: string;
    contribuyentes: Contribuyentes;
};
