import { z } from 'zod';

const invoiceConfigSchema = z.object({
    Concepto: z.string().refine((value) => ['1', '2', '3'].includes(value), {
        message: 'Concepto debe ser uno de los valores: 1, 2, 3',
        path: ['Concepto'],
    }),
    customer: z.nullable(z.unknown()),
    date: z.nullable(z.unknown()),
    DocTipo: z.nullable(z.unknown()),
    FchServDesde: z
        .string()
        .refine(
            (value) => {
                const pp = invoiceConfigSchema.extract({ Concepto: invoiceConfigSchema.shape.Concepto });
                const { Concepto } = pp.parse(invoice);

                console.log('Valor de Concepto:', Concepto);
                if (value === '' && invoiceConfigSchema.pick({ Concepto: true }).Concepto === '1') {
                    return true;
                } else if (value != '' && ['2', '3'].includes(invoiceConfigSchema.pick({ Concepto: true }).Concepto)) {
                    return true;
                } else {
                    return false;
                }
            },
            {
                message: 'FchServDesde no cumple con las condiciones de validación',
                path: ['FchServDesde'],
            },
        )
        .optional(),
    FchServHasta: z.string().refine(
        (value, context) => {
            const concepto = value.Concepto;
            return concepto === '2' || concepto === '3';
        },
        {
            message: 'FchServHasta es requerido cuando Concepto es igual a 2 o 3',
            path: ['FchServHasta'],
        },
    ),
    FchVtoPago: z.string().refine(
        (value, context) => {
            const concepto = value.Concepto;
            return concepto === '2' || concepto === '3';
        },
        {
            message: 'FchVtoPago es requerido cuando Concepto es igual a 2 o 3',
            path: ['FchVtoPago'],
        },
    ),
    paymentType: z.object({
        id: z.number(),
        company_id: z.number(),
        name: z.string(),
        percentage: z.number(),
    }),
    SaleCondition: z.object({
        id: z.number(),
        name: z.string(),
        days: z.number(),
    }),
    voucher: z.object({
        afip_code: z.nullable(z.unknown()),
        id: z.nullable(z.unknown()),
        name: z.nullable(z.unknown()),
    }),
});

export const validateInvoiceConfig = (invoice) => {
    console.log('🚀 ~ validateInvoiceConfig ~ invoice:', invoice);
    return invoiceConfigSchema.parse(invoice);
};
