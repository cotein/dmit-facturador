import type { FECAEDetRequest, FeCabReq, Ivas } from '@/app/types/Afip';

export interface AfipInvoiceBuilderContract {
    FeCabReq: FeCabReq;
    FECAEDetRequest: FECAEDetRequest;

    setCantReg(CantReg: any): void;
    setPtoVta(PtoVta: any): void;
    setCbteTipo(CbteTipo: any): void;
    setConcepto(Concepto: any): void;
    setDocTipo(DocTipo: any): void;
    setDocNro(DocNro: any): void;
    setCbteDesde(CbteDesde: any): void;
    setCbteHasta(CbteHasta: any): void;
    setCbteFch(CbteFch: any): void;
    setImpTotal(ImpTotal: any): void;
    setImpTotConc(ImpTotConc: any): void;
    setImpNeto(ImpNeto: any): void;
    setImpOpEx(ImpOpEx: any): void;
    setImpTrib(ImpTrib: any): void;
    setImpIVA(ImpIVA: any): void;
    setIvaAarray(ivas: Ivas[]): void;
    setFchServDesde(FchServDesde: any): void;
    setFchServHasta(FchServHasta: any): void;
    setFchVtoPago(CbteFch: any, days: number): void;
    setMonId(MonId: any): void;
    setMonCotiz(MonCotiz: any): void;
    build(): any;
}
