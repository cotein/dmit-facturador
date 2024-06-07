import { FactoryInvoiceBuilder } from './Clases/FactoryInvoiceBuilder';
import { storeToRefs } from 'pinia';
import { useInvoiceStore } from '@/app/store/invoice/useInvoiceStore';
import type { AfipInvoiceBaseBuilder } from './Clases/AfipInvoiceBaseBuilder';
import type { AfipInvoice } from '@/app/types/Afip';
import type { ProductOnInvoiceTable, ProductForNotaCredito } from '@/app/types/Product';

const { invoiceType } = storeToRefs(useInvoiceStore());

export const useInvoiceBuilderComposable = () => {
    const createConcreteInvoiceBuilder = (
        invoiceType: number,
        inscriptionCompany: number,
        inscriptionCustomer: number,
    ): AfipInvoiceBaseBuilder => {
        const invoiceBuilder = FactoryInvoiceBuilder.getInvoiceBuilder(
            invoiceType,
            inscriptionCompany,
            inscriptionCustomer,
        );

        return invoiceBuilder;
    };

    const createInvoiceBuilder = (
        builder: AfipInvoiceBaseBuilder,
        invoice: AfipInvoice,
        invoiceTableData: ProductOnInvoiceTable[] | ProductForNotaCredito[],
    ) => {
        const concreteInvoiceBuilder = new builder() as AfipInvoiceBaseBuilder;
        concreteInvoiceBuilder.setCantReg(invoice.CantReg);
        concreteInvoiceBuilder.setPtoVta(invoice.PtoVta);
        concreteInvoiceBuilder.setCbteTipo(invoice.CbteTipo);
        concreteInvoiceBuilder.setConcepto(invoice.Concepto);
        concreteInvoiceBuilder.setDocTipo(invoice.customer);
        concreteInvoiceBuilder.setDocNro(invoice.customer);
        concreteInvoiceBuilder.setCbteDesde(invoice.CbteNro);
        concreteInvoiceBuilder.setCbteHasta(invoice.CbteNro);
        concreteInvoiceBuilder.setCbteFch(invoice.CbteFch);
        concreteInvoiceBuilder.setImpTotal(invoiceTableData);
        concreteInvoiceBuilder.setImpTotConc(invoiceTableData);
        concreteInvoiceBuilder.setImpNeto(invoiceTableData);
        concreteInvoiceBuilder.setImpOpEx(invoiceTableData);
        concreteInvoiceBuilder.setImpIVA(invoiceTableData);
        concreteInvoiceBuilder.setImpTrib(invoiceTableData);
        concreteInvoiceBuilder.setFchServDesde(invoice.FchServDesde);
        concreteInvoiceBuilder.setFchServHasta(invoice.FchServHasta);
        concreteInvoiceBuilder.setFchVtoPago(invoice.FchVtoPago!);
        concreteInvoiceBuilder.setMonId('PES');
        concreteInvoiceBuilder.setMonCotiz(1);
        concreteInvoiceBuilder.setIvaAarray(invoiceTableData);
        concreteInvoiceBuilder.setCbtesAsoc(invoice.CbtesAsoc);
        concreteInvoiceBuilder.setTributos();
        concreteInvoiceBuilder.setOpcionales();
        concreteInvoiceBuilder.setCompradores();
        concreteInvoiceBuilder.setPeriodoAsoc();
        concreteInvoiceBuilder.setActividades();

        const result = concreteInvoiceBuilder.build();

        return result;
    };

    return { createConcreteInvoiceBuilder, createInvoiceBuilder, invoiceType };
};
