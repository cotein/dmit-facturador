<!-- eslint-disable indent -->
<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import { useProductComposable } from "@/app/composables/product/useProductComposable";
import { useIvaComposable } from "@/app/composables/afip/useIvaComposable";
import { useCompanyComposable } from "@/app/composables/company/useCompanyComposable";
import { AFIP_INSCRIPTION, AFIP_IVAS } from "@/app/types/Constantes";
import { onlyNumericInputEvent, selectText } from "@/app/helpers/onlyNumbers";

const { product } = useProductComposable();
const { CompanyGetter } = useCompanyComposable();
const { IvasGetter } = await useIvaComposable();
const step2FormRef = ref();

const metersByUnityValidator = (rule: any, value: any) => {
    return new Promise((resolve, reject) => {
        if (!/^\d+(\.\d+)?$/.test(value)) {
            reject("Sólo se permiten números.");
        }

        if (product.value.sale_by_meter && value <= 0) {
            reject("El valor debe ser mayor a cero.");
        }

        resolve(true);
    });
};

const discountAmountValidator = (rule: any, value: any) => {
    return new Promise((resolve, reject) => {
        if (product.value.apply_discount && value <= 0) {
            reject("El importe debe ser mayor a cero.");
        } else {
            resolve(true);
        }
    });
};
const discountPercentageValidator = (rule: any, value: any) => {
    return new Promise((resolve, reject) => {
        if (product.value.apply_discount && value <= 0) {
            reject("El porcentaje de descuento debe ser mayor a cero.");
        } else {
            resolve(true);
        }
    });
};
const priorityValidator = (rule: any, value: any) => {
    return new Promise((resolve, reject) => {
        if (!/^\d+$/.test(value)) {
            reject("La prioridad debe ser un número");
        }
        resolve(true);
    });
};

const rules = reactive({
    quantity: [
        {
            required: true,
            message: "La cantidad es requerida",
            trigger: "blur",
        },
    ],
    critical_stock: [
        {
            required: true,
            message: "La cantidad es requerida",
            trigger: "blur",
        },
    ],
    apply_discount_amount: [
        {
            validator: discountAmountValidator,
            trigger: "blur",
        },
    ],
    apply_discount_percentage: [
        {
            validator: discountPercentageValidator,
            trigger: "blur",
        },
    ],
    meters_by_unity: [
        {
            validator: metersByUnityValidator,
            trigger: "blur",
        },
    ],
    priority: [
        {
            validator: priorityValidator,
            trigger: "blur",
        },
    ],
});

const validateForm = async () => {
    const isValid = await step2FormRef.value.validate().catch((error: any) => {
        return false;
    });

    if (isValid) {
        return true;
    } else {
        return false;
    }
};

/* const IvaZeroPercent = computed(() => {
    switch (CompanyGetter.value?.inscription_id) {
        case AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO:
            product.value.iva = AFIP_IVAS.AFIP_ID_CERO;
            return true;
        case AFIP_INSCRIPTION.IVA_SUJETO_EXENTO:
            product.value.iva = AFIP_IVAS.AFIP_ID_CERO;
            return true;
        default:
            return false;
    }
}); */

const IvaZeroPercent = computed(() => {
    return (
        CompanyGetter.value?.inscription_id ===
            AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO ||
        CompanyGetter.value?.inscription_id === AFIP_INSCRIPTION.IVA_SUJETO_EXENTO
    );
});

watch(
    () => IvaZeroPercent.value,
    (newValue) => {
        console.log("🚀 ~ watch ~ newValue:", newValue);
        if (newValue) {
            product.value.iva = AFIP_IVAS.AFIP_ID_CERO;
        }
    }
);

defineExpose({ validateForm });
</script>
<template>
    <div class="content--step">
        <a-form
            name="ninjadash_validation-form"
            ref="step2FormRef"
            :model="product"
            :rules="rules"
            layout="vertical"
        >
            <a-row justify="space-between" align="middle" :gutter="31">
                <a-col :xs="24" :sm="24" :md="8" :lg="8">
                    <a-form-item ref="quantity" label="Cantidad inicial" name="quantity">
                        <a-input
                            v-model:value="product.quantity"
                            placeholder="Cantidad"
                            @keypress="onlyNumericInputEvent"
                            inputmode="numeric"
                            @focus="selectText"
                        />
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="8" :lg="8">
                    <a-form-item
                        ref="critical_stock"
                        label="Stock crítico"
                        name="critical_stock"
                    >
                        <a-input
                            v-model:value="product.critical_stock"
                            placeholder="Cantidad"
                            @keypress="onlyNumericInputEvent"
                            inputmode="numeric"
                            @focus="selectText"
                        />
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="8" :lg="8">
                    <a-form-item ref="iva" label="Iva del producto" name="iva">
                        <p v-if="IvaZeroPercent">
                            De acuerdo a su inscripción en ARCA sus artículos no gravan
                            IVA
                        </p>
                        <a-select
                            v-else
                            v-model:value="product.iva"
                            size="large"
                            :disabled="IvaZeroPercent ? true : false"
                            show-search
                            placeholder="Inscripción en Arca"
                            :default-active-first-option="false"
                            :show-arrow="false"
                            :filter-option="false"
                            allowClear
                            :not-found-content="null"
                            :options="IvasGetter"
                        ></a-select>
                    </a-form-item>
                </a-col>
                <!-- <a-col :xs="24" :sm="12" :md="8" :lg="6">
                    <a-form-item ref="sale_by_meter" label="Se vende por metro?" name="sale_by_meter">
                        <a-switch
                            v-model:checked="product.sale_by_meter"
                            style="margin-left: 15px"
                            checked-children="SÍ"
                            un-checked-children="NO"
                        />
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :md="8" :lg="6">
                    <a-form-item ref="meters_by_unity" label="Metros de cada unidad" name="meters_by_unity">
                        <a-input
                            v-model:value="product.meters_by_unity"
                            placeholder="Cantidad"
                            :disabled="!product.sale_by_meter"
                        />
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :md="8" :lg="6">
                    <a-form-item ref="published_here" label="Publicar en la tienda" name="published_here">
                        <a-switch
                            v-model:checked="product.published_here"
                            style="margin-left: 15px"
                            checked-children="SÍ"
                            un-checked-children="NO"
                        />
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :md="8" :lg="6">
                    <a-form-item ref="priority" label="Prioridad de vista" name="priority">
                        <a-input
                            v-model:value="product.priority"
                            placeholder="Prioridad"
                            :disabled="!product.published_here"
                        />
                    </a-form-item>
                </a-col> -->
            </a-row>

            <a-row justify="space-between" align="middle" :gutter="31">
                <!-- <a-col :xs="24" :sm="12" :md="8" :lg="6">
                    <a-form-item ref="view_price" label="Visualizar precio en la tienda" name="view_price">
                        <a-switch
                            v-model:checked="product.view_price"
                            style="margin-left: 15px"
                            checked-children="SÍ"
                            un-checked-children="NO"
                        />
                    </a-form-item>
                </a-col>

                <a-col :xs="24" :sm="12" :md="8" :lg="6">
                    <a-form-item ref="apply_discount" label="Aplicar descuento" name="apply_discount">
                        <a-switch
                            v-model:checked="product.apply_discount"
                            style="margin-left: 15px"
                            checked-children="SÍ"
                            un-checked-children="NO"
                        />
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :md="8" :lg="6">
                    <a-form-item
                        ref="apply_discount_amount"
                        label="Monto que aplicará el descuento"
                        name="apply_discount_amount"
                    >
                        <a-input
                            v-model:value="product.apply_discount_amount"
                            placeholder="Cantidad"
                            :disabled="!product.apply_discount"
                        />
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :md="8" :lg="6">
                    <a-form-item
                        ref="apply_discount_percentage"
                        label="Descuento que aplicará (%)"
                        name="apply_discount_percentage"
                    >
                        <a-input
                            v-model:value="product.apply_discount_percentage"
                            placeholder="Porcentaje"
                            :disabled="!product.apply_discount"
                        />
                    </a-form-item>
                </a-col> -->
            </a-row>
        </a-form>
    </div>
</template>

<style scoped>
.content--step {
    min-height: 25rem;
}
</style>
