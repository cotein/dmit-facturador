import { AfipNotaCreditoCBuiler } from './AfipNotaCreditoCBuiler';
import { AFIP_INSCRIPTION, INVOICE_TYPE } from '@/app/types/Constantes';
import { AfipInvoiceABuilder } from './AfipInvoiceABuilder';
import { AfipInvoiceBBuilder } from './AfipInvoiceBBuilder';
import { AfipNotaDebitoABuiler } from './AfipNotaDebitoABuiler';
import { AfipNotaDebitoBBuiler } from './AfipNotaDebitoBBuiler';
import { AfipNotaCreditoABuiler } from './AfipNotaCreditoABuiler';
import { AfipNotaCreditoBBuiler } from './AfipNotaCreditoBBuiler';
import { AfipInvoiceCBuilder } from './AfipInvoiceCBuilder';
import { AfipNotaDebitoCBuiler } from './AfipNotaDebitoCBuiler';
import type { AfipInvoiceBaseBuilder } from './AfipInvoiceBaseBuilder';

export class FactoryInvoiceBuilder {
    private static INVOICE_BUILDER: {
        invoiceType: number;
        inscriptionCompany: number;
        inscriptionCustomer: number;
        class: any;
    }[] = [
            {
                invoiceType: INVOICE_TYPE.FACTURA,
                inscriptionCompany: AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO,
                inscriptionCustomer: AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO,
                class: AfipInvoiceABuilder,
            },
            {
                invoiceType: INVOICE_TYPE.FACTURA,
                inscriptionCompany: AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO,
                inscriptionCustomer: AFIP_INSCRIPTION.CONSUMIDOR_FINAL,
                class: AfipInvoiceBBuilder,
            },
            {
                invoiceType: INVOICE_TYPE.FACTURA,
                inscriptionCompany: AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO,
                inscriptionCustomer: AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO,
                class: AfipInvoiceABuilder,
            },
            {
                invoiceType: INVOICE_TYPE.FACTURA,
                inscriptionCompany: AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO,
                inscriptionCustomer: AFIP_INSCRIPTION.IVA_SUJETO_EXENTO,
                class: AfipInvoiceBBuilder,
            },
            {
                invoiceType: INVOICE_TYPE.NOTA_DE_DEBITO,
                inscriptionCompany: AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO,
                inscriptionCustomer: AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO,
                class: AfipNotaDebitoABuiler,
            },
            {
                invoiceType: INVOICE_TYPE.NOTA_DE_DEBITO,
                inscriptionCompany: AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO,
                inscriptionCustomer: AFIP_INSCRIPTION.CONSUMIDOR_FINAL,
                class: AfipNotaDebitoBBuiler,
            },
            {
                invoiceType: INVOICE_TYPE.NOTA_DE_DEBITO,
                inscriptionCompany: AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO,
                inscriptionCustomer: AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO,
                class: AfipNotaDebitoBBuiler,
            },
            {
                invoiceType: INVOICE_TYPE.NOTA_DE_DEBITO,
                inscriptionCompany: AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO,
                inscriptionCustomer: AFIP_INSCRIPTION.IVA_SUJETO_EXENTO,
                class: AfipNotaDebitoBBuiler,
            },

            {
                invoiceType: INVOICE_TYPE.NOTA_DE_CREDITO,
                inscriptionCompany: AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO,
                inscriptionCustomer: AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO,
                class: AfipNotaCreditoABuiler,
            },
            {
                invoiceType: INVOICE_TYPE.NOTA_DE_CREDITO,
                inscriptionCompany: AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO,
                inscriptionCustomer: AFIP_INSCRIPTION.CONSUMIDOR_FINAL,
                class: AfipNotaCreditoBBuiler,
            },
            {
                invoiceType: INVOICE_TYPE.NOTA_DE_CREDITO,
                inscriptionCompany: AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO,
                inscriptionCustomer: AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO,
                class: AfipNotaCreditoBBuiler,
            },
            {
                invoiceType: INVOICE_TYPE.NOTA_DE_CREDITO,
                inscriptionCompany: AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO,
                inscriptionCustomer: AFIP_INSCRIPTION.IVA_SUJETO_EXENTO,
                class: AfipNotaCreditoBBuiler,
            },

            /** COMPANY MONOTRIBUTO */
            {
                invoiceType: INVOICE_TYPE.FACTURA,
                inscriptionCompany: AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO,
                inscriptionCustomer: AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO,
                class: AfipInvoiceCBuilder,
            },
            {
                invoiceType: INVOICE_TYPE.FACTURA,
                inscriptionCompany: AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO,
                inscriptionCustomer: AFIP_INSCRIPTION.CONSUMIDOR_FINAL,
                class: AfipInvoiceCBuilder,
            },
            {
                invoiceType: INVOICE_TYPE.FACTURA,
                inscriptionCompany: AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO,
                inscriptionCustomer: AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO,
                class: AfipInvoiceCBuilder,
            },
            {
                invoiceType: INVOICE_TYPE.FACTURA,
                inscriptionCompany: AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO,
                inscriptionCustomer: AFIP_INSCRIPTION.IVA_SUJETO_EXENTO,
                class: AfipInvoiceCBuilder,
            },
            {
                invoiceType: INVOICE_TYPE.NOTA_DE_DEBITO,
                inscriptionCompany: AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO,
                inscriptionCustomer: AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO,
                class: AfipNotaDebitoCBuiler,
            },
            {
                invoiceType: INVOICE_TYPE.NOTA_DE_DEBITO,
                inscriptionCompany: AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO,
                inscriptionCustomer: AFIP_INSCRIPTION.CONSUMIDOR_FINAL,
                class: AfipNotaDebitoCBuiler,
            },
            {
                invoiceType: INVOICE_TYPE.NOTA_DE_DEBITO,
                inscriptionCompany: AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO,
                inscriptionCustomer: AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO,
                class: AfipNotaDebitoCBuiler,
            },
            {
                invoiceType: INVOICE_TYPE.NOTA_DE_DEBITO,
                inscriptionCompany: AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO,
                inscriptionCustomer: AFIP_INSCRIPTION.IVA_SUJETO_EXENTO,
                class: AfipNotaDebitoCBuiler,
            },
            {
                invoiceType: INVOICE_TYPE.NOTA_DE_CREDITO,
                inscriptionCompany: AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO,
                inscriptionCustomer: AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO,
                class: AfipNotaCreditoCBuiler,
            },
            {
                invoiceType: INVOICE_TYPE.NOTA_DE_CREDITO,
                inscriptionCompany: AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO,
                inscriptionCustomer: AFIP_INSCRIPTION.CONSUMIDOR_FINAL,
                class: AfipNotaCreditoCBuiler,
            },
            {
                invoiceType: INVOICE_TYPE.NOTA_DE_CREDITO,
                inscriptionCompany: AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO,
                inscriptionCustomer: AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO,
                class: AfipNotaCreditoCBuiler,
            },
            {
                invoiceType: INVOICE_TYPE.NOTA_DE_CREDITO,
                inscriptionCompany: AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO,
                inscriptionCustomer: AFIP_INSCRIPTION.IVA_SUJETO_EXENTO,
                class: AfipNotaCreditoCBuiler,
            },
    ];

    /**
     * Gets invoice builder
     * @param invoiceType
     * @param inscriptionCompany
     * @param inscriptionCustomer
     * @returns AfipInvoiceBaseBuilder
     */
    public static getInvoiceBuilder(
        invoiceType: number,
        inscriptionCompany: number,
        inscriptionCustomer: number,
    ): AfipInvoiceBaseBuilder {
        const builder = FactoryInvoiceBuilder.INVOICE_BUILDER.find(
            (element: { invoiceType: number; inscriptionCompany: number; inscriptionCustomer?: number; class: any }) =>
                element.invoiceType === invoiceType &&
                element.inscriptionCompany === inscriptionCompany &&
                element.inscriptionCustomer === inscriptionCustomer,
        );

        return builder?.class;
    }
}
