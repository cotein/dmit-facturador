<template>
    <div>
        <a-modal
            v-model:visible="openModalMiPyme"
            :width="drawerWidth"
            title="Factura MiPyme"
            :destroyOnClose="true"
            :closable="true"
            :maskClosable="false"
            :disabled="
                loading || !CompanyGetter?.cbus || (CompanyGetter?.cbus.length && CompanyGetter.cbus[0].cbu == '')
            "
            @ok="handleOk"
            :confirmLoading="loading"
            :bodyStyle="{
                height: 'auto',
            }"
            :cancelButtonProps="{
                disabled: true,
            }"
        >
            <a-row
                :gutter="[15, 31]"
                v-if="CompanyGetter?.cbus && CompanyGetter?.cbus.length && CompanyGetter.cbus[0].cbu != ''"
            >
                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <a-radio-group v-model:value="transferType" @change="setOptional">
                        <a-radio :value="'SCA'">TRANSFERENCIA AL SISTEMA DE CIRCULACION ABIERTA</a-radio>
                        <a-radio :value="'ADC'">AGENTE DE DEPOSITO COLECTIVO</a-radio>
                    </a-radio-group>
                </a-col>

                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <a-date-picker
                        v-model:value="invoice.dateVtoPago"
                        style="width: 100%"
                        showToday
                        :format="dateFormat"
                        placeholder="Vencimiento de pago"
                        @change="servicesDateFchVtoPago"
                    />
                </a-col>
                <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <div v-if="CompanyGetter.cbus.length > 1" class="select-container">
                        <label for="cbu-select">Seleccione un CBU:</label>
                        <select id="cbu-select" v-model="selectedCbu" class="custom-select">
                            <option v-for="(cbu, index) in CompanyGetter.cbus" :key="index" :value="cbu.cbu">
                                {{ cbu.name }} - {{ cbu.cbu }}
                            </option>
                        </select>
                    </div>
                    <div v-else>
                        <label for="" class="label-cbu">CBU informado: </label>
                        <p>
                            {{ CompanyGetter.cbus[0].name }} -
                            {{ CompanyGetter.cbus[0].cbu }}
                        </p>
                    </div>
                </a-col>
            </a-row>
            <a-row :gutter="[15, 15]" v-else>
                <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <p>No se encuentra configurado el CBU de la empresa</p>
                    <p>Debe editar la compañía para agregar una cuenta registrada en ARCA</p>
                </a-col>
            </a-row>
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { showMessage } from '@/app/helpers/mesaages';
import { usePrinterPdfComposable } from '@/app/composables/printerPdf/usePrinterPdfComposable';
import { useMediaQueryComposable } from '@/app/composables/mediaQuery.ts/useMediaQueryComposable';
import type { Opcional } from '@/app/types/Afip';

const { openModalMiPyme, FECAESolicitarObject, invoiceTableData, InvoiceGetter, createInvoiceMutation, invoice } =
    useInvoiceComposable();

const { drawerWidth } = useMediaQueryComposable();

const { CompanyGetter } = useCompanyComposable();

const { printPdf } = usePrinterPdfComposable();

const loading = ref(false);

const selectedCbu = ref();

const dateFormat = 'DD-MM-YYYY';

const transferType = ref();

const optional = ref<[Opcional]>([
    {
        Id: '27',
        Valor: 0,
    },
]);

const optional1 = ref<[Opcional]>([
    {
        Id: '2101',
        Valor: 0,
    },
]);

const setOptional = (e: Event) => {
    const target = e.target as HTMLInputElement;

    optional.value[0].Valor = target.value;
};

watch(selectedCbu, (newVal, oldVal) => {
    optional1.value[0].Valor = selectedCbu.value;
});

const handleOk = () => {
    if (CompanyGetter) {
        if (CompanyGetter && CompanyGetter.value && CompanyGetter.value.cbus.length === 0) {
            closeModal();
            invoice.value.isMiPyme = false;
        } else {
            generateMiPymeInvoice();
        }
    }
};

const closeModal = () => {
    openModalMiPyme.value = false;
};

const servicesDateFchVtoPago = (date: any) => {
    let day = null;

    if (date.$D < 10) {
        day = '0' + date.$D;
    } else {
        day = date.$D;
    }

    if (date.$M + 1 < 10) {
        FECAESolicitarObject.value!.FECAEDetRequest.FchVtoPago = `${date.$y}0${date.$M + 1}${day}`;
    } else {
        FECAESolicitarObject.value!.FECAEDetRequest.FchVtoPago = `${date.$y}${date.$M + 1}${day}`;
    }
};

const generateMiPymeInvoice = async () => {
    loading.value = true;

    FECAESolicitarObject.value!.FECAEDetRequest.Opcionales = [...optional.value, ...optional1.value];

    const params = {
        FeCabReq: FECAESolicitarObject.value!.FeCabReq,
        FECAEDetRequest: FECAESolicitarObject.value!.FECAEDetRequest,
        environment: CompanyGetter.value?.afip_environment,
        company_cuit: CompanyGetter.value?.cuit,
        company_id: CompanyGetter.value?.id,
        user_id: CompanyGetter.value?.user_id,
        products: invoiceTableData.value,
        saleCondition: InvoiceGetter.value.SaleCondition,
        customer: InvoiceGetter.value?.customer,
        comments: InvoiceGetter.value?.comments,
        paymentType: InvoiceGetter.value?.paymentType,
        isMiPyme: InvoiceGetter.value?.isMiPyme,
    };

    const result = await createInvoiceMutation
        .mutateAsync(params)
        .catch((err) => {
            showMessage('error', err.response.data.message, 6);
        })
        .finally(() => (loading.value = false));

    if (result) {
        openModalMiPyme.value = false;

        invoice.value.isMiPyme = false;

        showMessage('success', 'Factura generada correctamente', 3);

        invoiceTableData.value = []; //limpia los productos de la tabla

        invoice.value.comments = ''; //limpia comentarios

        if (result.data.invoice[0]) {
            printPdf(result.data.invoice[0]);
        }
    }
};

onMounted(() => {
    selectedCbu.value = CompanyGetter.value.cbus[0].cbu;
    console.log('🚀 ~ onMounted ~ selectedCbu.value :', selectedCbu.value);
});
</script>
<style scoped>
.custom-select {
    display: block;
    width: auto;
    padding: 0.375rem 1.75rem 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.custom-select:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.select-container {
    display: flex;
    align-items: center;
}

.select-container label {
    margin-right: 10px;
}
.label-cbu {
    font-weight: inherit;
    color: darkmagenta;
}
</style>
