import type { CustomerInvoice, CustomerOnSaleInvoice } from '@/app/types/Customer';
import type { FECAEDetRequest, FeCabReq, Ivas } from '@/app/types/Afip';
import type { ProductForNotaCredito, ProductOnInvoiceTable } from '@/app/types/Product';
import type { InvoiceList } from '@/app/types/Invoice';
import { computed, isProxy } from 'vue';
import { FECAESolicitar } from '@/api/afip/afip-factura-electronica';
import { storeToRefs } from 'pinia';
import { useMutation } from '@tanstack/vue-query';
import { INVOICE_TYPE } from '@/app/types/Constantes';
import { useInvoiceStore } from '@/app/store/invoice/useInvoiceStore';
import { useInvoiceListComposable } from './useInvoiceListComposable';
import { useQueryClient } from '@tanstack/vue-query';

const {
    invoice,
    InvoiceGetter,
    details,
    openSearchProduct,
    invoiceTableData,
    productOnInvoiceTable,
    isSale,
    invoiceConfigIsValidated,
} = storeToRefs(useInvoiceStore());

const { invoiceInitialStatus } = useInvoiceStore();

const invoiceStore = useInvoiceStore();

invoiceStore.$subscribe(() => {
    invoiceTableData.value.forEach((item: ProductOnInvoiceTable) => {
        const unit = parseFloat(item.unit.toFixed(2));

        const subtotal = (unit * item.quantity - item.discount).toFixed(2);

        item.subtotal = parseFloat(subtotal);

        const iva_import = ((item.subtotal * item.iva.percentage) / 100).toFixed(2);

        item.iva_import = parseFloat(iva_import);

        item.total = item.subtotal + item.iva_import;
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
        return total + item.total;
    }, 0);

    return parseFloat(totalComprobante.toFixed(2));
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
            );

            return response;
        },
        {
            onSuccess: (data, vars, context) => {
                if (isProxy(invoiceList.value)) {
                    const list = JSON.parse(JSON.stringify(invoiceList.value));

                    list.unshift(data!.data.invoice[0]);

                    invoiceList.value = list;
                } else {
                    invoiceList.value.unshift(data.data.invoice[0]);
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
        createInvoiceMutation,
        details,
        Discount,
        insertProductOnInvoiceTable,
        invoice,
        InvoiceGetter,
        invoiceInitialStatus,
        invoiceTableData,
        isSale,
        IVA,
        IVAS,
        openSearchProduct,
        productOnInvoiceTable,
        Subtotal,
        TotalComprobante,
        addInvoiceToCache,
        invoiceConfigIsValidated,
    };
};
