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
        @dropdownVisibleChange="cleanVouchers"
        :mode="props.multiple ? 'multiple' : ''"
        v-model:value="defaultCustomer"
        autofocus
    >
        <template v-if="fetching" #notFoundContent>
            <a-spin size="small" />
        </template>
    </a-select>
</template>
<script setup lang="ts">
import { getCustomers } from '@/api/customer/customer-api';
import { ref, computed, watch } from 'vue';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { useFilterSearchByCustomerStore } from '@/app/store/filter-search/useFilterSearchByCustomerStore';
import type { CustomerSelectComponent } from '@/app/types/Customer';
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
};

const props = withDefaults(defineProps<Props>(), {
    multiple: false,
    context: '',
});

const defaultCustomer = computed({
    get() {
        return invoice.value.customer;
    },
    set(val) {
        invoice.value.customer = val;
    },
});

const handleSearch = async (name: string) => {
    if (name != '') {
        fetching.value = true;

        if (CompanyGetter.value !== undefined && CompanyGetter.value?.id !== undefined) {
            const resp = await getCustomers(CompanyGetter.value.id, name);
            const { data } = resp;
            options.value = data.map((customer: any) => {
                return {
                    value: customer.id,
                    label: `${customer.name} ${customer.last_name}`,
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
    customer.value = option;

    if (props.context === 'invoice') {
        if (CompanyGetter.value?.inscription_id !== undefined) {
            const vouchers = await getVouchers(CompanyGetter.value.inscription_id, customer.value.afip_inscription.id);

            setVouchers(vouchers);

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
    customer.value = {
        value: null, // O un valor nulo o predeterminado adecuado
        label: '', // Cadena vacía o valor predeterminado
        cuit: null,
    };
    customerName.value = '';
    alicuotaPercepcionInitilize();
};
const change = (e: any, option: CustomerSelectComponent): void => {
    if (option === undefined || option === null) {
        invoice.value.customer = null;
        customer.value = {
            value: null, // O un valor nulo o predeterminado adecuado
            label: '', // Cadena vacía o valor predeterminado
            cuit: null,
        };
        customerName.value = '';
    }
};

const cleanVouchers = (w: any) => {
    setVouchers([]);
    invoice.value.voucher = null;
    //customerName.value = '';
};
</script>
