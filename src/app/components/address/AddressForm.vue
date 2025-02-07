<template>
    <a-button type="primary" @click="showDrawer">
        <template #icon><PlusOutlined /></template>
        {{ props.title }}
    </a-button>
    <a-drawer
        :width="drawerWidth()"
        :body-style="bodyStyle"
        :footer-style="{ textAlign: 'right' }"
        :visible="open"
        @close="onClose"
    >
        <template #title>
            <h2 class="title">Domicilio</h2>
        </template>
        <a-form :model="addressInStore" :rules="rules" layout="vertical" ref="addressFormRef" autocomplete="off-off">
            <a-row :gutter="16">
                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <a-form-item ref="state_id" name="state_id" label="Provincia">
                        <a-select
                            v-model:value="addressInStore.state_id"
                            size="large"
                            placeholder="Inscripción en Arca"
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
                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <a-form-item ref="city" name="city" label="Localidad">
                        <a-input v-model:value="addressInStore.city" autocomplete="off-off" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <a-form-item ref="street" name="street" label="Calle">
                        <a-input v-model:value="addressInStore.street" autocomplete="off-off" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <a-form-item ref="cp" name="cp" label="Código Postal">
                        <a-input type="text" v-model:value="addressInStore.cp" autocomplete="off-off" />
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <a-form-item ref="number" name="number" label="Número">
                        <a-input v-model:value="addressInStore.number" autocomplete="off-off" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
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
                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
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
        <template #footer>
            <div class="button-group">
                <a-button :size="sizeButton" @click="onClose" :block="isMobile ? true : false">Cerrar</a-button>
                <a-button :size="sizeButton" @click="resetForm" danger>Limpiar datos</a-button>
                <a-button :size="sizeButton" type="primary" @click="onSubmit">Guardar</a-button>
            </div>
        </template>
    </a-drawer>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { useState } from '@/app/composables/afip/useStateComposable';
import { useAddressStore } from '@/app/store/address/address-store';
import { storeToRefs } from 'pinia';
import { useMediaQueryComposable } from '@/app/composables/mediaQuery.ts/useMediaQueryComposable';

interface Props {
    title: string;
}

const { drawerWidth, isMobile, isTablet, sizeButton } = useMediaQueryComposable();
const { addressInStore } = storeToRefs(useAddressStore());
const { isValid } = storeToRefs(useAddressStore());
const { statesLoading, statesStore } = useState();

const props = defineProps<Props>();
const addressFormRef = ref();

const open = ref<boolean>(false);

const bodyStyle = computed(() => {
    return isMobile || isTablet ? { paddingBottom: '80px' } : { paddingBottom: '80px' };
});

const rules = reactive<Record<string, Rule[]>>({
    state_id: [
        {
            required: true,
            message: 'La provincia es requerida',
            validator: (_: any, value: any) => {
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
<style scoped>
.button-group {
    margin-bottom: 5rem;
    display: flex;
    gap: 8px; /* Espacio entre los botones */
}

/* Estilos para cambiar el tamaño del título según el dispositivo */
@media (max-width: 768px) {
    .title {
        font-size: 14px; /* Tamaño del título para dispositivos móviles */
    }
    .button-group {
        flex-direction: column; /* Coloca los botones uno debajo del otro en dispositivos móviles */
    }
    .button-group a-button {
        width: 100%; /* Asegura que los botones ocupen todo el ancho disponible */
    }
}

@media (min-width: 769px) {
    .title {
        font-size: 18px; /* Tamaño del título para dispositivos de escritorio */
    }
}
.drawer-slide-enter-active,
.drawer-slide-leave-active {
    transition: transform 0.5s ease, opacity 0.5s ease;
}
.drawer-slide-enter,
.drawer-slide-leave-to {
    transform: translateX(100%);
    opacity: 0;
}
</style>
