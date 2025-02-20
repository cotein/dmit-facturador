import type { AfipInvoice, FeCabReq } from '@/app/types/Afip';
import type { FECAESolicitarRequest, InvoiceList } from '@/app/types/Invoice';
import type { ProductOnInvoiceTable } from '@/app/types/Product';
import { defineStore } from 'pinia';
import { computed, ref, reactive, type UnwrapRef } from 'vue';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

export const useInvoiceStore = defineStore('invoice', () => {
    const date = dayjs(new Date());

    const invoiceType = ref<number>(1);

    const isSale = ref<boolean>(true);

    const invoiceConfigIsValidated = ref<boolean>(false);

    const invoiceList = ref<InvoiceList[]>([]);

    const FECAESolicitarObject = ref<FECAESolicitarRequest>();

    const alicuotaIIBB = ref<number>(0);

    const alicuotaIVATresPorciento = ref<number>(3);

    const alicuotaIVAUnoComaCinco = ref<number>(1.5);

    const invoice: UnwrapRef<AfipInvoice> = reactive({
        CantReg: 1,
        CbteDesde: 0,
        CbteFch: '',
        CbteHasta: 0,
        CbteNro: 0,
        CbtesAsoc: undefined,
        CbteTipo: null,
        company_id: undefined,
        Concepto: '1',
        CondicionIVAReceptorId: 1,
        customer: null,
        date: date,
        dateVtoPago: undefined,
        DocTipo: null,
        FchServDesde: '',
        FchServHasta: '',
        FchVtoPago: '',
        ImpIVA: 0,
        ImpNeto: 0,
        ImpOpEx: 0,
        ImpTotal: 0,
        ImpTotConc: 0,
        ImpTrib: 0,
        Iva: null,
        MonCotiz: 1,
        MonId: 'pesos',
        paymentType: null,
        percepIIBB: 0,
        percepIva: 0,
        products: [],
        PtoVta: null,
        PeriodoAsoc: [],
        SaleCondition: 1,
        Tributos: null,
        type_details: '1',
        voucher: null,
        comments: null,
        aditional_percentage: 0,
        isMiPyme: false,
    });

    const invoiceInitialStatus = (): void => {
        invoice.CantReg = 1;
        invoice.CbteFch = '';
        invoice.CbtesAsoc = undefined;
        invoice.date = date;
        invoice.dateVtoPago = undefined;
        invoice.DocTipo = null;
        invoice.FchServDesde = '';
        invoice.FchServHasta = '';
        invoice.FchVtoPago = '';
        invoice.ImpIVA = 0;
        invoice.ImpNeto = 0;
        invoice.ImpOpEx = 0;
        invoice.ImpTotal = 0;
        invoice.ImpTotConc = 0;
        invoice.ImpTrib = 0;
        invoice.Iva = null;
        invoice.MonCotiz = 1;
        invoice.MonId = 'pesos';
        invoice.percepIIBB = 0;
        invoice.percepIva = 0;
        invoice.products = [];
        invoice.PtoVta = null;
        invoice.SaleCondition = 1;
        invoice.Tributos = null;
        invoice.periodoAsoc = undefined;
        invoice.type_details = '1';
        invoice.voucher = null;
        invoice.comments = null;
        invoice.aditional_percentage = 0;
        invoice.paymentType = null;
    };

    const details = ref<[]>([]);

    const openSearchProduct = ref<boolean>(false);

    const openModalMiPyme = ref<boolean>(false);

    const invoiceTableData = ref<ProductOnInvoiceTable[]>([]);

    const productOnInvoiceTable = ref<ProductOnInvoiceTable>({
        key: '',
        row: '',
        product: {
            id: 1,
            name: '',
        },
        price_base: 0,
        unit: 0,
        quantity: 1,
        iva: {
            id: 1,
            name: '',
            percentage: 1,
            afip_code: 1,
        },
        iva_import: 0,
        discount: 0,
        subtotal: 0,
        total: 0,
        actions: {},
        priceList: undefined,
        aditional: {
            percentage: 0,
            value: 0,
        },
        percep_iibb_alicuota: 0,
        percep_iibb_import: 0,
        percep_iva_alicuota: 0,
        percep_iva_import: 0,
    });

    const setInitialData = () => {
        invoiceInitialStatus();
        invoiceTableData.value = [];
    };

    return {
        details,
        invoice,
        InvoiceGetter: computed(() => invoice),
        invoiceInitialStatus,
        invoiceList,
        invoiceTableData,
        invoiceType,
        isSale,
        openSearchProduct,
        productOnInvoiceTable,
        setInitialData,
        invoiceConfigIsValidated,
        openModalMiPyme,
        FECAESolicitarObject,
        alicuotaIIBB,
        alicuotaIVATresPorciento,
        alicuotaIVAUnoComaCinco,
    };
});
