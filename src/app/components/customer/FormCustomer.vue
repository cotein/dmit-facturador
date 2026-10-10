<script setup lang="ts">
import { useCustomerComposable } from '@/app/composables/customer/useCustomerComposable';
import { FormValidationWrap, VerticalFormStyleWrap } from '@/app/styles/formsStyle';
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import { useInscriptionsComposable } from '@/app/composables/afip/useInscriptionsComposable';
import AddressForm from '../../components/address/AddressForm.vue';
import { useAddressStore } from '@/app/store/address/address-store';
import { saveCustomer } from '@/api/customer/customer-api';
import 'ant-design-vue/lib/message/style/index.css';
import 'ant-design-vue/lib/notification/style/index.css';
import type { Sujeto } from '@/app/types/Company';
import { TypeCompany } from '@/app/types/Constantes';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { storeToRefs } from 'pinia';
import GetInfoByCuit from '../afip/GetInfoByCuit.vue';
import { usePadronAfipStore } from '@/app/store/afip/usePadronAfipStore';
import type { PersonaReturn } from '@/app/types/Afip';
import { showMessage } from '@/app/helpers/mesaages';

interface Props {
    shouldUseAddressRule: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    shouldUseAddressRule: false,
});

const { sujeto, clearSujetoData } = usePadronAfipStore();

const { CompanyGetter } = useCompanyComposable();

const { lastNameIsRequired, rules, customerForm, clearData } = useCustomerComposable();

const loading = ref<boolean>(false);

const customerFormRef = ref();

/**COMPOSABLES */
const { isLoading: inscriptionLoading, store } = useInscriptionsComposable();

const { isValid } = storeToRefs(useAddressStore());

const addressStore = useAddressStore();

/**METHODS */
const onSubmit = async () => {
    if (!lastNameIsRequired.value) {
        delete rules.lastName;
    }
    loading.value = true;

    const validate = await customerFormRef.value
        .validate()
        .catch((error: any) => {
            console.log('error', error);
        })
        .finally(() => {
            loading.value = false;
        });

    if (validate) {
        customerForm.value.address = addressStore.addressInStore;

        if (CompanyGetter.value) {
            customerForm.value.company_id = CompanyGetter.value.id;
        }

        const customer = await saveCustomer(customerForm.value as Sujeto)
            .catch((err) => {
                showMessage('error', err.response.data.message, 4);
            })
            .finally(() => (loading.value = false));

        if (customer) {
            showMessage('success', 'El Cliente se ha registrado correctamente', 4);
            resetForm();
        }
    }
};

const resetForm = () => {
    customerFormRef.value.resetFields();
};

/**
 * El pie del drawer (y el `Enter` de un campo de texto) necesitan disparar guardar y limpiar
 * sin duplicar acá la validación ni el payload: se exponen los mismos métodos de siempre.
 */
defineExpose({
    submit: onSubmit,
    reset: resetForm,
});

const getTipoPersona = (personaReturn: PersonaReturn): string => {
    return personaReturn.datosGenerales.tipoPersona;
};

watch(
    () => sujeto,
    (newValue) => {
        const afipData = newValue.afip_data as PersonaReturn;
        customerForm.value.name = newValue.name;
        customerForm.value.cuit_id = newValue.cuit_id;
        customerForm.value.lastName = newValue.lastName;
        customerForm.value.inscription = newValue.inscription;
        customerForm.value.afip_data = afipData;
        customerForm.value.type_customer = newValue.type_company;
        if (newValue.type_company === 1) {
            lastNameIsRequired.value = false;
        }

        if (newValue.type_company === 2) {
            lastNameIsRequired.value = true;
        }
    },
    { deep: true },
);

onBeforeMount(() => {
    if (props.shouldUseAddressRule) {
        rules.address.push({
            required: true,
            message: 'Debe ingresar un domicilio válido',
            validator: () => {
                if (addressStore.isValid) {
                    return Promise.resolve();
                }
                return Promise.reject();
            },
        });
    }
});

onMounted(() => {
    // El CUIT (y los datos del padrón) viven en un store compartido con el alta de compañía.
    // Si quedó cargado el CUIT de una compañía, aparecía heredado acá: al abrir el alta de
    // cliente se limpia para que el campo arranque vacío.
    clearSujetoData();
});
</script>

<template>
    <a-row :gutter="25" class="componente">
        <a-col :xs="24">
            <FormValidationWrap>
                <VerticalFormStyleWrap>
                    <a-form
                        name="ninjadash_validation-form"
                        ref="customerFormRef"
                        :model="customerForm"
                        :rules="rules"
                        layout="vertical"
                        class="customer-form"
                    >
                        <section class="customer-form__section" aria-labelledby="customer-section-fiscal">
                            <header class="customer-form__section-head">
                                <h3 id="customer-section-fiscal" class="customer-form__section-title">
                                    Datos fiscales
                                </h3>
                                <p class="customer-form__section-hint">
                                    Buscá el CUIT en el padrón y los datos se completan solos.
                                </p>
                            </header>

                            <a-row :gutter="[24, 16]">
                                <a-col :xs="24" :md="12" class="customer-form__field--cuit">
                                    <GetInfoByCuit :only-cuit="false" inline-button />
                                </a-col>
                            </a-row>
                        </section>

                        <section class="customer-form__section" aria-labelledby="customer-section-client">
                            <header class="customer-form__section-head">
                                <h3 id="customer-section-client" class="customer-form__section-title">
                                    Datos del cliente
                                </h3>
                            </header>

                            <!--
                                El orden de las columnas define las filas de la grilla: con
                                Apellido (que aparece y desaparece según el tipo de persona) queda
                                pareja en los dos casos, siempre en lecturas izquierda-derecha.
                            -->
                            <a-row :gutter="[24, 16]">
                                <a-col :xs="24" :md="12">
                                    <a-form-item
                                        ref="name"
                                        :label="lastNameIsRequired ? 'Nombre' : 'Razón Social'"
                                        name="name"
                                    >
                                        <a-input
                                            v-model:value="customerForm.name"
                                            :placeholder="lastNameIsRequired ? 'Nombre' : 'Razón Social'"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :xs="24" :md="12" v-if="lastNameIsRequired">
                                    <a-form-item ref="lastName" name="lastName" label="Apellido">
                                        <a-input v-model:value="customerForm.lastName" placeholder="Apellido" />
                                    </a-form-item>
                                </a-col>
                                <a-col :xs="24" :md="12">
                                    <a-form-item ref="fantasy_name" name="fantasy_name" label="Nombre de fantasía">
                                        <a-input
                                            v-model:value="customerForm.fantasy_name"
                                            placeholder="Nombre de fantasía"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :xs="24" :md="12">
                                    <a-form-item ref="inscription" name="inscription" label="Inscripción en AFIP">
                                        <a-select
                                            v-model:value="customerForm.inscription"
                                            class="customer-form__select"
                                            show-search
                                            placeholder="Inscripción en AFIP"
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
                                <a-col :xs="24" :md="12">
                                    <a-form-item ref="type_customer" name="type_customer" label="Tipo de empresa">
                                        <a-select
                                            v-model:value="customerForm.type_customer"
                                            class="customer-form__select"
                                            placeholder="Tipo de empresa"
                                            :default-active-first-option="false"
                                            :show-arrow="false"
                                            :filter-option="false"
                                            allowClear
                                            :not-found-content="null"
                                        >
                                            <a-select-option :value="TypeCompany.JURIDICA">JURÍDICA</a-select-option>
                                            <a-select-option :value="TypeCompany.FISICA">FÍSICA</a-select-option>
                                        </a-select>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </section>

                        <section class="customer-form__section" aria-labelledby="customer-section-address">
                            <header class="customer-form__section-head">
                                <h3 id="customer-section-address" class="customer-form__section-title">Domicilio</h3>
                                <p class="customer-form__section-hint">
                                    Podés cargarlo a mano o traerlo del padrón con la búsqueda del CUIT.
                                </p>
                            </header>

                            <a-row :gutter="[24, 16]">
                                <a-col :xs="24" :md="12">
                                    <a-form-item
                                        ref="address"
                                        name="address"
                                        label="Domicilio"
                                        :extra="!isValid ? 'Es necesario definir un domicilio' : 'Cambiar domicilio'"
                                    >
                                        <a-badge :dot="!isValid ? true : false">
                                            <AddressForm
                                                :title="isValid ? 'Actualizar domicilio' : 'Agregar domicilio'"
                                            />
                                        </a-badge>
                                    </a-form-item>
                                </a-col>
                                <!--
                                    Columna vacía en escritorio: el domicilio es una sola tarjeta
                                    angosta y, sin esto, la fila mostraba una columna fantasma al
                                    lado. En celular no se renderiza (ahí ya es una sola columna).
                                -->
                                <a-col :xs="0" :md="12" aria-hidden="true" class="customer-form__spacer"></a-col>
                            </a-row>
                        </section>
                    </a-form>
                </VerticalFormStyleWrap>
            </FormValidationWrap>
        </a-col>
    </a-row>
</template>
<style scoped>
/*
    Tokens del tema, solo para no repetir hex en cada regla. No se agrega ningún color nuevo.
    El pie de acciones no vive acá: está en el footer del drawer.
*/
.customer-form {
    --field-border: #e3e6ef;
    --field-border-soft: #f1f2f6;
    --surface-soft: #f8f9fb;
    --text: #404040;
    --text-soft: #585858;
    --focus: #8231d3;
    --ease: cubic-bezier(0.16, 1, 0.3, 1);
    --radius: 4px;
    --field-height: 36px;

    display: flex;
    flex-direction: column;
    width: 100%;
}

.customer-form__section + .customer-form__section {
    margin-top: 28px;
    padding-top: 24px;
    border-top: 1px solid var(--field-border-soft);
}

.customer-form__section-head {
    margin-bottom: 16px;
}

.customer-form__section-title {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.3;
    color: var(--text);
}

.customer-form__section-hint {
    margin: 4px 0 0;
    font-size: 13px;
    line-height: 1.4;
    color: var(--text-soft);
}

/* Etiquetas arriba, sin negrita de más y con el obligatorio marcado por Ant. */
.customer-form :deep(.ant-form-item) {
    margin-bottom: 0;
}

.customer-form :deep(.ant-form-item-label) {
    padding-bottom: 4px;
}

.customer-form :deep(.ant-form-item-label > label) {
    height: auto;
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
}

.customer-form :deep(.ant-form-item-extra) {
    font-size: 13px;
    line-height: 1.4;
    color: var(--text-soft);
}

/* Campos parejos: misma altura para input, select y el campo con sufijo del CUIT. */
.customer-form :deep(.ant-input),
.customer-form :deep(.ant-input-affix-wrapper),
.customer-form :deep(.ant-select-single:not(.ant-select-customize-input) .ant-select-selector) {
    min-height: var(--field-height);
    border-radius: var(--radius);
    border-color: var(--field-border);
    font-size: 15px;
    color: var(--text);
    transition: border-color 0.2s var(--ease), box-shadow 0.2s var(--ease);
}

/*
    El wrapper del input con sufijo (CUIT) trae su propio padding, y su input interno trae
    `padding: 12px 11px` de una regla global: sumados, el campo terminaba del doble de alto que
    los demás. Acá se normaliza a la altura del resto y el sufijo se centra solo.
*/
.customer-form :deep(.ant-input-affix-wrapper) {
    padding: 0 11px;
    align-items: center;
}

.customer-form :deep(.ant-input-affix-wrapper > input.ant-input) {
    padding: 0;
    min-height: 34px;
    line-height: 34px;
    background-color: transparent;
}

.customer-form :deep(.ant-select-single:not(.ant-select-customize-input) .ant-select-selector) {
    padding: 0 11px;
    display: flex;
    align-items: center;
}

.customer-form :deep(.ant-select-single .ant-select-selection-item),
.customer-form :deep(.ant-select-single .ant-select-selection-placeholder) {
    line-height: 34px;
}

.customer-form :deep(.ant-input:hover),
.customer-form :deep(.ant-input-affix-wrapper:hover),
.customer-form :deep(.ant-select:not(.ant-select-disabled):hover .ant-select-selector) {
    border-color: var(--focus);
}

/* Se refuerza el anillo de foco de Ant, que con el fondo suave quedaba casi invisible. */
.customer-form :deep(.ant-input:focus),
.customer-form :deep(.ant-input-affix-wrapper:focus),
.customer-form :deep(.ant-input-affix-wrapper-focused),
.customer-form :deep(.ant-select-focused:not(.ant-select-disabled) .ant-select-selector) {
    border-color: var(--focus);
    box-shadow: none;
}

.customer-form :deep(.ant-input:focus-visible),
.customer-form :deep(.ant-input-affix-wrapper .ant-input:focus-visible),
.customer-form :deep(.ant-select-focused .ant-select-selector),
.customer-form :deep(.ant-btn:focus-visible) {
    outline: 2px solid var(--focus);
    outline-offset: 2px;
}

.customer-form :deep(.ant-input-affix-wrapper .ant-input:focus) {
    box-shadow: none;
}

/* Los errores entran con un movimiento corto, no aparecen de golpe. */
.customer-form :deep(.ant-form-item-explain-error) {
    font-size: 13px;
    line-height: 1.4;
    color: #cf1322;
    animation: customer-error-in 0.18s var(--ease);
}

@keyframes customer-error-in {
    from {
        opacity: 0;
        transform: translateY(-2px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/*
    El CUIT trae su propia búsqueda en el padrón. GetInfoByCuit la renderiza como un botón
    aparte, en una columna del 25% y con márgenes propios: acá se reacomoda, sin tocar el
    componente (lo comparte el alta de compañía), para que quede como sufijo dentro del campo.

    Las columnas de Ant traen `flex: 0 0 75%/25%`, así que la columna del botón no se puede
    encoger por flex: se le saca el ancho y el botón se posiciona con absoluto contra el
    `control-input-content` del CUIT, que es el que tiene el borde. Queda dentro del campo,
    centrado, sin empujar la grilla y sin tapar el mensaje de ayuda (que va debajo del borde).
*/
/*
    El CUIT trae su propia búsqueda en el padrón. Con `inline-button` el componente la
    renderiza dentro del campo como sufijo; desde acá solo se le da el ancho de la columna.
*/
.customer-form__field--cuit {
    max-width: 100%;
    min-width: 0;
}

.customer-form__field--cuit :deep(.afip-lookup) {
    width: 100%;
    min-width: 0;
}

/* Columna de relleno: solo existe para que la fila del domicilio quede pareja. */
.customer-form__spacer {
    display: block;
}

@media (max-width: 768px) {
    .customer-form__spacer {
        display: none;
    }
}

.customer-form__select :deep(.ant-select-arrow) {
    inset-inline-end: 9px;
}

@media (max-width: 768px) {
    .customer-form :deep(.ant-input),
    .customer-form :deep(.ant-input-affix-wrapper) {
        padding-left: 10px;
        padding-right: 10px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .customer-form :deep(.ant-form-item-explain-error) {
        animation: none;
    }

    .customer-form :deep(.ant-input),
    .customer-form :deep(.ant-input-affix-wrapper),
    .customer-form :deep(.ant-select-single:not(.ant-select-customize-input) .ant-select-selector) {
        transition: none;
    }
}

.alert-empty-message {
    margin-bottom: 3rem;
}
</style>
