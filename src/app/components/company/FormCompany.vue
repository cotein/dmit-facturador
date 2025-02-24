<script setup lang="ts">
import { FormValidationWrap, VerticalFormStyleWrap } from "@/views/forms/overview/Style";
import { Main, DatePickerWrapper } from "@/views/styled";
import { ref, watch, defineEmits, onMounted } from "vue";
import locale from "ant-design-vue/es/date-picker/locale/es_ES";
import AddressForm from "../address/AddressForm.vue";
import { TypeCompany } from "@/app/types/Constantes";
import "ant-design-vue/lib/message/style/index.css";
import "ant-design-vue/lib/notification/style/index.css";
import GetInfoByCuit from "../afip/GetInfoByCuit.vue";
import { usePadronAfipStore } from "@/app/store/afip/usePadronAfipStore";
import { useUserComposable } from "@/app/composables/user/useUserComposable";
import { useAddressComposable } from "@/app/composables/address/useAddressComposable";
import { useInscriptionsComposable } from "@/app/composables/afip/useInscriptionsComposable";
import { useCompanyComposable } from "@/app/composables/company/useCompanyComposable";
import type { PersonaReturn } from "@/app/types/Afip";
import { AFIP_INSCRIPTION } from "@/app/types/Constantes";
import { useAddressStore } from "@/app/store/address/address-store";
import { storeToRefs } from "pinia";
import { showMessage } from "@/app/helpers/mesaages";
import ASelectedBank from "@/app/components/banks/ASelectedBank.vue";
import { onlyNumeric } from "@/app/helpers/onlyNumbers";
import { FormInstance } from "ant-design-vue/lib/form";
import { z } from "zod";
import type { CBU } from "@/app/types/Company";

const { sujeto } = storeToRefs(usePadronAfipStore());
const { lastNameIsRequired, rules, companyForm, CompanyGetter } = useCompanyComposable();
const { UserGetter } = useUserComposable();
const { isLoading: inscriptionLoading, store } = useInscriptionsComposable();
const { isValid } = useAddressComposable();
const { addressInStore } = storeToRefs(useAddressStore());

interface Props {
    loadingButton: boolean;
    isSaveButton: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    loadingButton: false,
    isSaveButton: true,
});

const cbuErrors = ref<string[][]>([[], [], []]);

const formIsValid = ref<boolean>(true);

const companyFormRef = ref<FormInstance>();

const emit = defineEmits(["submitCompanyForm"]);

const loading = ref(false);
/**METHODS */
const onSubmit = async () => {
    formIsValid.value = true; // Reset form validity

    const uniqueCbu = hasDuplicateCBU(companyForm.value.cbus);

    if (uniqueCbu) {
        formIsValid.value = false;
        showMessage("error", "Los CBU deben ser únicos", 3);
        return;
    }

    cbuErrors.value = companyForm.value.cbus.map(() => []); // Reset errors

    companyForm.value.cbus.forEach((cbuItem: CBU, index: number) => {
        const result = cbuSchema.safeParse(cbuItem);

        if (!result.success) {
            formIsValid.value = false;

            result.error.errors.forEach((err) => {
                console.log("🚀 ~ result.error.errors.forEach ~ err:", err);
                if (err.path[0] == "ctaCte") {
                    cbuErrors.value[index][4] = err.message;
                }
                if (err.path[0] == "bank_id") {
                    cbuErrors.value[index][2] = err.message;
                }
                if (err.path[0] == "cbu") {
                    cbuErrors.value[index][0] = err.message;
                }
            });
        }
    });

    if (!formIsValid.value) {
        console.log("🚀 ~ onSubmit ~ formIsValid.value:", formIsValid.value);
        showMessage("error", "Error al validar el formulario", 3);
        return;
    }

    loading.value = true;

    try {
        if (!lastNameIsRequired.value) {
            delete rules.lastName;
        }
        const validate = await companyFormRef.value!.validate().catch((error: any) => {
            showMessage("error", "Error al validar el formulario", 3);
        });

        if (validate) {
            companyForm.value.cuit = sujeto.value.cuit;

            companyForm.value.address = addressInStore.value;

            let inscription: any = companyForm.value.inscription;

            if (!Number.isInteger(inscription)) {
                inscription = CompanyGetter.value?.inscription_id;
            }

            if (CompanyGetter.value != undefined) {
                const data = Object.assign(companyForm.value, {
                    id: CompanyGetter.value?.id,
                    inscription: inscription,
                    cuit: CompanyGetter.value?.cuit,
                });
                emit("submitCompanyForm", data);
            } else {
                emit("submitCompanyForm", companyForm.value);
            }
        }
    } finally {
        loading.value = false;
    }
};

const resetForm = () => {
    companyFormRef.value!.resetFields();
};

const getTipoPersona = (personaReturn: PersonaReturn): string => {
    return personaReturn.datosGenerales.tipoPersona;
};

watch(
    () => sujeto.value, //cuanod cambia el valor de sujeto (cuit)
    (newValue) => {
        const afipData = newValue.afip_data as PersonaReturn;
        const CONSUMIDOR_FINAL = 5;
        companyForm.value.name = newValue.name;
        if (newValue.cuit_id !== undefined) {
            companyForm.value.cuit_id = newValue.cuit_id;
        }
        companyForm.value.lastName = newValue.lastName;
        //companyForm.value.inscription = newValue.inscription;
        companyForm.value.afip_data = afipData;
        companyForm.value.type_customer = newValue.type_company;

        if (newValue.type_company === 1) {
            lastNameIsRequired.value = false;
        }

        if (newValue.type_company === 2) {
            lastNameIsRequired.value = true;
        }

        if (
            afipData &&
            afipData.datosGenerales &&
            getTipoPersona(afipData) === "FISICA"
        ) {
            companyForm.value.type_company = TypeCompany.FISICA;
        } else {
            companyForm.value.type_company = TypeCompany.JURIDICA;
        }

        if (afipData && afipData.datosMonotributo) {
            companyForm.value.inscription = AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO;
        }
        if (afipData && afipData.datosRegimenGeneral) {
            afipData.datosRegimenGeneral.impuesto.forEach((imp) => {
                if (imp.descripcionImpuesto === "IVA") {
                    companyForm.value.inscription =
                        AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO;
                    return;
                }
                if (imp.descripcionImpuesto === "IVA EXENTO") {
                    companyForm.value.inscription = AFIP_INSCRIPTION.IVA_SUJETO_EXENTO;
                    return;
                }
            });
        }
        if (newValue.inscription === CONSUMIDOR_FINAL) {
            resetForm();
            showMessage(
                "warning",
                "La CUIT que ingresaste se encuentra inactiva, ingresá tu CUIT activa",
                5
            );
        }
    },
    { deep: true }
);
const isMobile = ref<boolean>(false);

const sizeButton = isMobile.value === true ? "small" : "default";

onMounted(async () => {
    if (window.innerWidth <= 768) {
        isMobile.value = true;
    }
});
const removeCBU = (index: number) => {
    if (companyForm.value.cbus.length > 1) {
        companyForm.value.cbus.splice(index, 1);
        cbuErrors.value.splice(index, 1);
    }
};

const addAccount = () => {
    if (companyForm.value.cbus.length < 3) {
        companyForm.value.cbus.push({
            alias: "",
            bank_id: undefined,
            bank: "",
            cbu: "",
            ctaCte: "",
        });
    }
};

const cbuSchema = z.object({
    alias: z.string().optional(),
    bank_id: z
        .number()
        .optional()
        .refine(
            (val) => {
                //console.log(val); // Imprime el valor de val
                return val !== undefined;
            },
            {
                message: "El Banco es requerido",
            }
        ),
    // bank: z.string().optional(),
    cbu: z
        .string()
        .nonempty("El CBU es requerido")
        .refine((val) => val.length === 22, {
            message: "El CBU debe tener 22 caracteres de longitud",
        }),
    ctaCte: z.string().nonempty("El número de cuenta es requerido"),
});

const hasDuplicateCBU = (arr: Array<CBU>) => {
    const cbuSet = new Set();

    for (const item of arr) {
        if (cbuSet.has(item.cbu)) {
            return true; // Encontrado un valor de CBU repetido
        }
        cbuSet.add(item.cbu);
    }
    return false; // No se encontraron valores de CBU repetidos
};
</script>

<template>
    <Main>
        <AlertList v-if="!UserGetter.value.companies">
            <div class="alert-empty-message" v-if="!isMobile">
                <a-alert
                    closeText="Cerrar"
                    :outlined="false"
                    :closable="true"
                    :showIcon="true"
                    message="Nota importante"
                    description="Se ha detectado que Ud. no tiene una compañía asignada a su perfil, complete los datos del formulario, delegue el servicio de facturación eletrónica a nuestro nombre y comience a emitir comprobantes de ventas electrónicos con los servicios web de AFIP."
                    type="info"
                />
            </div>
        </AlertList>
        <a-row :gutter="25">
            <a-col :xs="24">
                <sdCards title="Datos" caption="Datos de la compañía">
                    <FormValidationWrap>
                        <VerticalFormStyleWrap>
                            <a-form
                                name="ninjadash_validation-form"
                                ref="companyFormRef"
                                :model="companyForm"
                                :rules="rules"
                                layout="vertical"
                            >
                                <a-row :gutter="[15, 15]">
                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <GetInfoByCuit :only-cuit="true" />
                                    </a-col>
                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <a-form-item
                                            ref="name"
                                            :label="
                                                lastNameIsRequired
                                                    ? 'Nombre'
                                                    : 'Razón Social'
                                            "
                                            name="name"
                                        >
                                            <a-input
                                                v-model:value="companyForm.name"
                                                placeholder="Nombre"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col
                                        :xs="24"
                                        :sm="24"
                                        :md="12"
                                        :lg="12"
                                        :xl="12"
                                        v-if="lastNameIsRequired"
                                    >
                                        <a-form-item
                                            ref="lastName"
                                            name="lastName"
                                            label="Apellido"
                                        >
                                            <a-input
                                                v-model:value="companyForm.lastName"
                                                placeholder="Apellido"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <a-form-item
                                            ref="fantasy_name"
                                            name="fantasy_name"
                                            label="Nombre de Fantasía"
                                        >
                                            <a-input
                                                v-model:value="companyForm.fantasy_name"
                                                placeholder="Nombre de Fantasía"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <a-form-item
                                            ref="inscription"
                                            name="inscription"
                                            label="Inscripción en AFIP"
                                        >
                                            <a-select
                                                v-model:value="companyForm.inscription"
                                                size="large"
                                                show-search
                                                placeholder="Inscripción en Afip"
                                                :default-active-first-option="false"
                                                :show-arrow="false"
                                                :filter-option="false"
                                                allowClear
                                                :not-found-content="null"
                                                :options="store.InscriptionsGetter"
                                                :loading="inscriptionLoading"
                                            >
                                                <!-- <a-select-option
												v-for="(item, index) in store.InscriptionsGetter"
												:key="index"
												:value="item.id"
												>{{ item.name }}</a-select-option
											> -->
                                            </a-select>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <a-form-item
                                            ref="activity_init"
                                            label="Inicio de actividades"
                                            name="activity_init"
                                        >
                                            <DatePickerWrapper>
                                                <a-date-picker
                                                    v-model:value="
                                                        companyForm.activity_init
                                                    "
                                                    size="large"
                                                    placeholder="Seleccionar Fecha"
                                                    :format="'DD-MM-YYYY'"
                                                    :locale="locale"
                                                />
                                            </DatePickerWrapper>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <a-form-item
                                            ref="iibb"
                                            name="iibb"
                                            label="N° de Ingresos Brutos"
                                        >
                                            <a-input
                                                v-model:value="companyForm.iibb"
                                                placeholder="IIBB"
                                                inputmode="numeric"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <a-form-item
                                            ref="type_company"
                                            name="type_company"
                                            label="Tipo de Empresa"
                                        >
                                            <a-select
                                                v-model:value="companyForm.type_company"
                                                size="large"
                                                placeholder="Tipo"
                                                :default-active-first-option="false"
                                                :show-arrow="false"
                                                :filter-option="false"
                                                allowClear
                                                :not-found-content="null"
                                            >
                                                <a-select-option
                                                    :value="TypeCompany.JURIDICA"
                                                    >JURÍDICA</a-select-option
                                                >
                                                <a-select-option
                                                    :value="TypeCompany.FISICA"
                                                    >FÍSICA</a-select-option
                                                >
                                            </a-select>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                        <a-form-item
                                            ref="billing_concept"
                                            name="billing_concept"
                                            label="Concepto de facturación"
                                        >
                                            <a-radio-group
                                                v-model:value="
                                                    companyForm.billing_concept
                                                "
                                                class="radio-group"
                                            >
                                                <a-radio-button
                                                    class="mr-1r ta-center"
                                                    value="1"
                                                    >PRODUCTOS</a-radio-button
                                                >
                                                <a-radio-button
                                                    class="mr-1r ta-center"
                                                    value="2"
                                                    >SERVICIOS</a-radio-button
                                                >
                                                <a-radio-button
                                                    class="ta-center"
                                                    value="3"
                                                    >PRODUCTOS Y SERVICIOS</a-radio-button
                                                >
                                            </a-radio-group>
                                        </a-form-item>
                                    </a-col>
                                </a-row>

                                <a-row :gutter="10" :class="{ 'mobile-space': isMobile }">
                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <a-form-item
                                            ref="bank_id"
                                            name="bank"
                                            label="Banco"
                                            :help="cbuErrors[0][2]"
                                            :validateStatus="
                                                cbuErrors[0][2] ? 'error' : 'success'
                                            "
                                        >
                                            <a-selected-bank :index="0" />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <a-form-item
                                            ref="cbu"
                                            name="cbu"
                                            label="CBU - Necesario para Facturas MiPyme"
                                            :help="cbuErrors[0][0]"
                                            :validateStatus="
                                                cbuErrors[0][0] ? 'error' : 'success'
                                            "
                                        >
                                            <a-input
                                                v-model:value="companyForm.cbus[0].cbu"
                                                placeholder="CBU"
                                                inputmode="numeric"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <a-form-item
                                            ref="ctaCte"
                                            name="ctacte"
                                            label="Cuenta corriente"
                                            :help="cbuErrors[0][4]"
                                            :validateStatus="
                                                cbuErrors[0][4] ? 'error' : 'success'
                                            "
                                        >
                                            <a-input
                                                v-model:value="companyForm.cbus[0].ctaCte"
                                                placeholder="Cta. cte"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <a-form-item
                                            ref="alias"
                                            name="alias"
                                            label="Alias"
                                            :help="cbuErrors[0][1]"
                                            :validateStatus="
                                                cbuErrors[0][1] ? 'error' : 'success'
                                            "
                                        >
                                            <a-input
                                                v-model:value="companyForm.cbus[0].alias"
                                                placeholder="Alias"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <a-tooltip title="Eliminar cuenta">
                                            <a-button
                                                type="default"
                                                @click="removeCBU(0)"
                                            >
                                                <template #icon>
                                                    <unicon
                                                        name="trash-alt"
                                                        width="14"
                                                    ></unicon>
                                                </template>
                                            </a-button>
                                        </a-tooltip>
                                    </a-col>
                                </a-row>

                                <a-row
                                    :gutter="10"
                                    :class="{ 'mobile-space': isMobile }"
                                    v-for="(cbu, index) in companyForm.cbus.slice(1)"
                                    :key="index"
                                >
                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <a-form-item
                                            :ref="'bank_id_' + index"
                                            :name="'bank_' + index"
                                            label="Banco"
                                            :help="cbuErrors[index + 1][2]"
                                            :validateStatus="
                                                cbuErrors[index + 1][2]
                                                    ? 'error'
                                                    : 'success'
                                            "
                                        >
                                            <a-selected-bank :index="index + 1" />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <a-form-item
                                            :ref="'cbu_' + index"
                                            :name="'cbu_' + index"
                                            label="CBU - Necesario para Facturas MiPyme"
                                            :help="cbuErrors[index + 1][0]"
                                            :validateStatus="
                                                cbuErrors[index + 1][0]
                                                    ? 'error'
                                                    : 'success'
                                            "
                                        >
                                            <a-input
                                                v-model:value="cbu.cbu"
                                                placeholder="CBU"
                                                inputmode="numeric"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <a-form-item
                                            :ref="'ctaCte_' + index"
                                            :name="'ctaCte_' + index"
                                            label="Cuenta corriente"
                                            :help="cbuErrors[index + 1][4]"
                                            :validateStatus="
                                                cbuErrors[index + 1][4]
                                                    ? 'error'
                                                    : 'success'
                                            "
                                        >
                                            <a-input
                                                v-model:value="cbu.ctaCte"
                                                placeholder="Cta. cte"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <a-form-item
                                            :ref="'alias_' + index"
                                            :name="'alias_' + index"
                                            label="Alias"
                                            :help="cbuErrors[index + 1][1]"
                                            :validateStatus="
                                                cbuErrors[index + 1][1]
                                                    ? 'error'
                                                    : 'success'
                                            "
                                        >
                                            <a-input
                                                v-model:value="cbu.alias"
                                                placeholder="Alias"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <a-tooltip title="Eliminar cuenta"></a-tooltip>
                                        <a-button
                                            type="default"
                                            @click="removeCBU(index + 1)"
                                        >
                                            <template #icon>
                                                <unicon
                                                    name="trash-alt"
                                                    width="14"
                                                ></unicon>
                                            </template>
                                        </a-button>
                                    </a-col>
                                </a-row>
                                <a-row :gutter="10" :class="{ 'mobile-space': isMobile }">
                                    <a-col
                                        :xs="24"
                                        :sm="24"
                                        :md="24"
                                        :lg="24"
                                        :xl="24"
                                        style="
                                            display: flex;
                                            justify-content: center;
                                            align-items: center;
                                        "
                                    >
                                        <a-button
                                            @click="addAccount"
                                            :disabled="companyForm.cbus.length >= 3"
                                            class="mobile-style orange-button"
                                            >Agregar Cuenta Corriente</a-button
                                        >
                                    </a-col>
                                </a-row>
                                <a-row :gutter="25" justify="center">
                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <a-form-item
                                            ref="phone1"
                                            name="phone1"
                                            label="Teléfono 1"
                                            extra="Sólo números"
                                        >
                                            <a-input
                                                v-model:value="companyForm.phone1"
                                                placeholder="Teléfono 1"
                                                @keypress="onlyNumeric"
                                                inputmode="numeric"
                                            />
                                        </a-form-item>
                                    </a-col>

                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <a-form-item
                                            ref="phone2"
                                            name="phone2"
                                            label="Teléfono 2"
                                            extra="Sólo números"
                                        >
                                            <a-input
                                                v-model:value="companyForm.phone2"
                                                placeholder="Teléfono 2"
                                                @keypress="onlyNumeric"
                                                inputmode="numeric"
                                            />
                                        </a-form-item>
                                    </a-col>

                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <a-form-item
                                            ref="email"
                                            name="email"
                                            label="Correo Electrónico"
                                        >
                                            <a-input
                                                v-model:value="companyForm.email"
                                                placeholder="Correo Electrónico"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <a-form-item
                                            ref="webSite"
                                            name="webSite"
                                            label="Sitio Web"
                                        >
                                            <a-input
                                                v-model:value="companyForm.webSite"
                                                placeholder="Sitio Web"
                                            />
                                        </a-form-item>
                                    </a-col>
                                </a-row>

                                <a-row :gutter="[20, 50]" align="middle">
                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <a-typography-title :level="4"
                                            >Entorno de Facturación</a-typography-title
                                        >
                                        <a-radio-group
                                            v-model:value="companyForm.afip_environment"
                                            button-style="solid"
                                        >
                                            <a-radio-button value="production"
                                                >Producción</a-radio-button
                                            >
                                            <a-radio-button
                                                value="testing"
                                                v-if="UserGetter.userLevel === 1000"
                                                >Testing</a-radio-button
                                            >
                                        </a-radio-group>
                                    </a-col>
                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <a-typography-title :level="4"
                                            >Domicilio</a-typography-title
                                        >
                                        <a-form-item
                                            ref="address"
                                            name="address"
                                            label="Domicilio"
                                            :extra="
                                                !isValid
                                                    ? 'Es necesario definir un domicilio'
                                                    : 'Cambiar domicilio'
                                            "
                                        >
                                            <a-badge :dot="!isValid ? true : false">
                                                <AddressForm
                                                    :title="
                                                        isValid
                                                            ? 'Actualizar domicilio'
                                                            : 'Agregar domicilio'
                                                    "
                                                />
                                            </a-badge>
                                        </a-form-item>
                                    </a-col>
                                </a-row>

                                <a-divider class="divider" />
                                <a-typography-title :level="4"
                                    >Percepciones</a-typography-title
                                >

                                <a-row :gutter="25" justify="center">
                                    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                        <span id="iibb" v-if="isMobile"
                                            >Percepción de IIBB</span
                                        >
                                        <span id="iibb" v-else
                                            >Realiza percepción de Ingresos Brutos</span
                                        >
                                        <a-switch
                                            v-model:checked="companyForm.perception_iibb"
                                        />
                                    </a-col>
                                    <a-col
                                        :xs="24"
                                        :sm="24"
                                        :md="12"
                                        :lg="12"
                                        :xl="12"
                                        :class="{ 'mobile-space': isMobile }"
                                    >
                                        <span id="iva" v-if="isMobile"
                                            >Percepción de Iva</span
                                        >
                                        <span id="iva" v-else
                                            >Realiza percepción de Iva</span
                                        >
                                        <a-switch
                                            v-model:checked="companyForm.perception_iva"
                                        />
                                    </a-col>
                                </a-row>

                                <div class="button-group">
                                    <a-button
                                        type="primary"
                                        :size="sizeButton"
                                        :loading="loading"
                                        @click.prevent="onSubmit"
                                    >
                                        <span>{{
                                            props.isSaveButton
                                                ? "Guardar datos"
                                                : "Actualizar datos"
                                        }}</span>
                                    </a-button>
                                    <!-- <a-button
                                        @click="resetForm"
                                        class="btn-outlined"
                                        :size="sizeButton"
                                        :outlined="true"
                                        type="light"
                                    >
                                        <span> Limpiar datos</span>
                                    </a-button> -->
                                </div>
                            </a-form>
                        </VerticalFormStyleWrap>
                    </FormValidationWrap>
                </sdCards>
            </a-col>
        </a-row>
    </Main>
</template>
<style>
.button-group {
    margin-top: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px; /* Espacio entre los botones */
}
.ant-picker-input input {
    height: 46px;
    text-align: center;
}

.alert-empty-message {
    margin-bottom: 3rem;
}
.divider {
    margin-top: 3rem;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
@media (max-width: 768) {
    .radio-group {
        flex-direction: column !important;
    }
    .button-group a-button {
        display: block; /* Hace que los botones sean de tipo block */
        width: 100%; /* Asegura que los botones ocupen todo el ancho disponible */
        size: small; /* Cambia el tamaño de los botones a small */
    }
}
#iibb,
#iva {
    margin-right: 7px;
}

.radio-group {
    display: flex;
    flex-wrap: wrap;
}

.mr-1r {
    margin-right: 1rem;
}
.ta-center {
    text-align: center;
}
.radio-group .ant-radio-button-wrapper {
    flex: 1 1 100%;
    margin-bottom: 8px; /* Espacio entre los botones */
}

@media (min-width: 769px) {
    .radio-group .ant-radio-button-wrapper {
        flex: 1;
        margin-bottom: 0;
    }

    .button-group a-button {
        display: block; /* Hace que los botones sean de tipo block */
        width: 100%; /* Asegura que los botones ocupen todo el ancho disponible */
        size: small; /* Cambia el tamaño de los botones a small */
    }
}
.mobile-space {
    margin-top: 0.6rem;
    margin-bottom: 0.6rem;
}
.mobile-style {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
.orange-button {
    background-color: orange;
    border-color: orange;
    color: white;
}
</style>
