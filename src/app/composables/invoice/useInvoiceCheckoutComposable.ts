import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import { SELECT_INVOICE_TYPE } from '@/app/types/Constantes';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useInvoiceBuilderComposable } from '@/app/composables/invoice/useInvoiceBuilderComposable';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { usePrinterPdfComposable } from '@/app/composables/printerPdf/usePrinterPdfComposable';
import { showNotification } from '@/app/helpers/notifications';
import { useInvoiceStore } from '@/app/store/invoice/useInvoiceStore';
import type { InvoiceList } from '@/app/types/Invoice';

/**
 * Emisión del comprobante contra la API.
 *
 * Estaba embebida en `ProductTable.vue`, que es el detalle del modo normal. El
 * modo mostrador tiene su propia disposición y necesita el mismo camino de
 * emisión (mismo armado del request, misma validación previa, misma respuesta),
 * así que vive acá y los dos layouts la consumen.
 */

/**
 * Estado de la emisión. Vive a nivel de módulo porque el panel de venta y la barra
 * de mobile del mostrador son dos botones para la misma operación: los dos tienen
 * que mostrar el mismo "generando…" y ninguno puede habilitarse mientras el otro corre.
 */
const checkoutError = ref('');
const loading = ref<boolean>(false);

/** Resumen del último comprobante emitido en esta sesión. */
export type IssuedInvoiceSummary = {
    comprobante: string;
    cae: string;
    caeFchVto: string;
    isMipyme: boolean;
};

/**
 * Último comprobante emitido, con su CAE.
 *
 * Lo lee el mostrador para poder anunciar el resultado sin que nadie tenga que
 * mirar la notificación, y el modo normal para decir junto a las acciones —
 * imprimir, mandar por email— sobre qué comprobante van a operar.
 */
export const lastIssuedInvoice = ref<IssuedInvoiceSummary | null>(null);

/**
 * El comprobante que devolvió ARCA, tal como lo necesitan el PDF y el email.
 *
 * `lastIssuedInvoice` es sólo el resumen para anunciar; imprimir o convertir a PDF
 * necesita la factura completa (`voucher.voucher_type`, `items`, `company`). Se
 * guarda acá —y no en la pantalla— porque el momento en que existe es el de la
 * emisión.
 */
export const lastIssuedInvoicePayload = ref<InvoiceList | null>(null);

/** Texto para anunciar el resultado de la emisión. Función pura: no toca el estado. */
export const describeCheckoutOutcome = (issued: boolean): string => {
    if (!issued) {
        return checkoutError.value === '' ? 'No se facturó.' : `No se pudo facturar. ${checkoutError.value}`;
    }

    const summary = lastIssuedInvoice.value;

    if (!summary) {
        return 'Comprobante emitido.';
    }

    if (summary.isMipyme) {
        return 'Comprobante enviado a MiPyME. Falta la confirmación para tener el CAE.';
    }

    if (summary.cae === '') {
        return `Comprobante emitido: ${summary.comprobante}. ARCA todavía no devolvió el CAE.`;
    }

    const vencimiento = summary.caeFchVto === '' ? '' : `, vence ${summary.caeFchVto}`;

    return `Comprobante emitido: ${summary.comprobante}. CAE ${summary.cae}${vencimiento}.`;
};

export const useInvoiceCheckoutComposable = () => {
    const { invoiceTableData, createInvoiceMutation, InvoiceGetter, openModalMiPyme, FECAESolicitarObject } =
        useInvoiceComposable();
    const { createConcreteInvoiceBuilder, createInvoiceBuilder, invoiceType } = useInvoiceBuilderComposable();
    const { CompanyGetter } = useCompanyComposable();
    const { printPdf } = usePrinterPdfComposable();
    const { invoice } = storeToRefs(useInvoiceStore());

    const clearCheckoutError = () => {
        checkoutError.value = '';
    };

    const fail = (mensaje: string): false => {
        checkoutError.value = mensaje;
        message.error({ content: mensaje });

        return false;
    };

    /**
     * @returns `true` cuando el comprobante se emitió (o quedó abierto el modal MiPyME).
     */
    const generateInvoice = async (): Promise<boolean> => {
        checkoutError.value = '';
        lastIssuedInvoice.value = null;
        lastIssuedInvoicePayload.value = null;
        loading.value = true;

        try {
            const company = CompanyGetter.value;

            if (!company) {
                return fail('Falta cargar los datos de la empresa para poder facturar.');
            }

            invoice.value.PtoVta = parseInt(String(company.pto_vta_fe));
            invoice.value.CbteTipo = invoice.value.voucher;

            const customer: any = invoice.value.customer;

            // La condición frente al IVA del receptor es obligatoria (RG 5616). Si el
            // cliente no la trae cargada se usa la del cliente por defecto en vez de
            // romper leyendo `afip_inscription` de un objeto nulo.
            const customerInscription = Number(
                customer?.afip_inscription?.id ?? customer?.afipInscription_id ?? 5 /* Consumidor Final */,
            );

            const builder = createConcreteInvoiceBuilder(
                (SELECT_INVOICE_TYPE as Record<number, number>)[Number(invoiceType.value)],
                Number(company.inscription_id),
                customerInscription,
            );

            if (!builder) {
                return fail(
                    'El tipo de comprobante elegido no se puede emitir con la inscripción de la empresa. Elegí otro comprobante.',
                );
            }

            const request = createInvoiceBuilder(builder, invoice.value, invoiceTableData.value);

            FECAESolicitarObject.value = request;

            if (request.FECAEDetRequest.Concepto === 2 || request.FECAEDetRequest.Concepto === 3) {
                if (
                    request.FECAEDetRequest.FchServDesde === '' ||
                    request.FECAEDetRequest.FchServDesde === null ||
                    request.FECAEDetRequest.FchServHasta === '' ||
                    request.FECAEDetRequest.FchServHasta === null
                ) {
                    return fail('Si facturás servicios tenés que ingresar las fechas en que se desarrollaron.');
                }
            }

            if (request.FECAEDetRequest.ImpTotal === 0) {
                return fail('No se permite emitir un comprobante en cero pesos.');
            }

            const params: any = {
                FeCabReq: request.FeCabReq,
                FECAEDetRequest: request.FECAEDetRequest,
                environment: company.afip_environment,
                company_cuit: company.cuit,
                company_id: company.id,
                user_id: company.user_id,
                products: invoiceTableData.value,
                saleCondition: InvoiceGetter.value.SaleCondition,
                customer: InvoiceGetter.value?.customer,
                comments: InvoiceGetter.value?.comments,
                paymentType: InvoiceGetter.value?.paymentType,
                isMiPyme: InvoiceGetter.value?.isMiPyme,
            };

            const result: any = await createInvoiceMutation.mutateAsync(params).catch((err) => {
                console.log('🚀 ~ useInvoiceCheckoutComposable ~ generateInvoice:', err);

                return null;
            });

            if (!result) {
                return fail('No pudimos emitir el comprobante. Revisá la conexión con ARCA e intentá de nuevo.');
            }

            /**
             * El cuerpo de la respuesta puede venir con un nivel de envoltorio de más
             * (`{ data: { invoice, arca } }`) según el entorno. Leer una sola forma hacía
             * que, cuando venía envuelto, `result.data.invoice[0]` explotara sin mensaje.
             */
            const payload: any = result?.data?.data ?? result?.data;

            if (!payload) {
                return fail('ARCA no devolvió una respuesta válida para el comprobante.');
            }

            if (payload.isMipyme) {
                openModalMiPyme.value = true;
                invoice.value.isMiPyme = true;
                request.FeCabReq.CbteTipo = payload.CbteTipo;
                request.FECAEDetRequest.CbteDesde = payload.CbteDesde;
                request.FECAEDetRequest.CbteHasta = payload.CbteHasta;

                lastIssuedInvoice.value = {
                    comprobante: `Comprobante N° ${payload.CbteDesde ?? '-'}`,
                    cae: '',
                    caeFchVto: '',
                    isMipyme: true,
                };

                return true;
            }

            const issuedInvoice: any = payload.invoice?.[0] ?? {};
            const voucher: any = issuedInvoice.voucher ?? {};

            // El CAE es la respuesta de ARCA: se muestra siempre junto al comprobante.
            const arca = payload.arca;
            const cae = arca?.cae ?? issuedInvoice.cae ?? voucher.cae;
            const caeVto = arca?.cae_fch_vto ?? issuedInvoice.cae_fch_vto ?? voucher.cae_fch_vto;
            const ptoVta = voucher.pto_vta ?? issuedInvoice.pto_vta;
            const cbteDesde = voucher.cbte_desde ?? issuedInvoice.cbte_desde;
            const comprobante = `Comprobante N° ${ptoVta !== undefined ? `${ptoVta}-` : ''}${cbteDesde ?? '-'}`;
            const caeTexto = cae ? ` — CAE ${cae} (vto ${caeVto ?? '-'})` : '';

            lastIssuedInvoice.value = {
                comprobante,
                cae: cae ? String(cae) : '',
                caeFchVto: caeVto ? String(caeVto) : '',
                isMipyme: false,
            };

            lastIssuedInvoicePayload.value = payload.invoice?.[0] ?? null;

            showNotification('success', 'Factura generada correctamente', comprobante + caeTexto, 5, 'topLeft');

            invoiceTableData.value = []; // limpia los productos de la tabla
            invoice.value.comments = ''; // limpia los comentarios

            // La impresión no puede tumbar una venta ya autorizada.
            try {
                if (payload.invoice?.[0]?.voucher) {
                    printPdf(payload.invoice[0] as never);
                }
            } catch (e) {
                console.log('🚀 ~ useInvoiceCheckoutComposable ~ printPdf:', e);
            }

            return true;
        } finally {
            loading.value = false;
        }
    };

    return {
        clearCheckoutError,
        checkoutError,
        generateInvoice,
        lastIssuedInvoice,
        lastIssuedInvoicePayload,
        loading,
    };
};
