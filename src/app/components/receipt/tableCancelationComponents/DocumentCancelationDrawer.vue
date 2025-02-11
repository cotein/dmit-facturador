<template>
    <a-row :gutter="[15, 15]">
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <a-button type="primary" @click="showDrawer" :disabled="!enableButtonOpenDocumentCancelationDrawer"
                >Ingresar documento de cancelación</a-button
            >
        </a-col>
    </a-row>
    <a-drawer
        title="Documento de Cancelación"
        :visible="drawerVisible"
        @close="closeDrawer"
        :width="drawerWidth()"
        @afterVisibleChange="sendDataToFormByEdit"
    >
        <a-row>
            <a-form :model="form" :rules="rules" ref="formRef" layout="vertical" style="width: 100%; padding-right: 5%">
                <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <a-form-item label="Tipo de Pago" name="payment_type_id" :rules="rules.payment_type_id">
                        <PaymentType v-model="form.payment_type_id" @update:modelValue="handlePaymentTypeChange" />
                    </a-form-item>
                </a-col>

                <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <a-form-item label="Número de transferencia / comprobante" name="number">
                        <a-input v-model:value="form.number" />
                    </a-form-item>
                </a-col>

                <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <a-form-item label="Importe" name="import" :rules="rules.import">
                        <a-input-number v-model:value="form.import" style="width: 100%" inputmode="numeric" />
                    </a-form-item>
                </a-col>

                <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <a-form-item label="Ingresa a Cta. Cte." name="ctacte" :rules="rules.cbu_id">
                        <a-select
                            v-model="form.cbu_id"
                            placeholder="Cuenta corriente"
                            style="width: 100%"
                            :default-active-first-option="false"
                            :field-names="{ label: 'ctaCte', value: 'id' }"
                            :options="CompanyGetter!.cbus"
                            :size="'default'"
                            @select="handlerCbuChange"
                        ></a-select>
                    </a-form-item>
                </a-col>

                <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24"
                    ><!--
                <a-form-item label="Ingresa a Cta. Cte." name="ctacte">
                    <a-input v-model:value="form.ctacte" />
                </a-form-item> -->
                </a-col>

                <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <a-form-item label="Fecha Imputación" name="imputation_date">
                        <DatePickerBase
                            v-model="form.imputation_date"
                            @update:modelValue="handleImputationDateChange"
                        />
                    </a-form-item>
                </a-col>

                <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <a-form-item label="Banco emisor" name="bank">
                        <!-- <a-input v-model:value="form.bank" /> -->
                        <SelectBank v-model="form.bank" @update:modelValue="handleBankChange" />
                    </a-form-item>
                </a-col>

                <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <a-form-item label="Propietario Cheque" name="chequeOwner">
                        <a-input v-model:value="form.chequeOwner" />
                    </a-form-item>
                </a-col>

                <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <a-form-item label="Fecha Emisión del cheque" name="chequeDate">
                        <DatePickerBase v-model="form.chequeDate" @update:modelValue="handleChequeDateChange" />
                    </a-form-item>
                </a-col>

                <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <a-form-item label="Fecha Vencimiento del cheque" name="chequeExpirate">
                        <DatePickerBase v-model="form.chequeExpirate" @update:modelValue="handleChequeExpirateChange" />
                    </a-form-item>
                </a-col>

                <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <a-form-item label="Comentarios" name="chequeExpirate">
                        <a-textarea v-model:value="form.comments" show-count :maxlength="200" />
                    </a-form-item>
                </a-col>

                <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <a-form-item v-if="!isEditingDocumentCancelation">
                        <a-button type="primary" @click="handleSubmit">Ingresar</a-button>
                    </a-form-item>
                    <a-form-item v-else>
                        <a-button type="primary" @click="handleEdit">Editar</a-button>
                    </a-form-item>
                </a-col>
            </a-form>
        </a-row>
    </a-drawer>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import dayjs from 'dayjs';
import PaymentType from '@/app/components/receipt/tableCancelationComponents/PaymentType.vue';
import { message } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import { useReceiptComposable } from '@/app/composables/receipt/useReceiptComposable';
import type { DocumentCancelation } from '@/app/types/Receipt';
import SelectBank from './SelectBank.vue';
import DatePickerBase from '@/app/componentsBase/DatePickerBase.vue';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Dayjs from 'dayjs';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { Rule } from 'ant-design-vue/lib/form';
import { useMediaQueryComposable } from '@/app/composables/mediaQuery.ts/useMediaQueryComposable';

Dayjs.extend(customParseFormat);

const { drawerWidth } = useMediaQueryComposable();

const handlerCbuChange = (value: any) => {
    form.value.cbu_id = value;
};

const { CompanyGetter } = useCompanyComposable();

const {
    documentsCancelation,
    drawerVisible,
    isEditingDocumentCancelation,
    dataDocumentCancelation,
    enableButtonOpenDocumentCancelationDrawer,
} = useReceiptComposable();

const form = ref<DocumentCancelation>({
    payment_type_id: null,
    number: '',
    import: null,
    cbu_id: null,
    imputation_date: '',
    bank: null,
    chequeOwner: '',
    chequeDate: null,
    chequeExpirate: null,
    comments: '',
});

const cbuValidator = (rule: Rule, value: any) => {
    console.log('🚀 ~ cbuValidator ~ value:', value);
    console.log('🚀 ~ cbuValidator ~ rule:', rule);
    console.log('🚀 ~ cbuValidator ~ form:', form.value);
    return new Promise((resolve, reject) => {
        if (value === null) {
            reject('Debe seleccionar un comprobante a emitir');
        } else {
            resolve(true);
        }
    });
};

const rules = {
    payment_type_id: [
        {
            message: 'Por favor ingrese el método de pago',
            validator: (_: any, value: any) => {
                if (value === '' || value === null || value === undefined) {
                    return Promise.reject();
                }
                return Promise.resolve();
            },
        },
    ],

    cbu_id: [
        {
            message: 'La cuenta corriente es requerida',
            validator: cbuValidator,
        },
    ],
    //number: [{ required: true, message: 'Por favor ingrese el número', trigger: 'blur' }],
    import: [{ required: true, message: 'Por favor ingrese el importe', trigger: 'blur' }],
    /* ctacte: [
        {
            required: true,
            message: 'Por favor ingrese la cuenta corriente',
            trigger: 'blur',
        },
    ], */
    /* imputation_date: [
        {
            required: true,
            message: 'Por favor ingrese la fecha de imputación',
            trigger: 'blur',
        },
    ], */
    //bank: [{ required: true, message: 'Por favor ingrese el banco', trigger: 'blur' }],
    /* chequeOwner: [
        {
            required: true,
            message: 'Por favor ingrese el propietario del cheque',
            trigger: 'blur',
        },
    ],
    chequeDate: [
        {
            required: true,
            message: 'Por favor ingrese la fecha del cheque',
            trigger: 'blur',
        },
    ],
    chequeExpirate: [
        {
            required: true,
            message: 'Por favor ingrese la fecha de vencimiento del cheque',
            trigger: 'blur',
        },
    ], */
};

const formRef = ref<FormInstance | null>(null);

const documentCancelation = ref<DocumentCancelation>({
    payment_type_id: 1,
    number: '',
    import: null,
    cbu_id: null,
    imputation_date: '',
    bank: null,
    chequeOwner: null,
    chequeDate: '',
    chequeExpirate: '',
    comments: null,
});

const showDrawer = () => {
    drawerVisible.value = true;
};

const closeDrawer = () => {
    drawerVisible.value = false;
};

const sendDataToFormByEdit = (visible: boolean) => {
    if (visible && isEditingDocumentCancelation.value && dataDocumentCancelation.value!.data) {
        form.value = {
            payment_type_id: dataDocumentCancelation.value?.data.payment_type_id ?? null,
            number: dataDocumentCancelation.value?.data.number ?? '',
            import: dataDocumentCancelation.value?.data.import ?? null,
            cbu_id: dataDocumentCancelation.value?.data.cbu_id ?? null,
            imputation_date: dataDocumentCancelation.value?.data.imputation_date ?? '',
            bank: dataDocumentCancelation.value?.data.bank ?? null,
            chequeOwner: dataDocumentCancelation.value?.data.chequeOwner ?? '',
            chequeDate: dataDocumentCancelation.value?.data.chequeDate ?? null,
            chequeExpirate: dataDocumentCancelation.value?.data.chequeExpirate ?? null,
            comments: dataDocumentCancelation.value?.data.comments ?? '',
        };
    }
};
const handleSubmit = () => {
    if (formRef.value) {
        formRef.value
            .validate()
            .then(() => {
                documentsCancelation.value.push(form.value);
                message.success('Documento de cancelación ingresado correctamente');
                closeDrawer();
                form.value = { ...documentCancelation.value };
            })
            .catch((error) => {
                console.log('La validación falló:', error);
            });
    }
};

const handleEdit = () => {
    if (formRef.value) {
        formRef.value
            .validate()
            .then(() => {
                documentsCancelation.value[dataDocumentCancelation.value?.index ?? 0] = form.value;
                message.success('Documento de cancelación editado correctamente');
                closeDrawer();
                dataDocumentCancelation.value = { data: null, index: null };
                isEditingDocumentCancelation.value = false;
                form.value = { ...documentCancelation.value };
            })
            .catch((error) => {
                console.log('La validación falló:', error);
            });
    }
};
onBeforeMount(() => {
    const today = dayjs();

    form.value.imputation_date = today.format('DD-MM-YYYY');
});

const handlePaymentTypeChange = (value: number) => {
    form.value.payment_type_id = value;
};

const handleBankChange = (value: number) => {
    form.value.bank = value;
};

const handleImputationDateChange = (value: number) => {
    form.value.imputation_date = value;
};

const handleChequeDateChange = (value: number) => {
    form.value.chequeDate = value;
};

const handleChequeExpirateChange = (value: number) => {
    form.value.chequeExpirate = value;
};
</script>

<style scoped>
@media (max-width: 768px) {
    .ant-drawer-content {
        padding: 0 16px;
    }
    .ant-form-item {
        margin-bottom: 16px;
    }
    .ant-input,
    .ant-input-number,
    .ant-select-selector,
    .ant-picker {
        width: 100% !important;
    }
}
</style>
