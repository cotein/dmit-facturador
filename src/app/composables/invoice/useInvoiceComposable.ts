import type { CustomerInvoice, CustomerOnSaleInvoice } from '@/app/types/Customer';
import type { FECAEDetRequest, FeCabReq, Ivas } from '@/app/types/Afip';
import type { ProductForNotaCredito, ProductOnInvoiceTable } from '@/app/types/Product';
import type { InvoiceList } from '@/app/types/Invoice';
import { computed, isProxy } from 'vue';
import { FECAESolicitar } from '@/api/afip/afip-factura-electronica';
import { storeToRefs } from 'pinia';
import { useMutation } from '@tanstack/vue-query';
import { AFIP_IVAS, INVOICE_TYPE } from '@/app/types/Constantes';
import { useInvoiceStore } from '@/app/store/invoice/useInvoiceStore';
import { useInvoiceListComposable } from './useInvoiceListComposable';
import { useQueryClient } from '@tanstack/vue-query';
import { useCompanyComposable } from '../company/useCompanyComposable';
import { useArbaComposable } from '../arba/useArbaComposable';

const {
    invoice,
    InvoiceGetter,
    details,
    openSearchProduct,
    invoiceTableData,
    productOnInvoiceTable,
    isSale,
    invoiceConfigIsValidated,
    openModalMiPyme,
    FECAESolicitarObject,
    alicuotaIVATresPorciento,
    alicuotaIVAUnoComaCinco,
} = storeToRefs(useInvoiceStore());

const { invoiceInitialStatus } = useInvoiceStore();

const invoiceStore = useInvoiceStore();

const Subtotal = computed(() => {
    const subtotal = invoiceTableData.value.reduce((total: number, item: ProductOnInvoiceTable) => {
        return total + item.subtotal;
    }, 0);

    return parseFloat(subtotal.toFixed(2));
});

const Discount = computed(() => {
    const discount = invoiceTableData.value.reduce((total: number, item: ProductOnInvoiceTable) => {
        return total + item.discount;
    }, 0);

    return parseFloat(discount.toFixed(2));
});

const IVA = computed(() => {
    const iva = invoiceTableData.value.reduce((total: number, item: ProductOnInvoiceTable) => {
        return total + item.iva_import;
    }, 0);

    return parseFloat(iva.toFixed(2));
});

const TotalComprobante = computed(() => {
    const totalComprobante = invoiceTableData.value.reduce((total: number, item: ProductOnInvoiceTable) => {
        return total + item.total + item.percep_iva_import! + item.percep_iibb_import!;
    }, 0);

    return parseFloat(totalComprobante.toFixed(2));
});

const PercepIVATresPorciento = computed(() => {
    const percepIVA = invoiceTableData.value.reduce((total: number, item: ProductOnInvoiceTable) => {
        if (item.percep_iva_import && item.percep_iva_alicuota === alicuotaIVATresPorciento.value) {
            return total + item.percep_iva_import;
        }
        return total;
    }, 0);

    return parseFloat(percepIVA.toFixed(2));
});

const PercepIVAUnoComaCinco = computed(() => {
    const percepIVA = invoiceTableData.value.reduce((total: number, item: ProductOnInvoiceTable) => {
        if (item.percep_iva_import && item.percep_iva_alicuota === alicuotaIVAUnoComaCinco.value) {
            return total + item.percep_iva_import;
        }
        return total;
    }, 0);

    return parseFloat(percepIVA.toFixed(2));
});

const PercepIIBB = computed(() => {
    const iibb = invoiceTableData.value.reduce((total: number, item: ProductOnInvoiceTable) => {
        if (item.percep_iibb_import) {
            return total + item.percep_iibb_import;
        }
        return total;
    }, 0);

    return iibb;
});

const IVAS = computed(() => {
    const ivas: Ivas[] = [];

    if (invoiceTableData && invoiceTableData.value.length) {
        invoiceTableData.value.reduce((total: number, item: ProductOnInvoiceTable) => {
            const index = ivas.findIndex((el) => el.name === item.iva.name);

            if (index < 0) {
                ivas.push({
                    id: item.iva.id,
                    name: item.iva.name,
                    import: item.iva_import,
                    subtotal: item.subtotal,
                });
            } else {
                ivas[index].import += item.iva_import;
                ivas[index].subtotal += item.subtotal;
            }
            return total + item.iva_import;
        }, 0);

        return ivas;
    }
    return 0;
});

export const useInvoiceComposable = () => {
    const { CompanyGetter } = useCompanyComposable();

    const { alicuotaPercepcion } = useArbaComposable();

    invoiceStore.$subscribe(() => {
        invoiceTableData.value.forEach((item: ProductOnInvoiceTable) => {
            const unit = parseFloat(item.unit.toFixed(2));

            //const subtotal = (unit * item.quantity - item.discount).toFixed(2);
            const subtotal = (unit * item.quantity).toFixed(2);

            item.subtotal = parseFloat(subtotal);

            const iva_import = (((item.subtotal - item.discount) * item.iva.percentage) / 100).toFixed(2);

            item.iva_import = parseFloat(iva_import);

            if (CompanyGetter.value?.perception_iva) {
                if (item.iva.afip_code === AFIP_IVAS.AFIP_CODE_VEINTI_UNO) {
                    const percep_iva_import = (
                        ((item.subtotal - item.discount) * alicuotaIVATresPorciento.value) /
                        100
                    ).toFixed(2);
                    item.percep_iva_import = parseFloat(percep_iva_import);
                    item.percep_iva_alicuota = alicuotaIVATresPorciento.value;
                }

                if (item.iva.afip_code === AFIP_IVAS.AFIP_CODE_DIEZ_COMA_CINCO) {
                    const percep_iva_import = (
                        ((item.subtotal - item.discount) * alicuotaIVAUnoComaCinco.value) /
                        100
                    ).toFixed(2);
                    item.percep_iva_import = parseFloat(percep_iva_import);
                    item.percep_iva_alicuota = alicuotaIVAUnoComaCinco.value;
                }
            }

            if (CompanyGetter.value?.perception_iibb) {
                item.percep_iibb_alicuota = alicuotaPercepcion.value;
                const percep_iibb_import = (((item.subtotal - item.discount) * alicuotaPercepcion.value) / 100).toFixed(
                    2,
                );
                item.percep_iibb_import = parseFloat(percep_iibb_import);
            }

            item.total = item.subtotal + item.iva_import - item.discount;
        });

        if (
            invoice.value.voucher !== null &&
            [
                INVOICE_TYPE.NOTA_CREDITO_A,
                INVOICE_TYPE.NOTA_CREDITO_B,
                INVOICE_TYPE.NOTA_CREDITO_C,
                INVOICE_TYPE.NOTA_DEBITO_A,
                INVOICE_TYPE.NOTA_DEBITO_B,
                INVOICE_TYPE.NOTA_DEBITO_C,
            ].includes(invoice.value.voucher)
        ) {
            isSale.value = false;
        } else {
            isSale.value = true;
        }
    });

    const queryClient = useQueryClient();
    const { invoiceList } = useInvoiceListComposable();
    const createInvoiceMutation = useMutation(
        async (params: {
            FeCabReq: FeCabReq;
            FECAEDetRequest: FECAEDetRequest;
            environment: string;
            company_cuit: string;
            company_id: string;
            user_id: string;
            products: ProductOnInvoiceTable[] | ProductForNotaCredito[];
            saleCondition: number;
            customer: CustomerInvoice | CustomerOnSaleInvoice;
            comments: string;
            paymentType: number;
            parent?: number;
            isMiPyme?: boolean;
        }) => {
            const response = await FECAESolicitar(
                params.FeCabReq,
                params.FECAEDetRequest,
                params.environment,
                params.company_cuit,
                params.company_id,
                params.user_id,
                params.products,
                params.saleCondition,
                params.customer,
                params.comments,
                params.paymentType,
                params.parent,
                params.isMiPyme,
            );

            return response;
        },
        {
            onSuccess: (data) => {
                if (data && data.data) {
                    console.log('🚀 ~ useInvoiceComposable ~ wwww:', data?.data);
                    if (Array.isArray(data.data.invoice) && data.data.invoice.length > 0) {
                        const newInvoice = data.data.invoice[0];
                        if (isProxy(invoiceList.value)) {
                            const list = JSON.parse(JSON.stringify(invoiceList.value));
                            list.unshift(newInvoice);
                            invoiceList.value = list;
                        } else {
                            invoiceList.value.unshift(newInvoice);
                        }
                    }
                }
            },
        },
    );

    const insertProductOnInvoiceTable = (productOnInvoiceTable: ProductOnInvoiceTable) => {
        const index = invoiceTableData.value.findIndex(
            (item) => item.product.id === productOnInvoiceTable.product.id && item.unit === productOnInvoiceTable.unit,
        );

        if (index !== -1) {
            invoiceTableData.value[index].quantity += productOnInvoiceTable.quantity;
        } else {
            invoiceTableData.value.push(productOnInvoiceTable);
        }
    };

    const addInvoiceToCache = (invoice: InvoiceList) => {
        let paramsCache = null;

        const cacheName: string = 'invoice-list';

        const queryCache = queryClient.getQueryCache();

        queryCache.getAll().map((query) => {
            query.queryKey.forEach((key) => {
                if (key === cacheName) {
                    paramsCache = query.queryKey;
                    queryClient.setQueryData(paramsCache, (old: any) => {
                        if (!old) return invoice;

                        return [...old.data.data, invoice];
                    });
                }
            });
        });
    };

    return {
        addInvoiceToCache,
        createInvoiceMutation,
        details,
        Discount,
        insertProductOnInvoiceTable,
        invoice,
        invoiceConfigIsValidated,
        InvoiceGetter,
        invoiceInitialStatus,
        invoiceTableData,
        isSale,
        IVA,
        IVAS,
        openModalMiPyme,
        openSearchProduct,
        productOnInvoiceTable,
        Subtotal,
        TotalComprobante,
        FECAESolicitar,
        FECAESolicitarObject,
        PercepIVATresPorciento,
        PercepIVAUnoComaCinco,
        PercepIIBB,
    };
};
