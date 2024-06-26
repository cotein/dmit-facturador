<template>
    <a-button type="primary" @click="showDrawer">
        <template #icon><PlusOutlined /></template>
        {{ props.title }}
    </a-button>
    <a-drawer
        title="Domicilio"
        :width="720"
        :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }"
        :visible="open"
        @close="onClose"
    >
        <a-form :model="addressInStore" :rules="rules" layout="vertical" ref="addressFormRef" autocomplete="off-off">
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item ref="state_id" name="state_id" label="Provincia">
                        <a-select
                            v-model:value="addressInStore.state_id"
                            size="large"
                            placeholder="Inscripción en Afip"
                            :default-active-first-option="false"
                            :show-arrow="false"
                            :filter-option="false"
                            allowClear
                            :not-found-content="null"
                            :loading="statesLoading"
                            :options="statesStore.StatesGetter"
                            autocomplete="off-off"
                        >
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item ref="city" name="city" label="Localidad">
                        <a-input v-model:value="addressInStore.city" autocomplete="off-off" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :span="24">
                    <a-form-item ref="street" name="street" label="Calle">
                        <a-input v-model:value="addressInStore.street" autocomplete="off-off" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item ref="cp" name="cp" label="Código Postal">
                        <a-input type="text" v-model:value="addressInStore.cp" autocomplete="off-off" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item ref="number" name="number" label="Número">
                        <a-input v-model:value="addressInStore.number" autocomplete="off-off" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :span="24">
                    <a-form-item label="Entre calles" name="between_streets">
                        <a-textarea
                            v-model:value="addressInStore.between_streets"
                            show-count
                            :maxlength="250"
                            placeholder="Por favor ingrese entre qué calles se encuentra el domicilio"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :span="24">
                    <a-form-item label="Observaciones" name="obs">
                        <a-textarea
                            v-model:value="addressInStore.obs"
                            show-count
                            :maxlength="250"
                            placeholder="Si desea ingresar alguna observación del domicilio, ingreselo aquí"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <template #extra>
            <a-space>
                <a-button @click="onClose">Cerrar</a-button>
                <a-button @click="resetForm" danger>Limpiar datos</a-button>
                <a-button type="primary" @click="onSubmit">Guardar</a-button>
            </a-space>
        </template>
    </a-drawer>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch, reactive } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { useState } from '@/app/composables/afip/useStateComposable';
//import { useAddressComposable } from "@/app/composables/address/useAddressComposable";
import { useAddressStore } from '@/app/store/address/address-store';
import { storeToRefs } from 'pinia';
import type { Address } from '@/app/types/Address';
interface Props {
    title: string;
}

const { addressInStore } = storeToRefs(useAddressStore());
const { isValid } = storeToRefs(useAddressStore());
const { statesLoading, statesStore } = useState();

const props = defineProps<Props>();
const addressFormRef = ref();

const open = ref<boolean>(false);
/* const address = reactive<Address>({
  state_id: "",
  city: "",
  street: "",
  cp: "",
  number: "",
  obs: "",
  between_streets: "",
  addressable_id: "",
  addressable_type: "",
}); */
const rules = reactive<Record<string, Rule[]>>({
    state_id: [
        {
            required: true,
            message: 'La provincia es requerida',
            validator: (_: any, value: any) => {
                console.log('🚀 ~ _:', _);
                console.log('🚀 ~ value:', value);
                if (value === '' || value === null || value === undefined) {
                    return Promise.reject();
                }
                return Promise.resolve();
            },
        },
    ],
    city: [
        {
            message: 'La localidad es requerida',
            validator: (_: any, value: any) => {
                console.log('🚀 ~ _:', _);
                console.log('🚀 ~ value:', value);
                if (value === '' || value === null || value === undefined) {
                    return Promise.reject();
                }
                return Promise.resolve();
            },
        },
    ],
    street: [
        {
            required: true,
            message: 'La calle es requerida',
            validator: (_: any, value: any) => {
                console.log('🚀 ~ _:', _);
                console.log('🚀 ~ value:', value);
                if (value === '' || value === null || value === undefined) {
                    return Promise.reject();
                }
                return Promise.resolve();
            },
        },
    ],
    cp: [
        {
            message: 'El código postal es requerido',
            validator: (_: any, value: any) => {
                console.log('🚀 ~ _:', _);
                console.log('🚀 ~ value:', value);
                if (value === '' || value === null || value === undefined) {
                    return Promise.reject();
                }
                return Promise.resolve();
            },
        },
    ],
    //number: [{ required: true, message: 'El número es requerido' }],
});

/**METHODS */
const showDrawer = () => {
    open.value = true;
};

const onClose = () => {
    open.value = false;
};

const resetForm = () => {
    addressFormRef.value.resetFields();
    isValid.value = false;
};

const onSubmit = async () => {
    try {
        const addressIsOk = await addressFormRef.value.validate();

        if (addressIsOk) {
            isValid.value = true;
            open.value = false;
            //addressInStore.value = address;
        }
    } catch (error) {
        console.error('Error al validar el formulario', error);
    }
};
</script>
