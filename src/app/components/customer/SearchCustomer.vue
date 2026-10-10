<template>
    <a-select
        show-search
        placeholder="Búsqueda de clientes"
        style="width: 100%"
        :default-active-first-option="false"
        label-in-value
        :show-arrow="false"
        :allowClear="true"
        :filter-option="false"
        :not-found-content="fetching ? undefined : null"
        :options="options"
        @search="handleSearch"
        @select="select"
        @change="change"
        @deselect="deselect"
        :mode="props.multiple ? 'multiple' : ''"
        v-model:value="defaultCustomer"
        data-testid="customer-search"
        autofocus
    >
        <template v-if="fetching" #notFoundContent>
            <a-spin size="small" />
        </template>
    </a-select>
</template>
<script setup lang="ts">
import { getCustomers } from '@/api/customer/customer-api';
import { ref, computed } from 'vue';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { useFilterSearchByCustomerStore } from '@/app/store/filter-search/useFilterSearchByCustomerStore';
import type { Customer } from '@/app/types/Invoice';
import type { CustomerInvoice, CustomerSelectComponent } from '@/app/types/Customer';
import { storeToRefs } from 'pinia';
import { getVouchers } from '@/api/voucher/voucher-api';
import { useVoucherStore } from '@/app/store/voucher/useVoucherStore';
import { useCustomerListComposable } from '@/app/composables/customer/useCustomerListComposable';
import { useArbaComposable } from '@/app/composables/arba/useArbaComposable';

const { customerName } = useCustomerListComposable();
const { customer } = storeToRefs(useFilterSearchByCustomerStore());
const { CompanyGetter } = useCompanyComposable();
const { invoice } = useInvoiceComposable();
const { setVouchers } = useVoucherStore();
const { alicuotaPorSujeto, simpleXMLElementArba, alicuotaPercepcion, alicuotaPercepcionInitilize } =
    useArbaComposable();

const fetching = ref(false);
const options = ref<{ value: any; label: string }[]>([]);

type Props = {
    multiple: boolean;
    context: string;
    /**
     * `true` para que el campo abra vacío aunque la venta ya tenga un cliente.
     *
     * Lo usa el drawer "Datos del Cliente": la venta arranca con Consumidor Final y verlo
     * dentro del buscador daba a entender que se estaba editando ese cliente. Con
     * `startEmpty` el campo no refleja el cliente de la venta hasta que elegís uno. El
     * cliente de la venta no cambia: sigue siendo el de `invoice.customer`.
     */
    startEmpty?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    multiple: false,
    context: '',
    startEmpty: false,
});

/**
 * Lo elegido en el campo cuando `startEmpty` está activo. Es sólo lo que se muestra en
 * el control; el cliente de la venta se sigue guardando en `invoice.customer`.
 */
const pickedCustomer = ref<CustomerInvoice | CustomerSelectComponent | Customer | null>(null);

const defaultCustomer = computed({
    get() {
        return props.startEmpty ? pickedCustomer.value : invoice.value.customer;
    },
    set(val) {
        if (props.startEmpty) {
            pickedCustomer.value = val;

            return;
        }

        invoice.value.customer = val as Customer | null;
    },
});

/**
 * Deja el campo vacío y descarta los resultados de la búsqueda anterior: el drawer lo
 * llama cada vez que se abre, para que siempre arranque listo para buscar.
 */
const reset = () => {
    pickedCustomer.value = null;
    options.value = [];
};

defineExpose({ reset });

const handleSearch = async (name: string) => {
    if (name != '') {
        fetching.value = true;

        if (CompanyGetter.value !== undefined && CompanyGetter.value?.id !== undefined) {
            const resp = await getCustomers(CompanyGetter.value.id, name);
            const { data } = resp;
            options.value = data.map((customer: any) => {
                /**
                 * El nombre que se muestra en el desplegable.
                 *
                 * La API manda el `label` ya armado ("María Gómez"); antes se rearmaba con
                 * `name` + `last_name` y ese campo no existe en la respuesta (viene
                 * `lastName`), así que el resultado mostraba sólo el nombre. Se prefiere el
                 * `label` de la API y, si no viniera, se rearma contemplando las dos formas.
                 */
                const label =
                    customer.label ??
                    (customer.last_name || customer.lastName
                        ? `${customer.name} ${customer.last_name ?? customer.lastName}`
                        : customer.name);

                return {
                    value: customer.id,
                    label: label,
                    cuit: parseInt(customer.afip_number),
                    afip_inscription: customer.afip_inscription,
                    afip_document: customer.afip_document,
                };
            });

            fetching.value = false;
        }
    }
};

const select = async (e: any, option: CustomerSelectComponent): Promise<void> => {
    invoice.value.customer = option;

    if (props.startEmpty) {
        pickedCustomer.value = option;
    }

    customer.value = option;

    if (props.context === 'invoice') {
        if (CompanyGetter.value?.inscription_id !== undefined) {
            const vouchers = await getVouchers(CompanyGetter.value.inscription_id, customer.value.afip_inscription.id);

            setVouchers(vouchers);

            // El comprobante elegido sólo se limpia si dejó de ser válido para el cliente
            // nuevo (por ejemplo, Factura A con un Consumidor Final). Antes se borraba en
            // cada apertura del desplegable y se perdía una elección explícita del usuario.
            if (
                invoice.value.voucher &&
                !vouchers.some((voucher: { id: number }) => voucher.id === invoice.value.voucher)
            ) {
                invoice.value.voucher = null;
            }

            if (CompanyGetter.value.perception_iibb) {
                if (customer.value.cuit !== null) {
                    const alicuota = await alicuotaPorSujeto(customer.value.cuit);

                    simpleXMLElementArba.value = alicuota;

                    const percentage: string = alicuota.contribuyentes.contribuyente.alicuotaPercepcion;

                    const convertedValue: number = parseFloat(percentage.replace(',', '.'));

                    alicuotaPercepcion.value = convertedValue;
                }
            }
        }
    }

    if (props.context === 'customer') {
        customerName.value = option.label;
    }

    if (props.context === 'receipt') {
        console.log("🚀 ~ select ~ props.context === 'receipt':", props.context === 'receipt');
        if (CompanyGetter.value?.inscription_id !== undefined) {
            const vouchers = await getVouchers(
                CompanyGetter.value.inscription_id,
                customer.value.afip_inscription.id,
                props.context,
            );

            setVouchers(vouchers);
        }
    }

    if (props.context === 'receipt-list') {
        console.log('🚀 ~ select ~ options:', options);
    }
};

const deselect = (e: any, option: CustomerSelectComponent): void => {
    invoice.value.customer = null;
    pickedCustomer.value = null;
    customer.value = {
        value: null, // O un valor nulo o predeterminado adecuado
        label: '', // Cadena vacía o valor predeterminado
        cuit: null,
    };
    customerName.value = '';
    alicuotaPercepcionInitilize();

    // Sin cliente no hay comprobantes aplicables: acá sí corresponde limpiar la lista
    // y la selección, para no seguir ofreciendo los del cliente anterior.
    if (props.context === 'invoice') {
        setVouchers([]);
        invoice.value.voucher = null;
    }
};

const change = (e: any, option: CustomerSelectComponent): void => {
    // Sólo limpia el cliente cuando el selector queda realmente vacío (clear).
    // El reseteo de comprobantes vive en `select` y en `deselect`, no acá: antes se
    // limpiaban al abrir el desplegable y eso borraba una elección explícita.
    if (option === undefined || option === null) {
        invoice.value.customer = null;
        pickedCustomer.value = null;
        customer.value = {
            value: null, // O un valor nulo o predeterminado adecuado
            label: '', // Cadena vacía o valor predeterminado
            cuit: null,
        };
        customerName.value = '';
    }
};
</script>
