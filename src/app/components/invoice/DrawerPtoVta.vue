<template>
    <!-- <a-drawer title="Basic Drawer" placement="right" :visible="true" @close="closeDrawerPtoVta">
		<template #extra>
			<a-button style="margin-right: 8px" @click="closeDrawerPtoVta">Cancel</a-button>
		</template>
		<p>Some contents...</p>
		<p>Some contents...</p>
		<p>Some contents...</p>
	</a-drawer> -->
    <a-modal
        v-model:visible="drawerPtoVtaIsVisible"
        title="Se detectó que no posee un punto de venta asignado"
        @ok="handleOk"
        :maskClosable="false"
        :footer="null"
        :closable="false"
    >
        <a-row justify="space-between">
            <a-button type="primary" @click="fetchPtoVta" :loading="loading">Buscar en AFIP</a-button>
            <a-typography-paragraph v-model:content="text" v-if="ptoVta" id="typography"> </a-typography-paragraph>
            <a-tooltip v-if="ptoVta">
                <template #title>Guardar punto de venta</template>
                <a-button type="primary" size="middle" :loading="savePtoVtaLoading" @click="savePtoVta">
                    <template #icon>
                        <SaveOutlined />
                    </template>
                </a-button>
            </a-tooltip>
        </a-row>
    </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDrawerPtoVtaStore } from '@/app/store/panels/useDrawerPtoVtaStore';
import { storeToRefs } from 'pinia';
import { FEParamGetPtosVenta } from '@/api/afip/afip-factura-electronica';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { SaveOutlined } from '@ant-design/icons-vue';
import { updateCompanyPtoVta } from '@/api/company/company-api';
import { message } from 'ant-design-vue';
const { CompanyGetter, company } = useCompanyComposable();
const { drawerPtoVtaIsVisible } = storeToRefs(useDrawerPtoVtaStore());
const { closeDrawerPtoVta } = useDrawerPtoVtaStore();

const loading = ref<boolean>(false);
const savePtoVtaLoading = ref<boolean>(false);
const ptoVta = ref<number | null>(null);
const text = ref<string>('Punto de venta encontrado: ');

const handleOk = (e: MouseEvent) => {
    closeDrawerPtoVta();
};

const fetchPtoVta = async () => {
    loading.value = true;
    const data = await FEParamGetPtosVenta(
        CompanyGetter.value?.afip_environment,
        CompanyGetter.value?.cuit,
        CompanyGetter.value?.id,
        CompanyGetter.value?.user_id,
    )
        .catch((e) => {
            console.log('🚀 ~ file: DrawerPtoVta.vue:47 ~ fetchPtoVta ~ e:', e);
        })
        .finally(() => {
            loading.value = false;
        });

    if (data) {
        console.log('🚀 ~ file: DrawerPtoVta.vue:54 ~ fetchPtoVta ~ data:', data);
        ptoVta.value = data.data.FEParamGetPtosVentaResult.ResultGet.PtoVenta[0].Nro;
        text.value = `${text.value} ${ptoVta.value}.`;
    }
};

const savePtoVta = async () => {
    savePtoVtaLoading.value = true;
    const resp = await updateCompanyPtoVta(CompanyGetter.value?.id, ptoVta.value)
        .catch((e) => {
            console.log('🚀 ~ file: DrawerPtoVta.vue:78 ~ savePtoVta ~ e:', e);
        })
        .finally(() => {
            savePtoVtaLoading.value = false;
        });

    if (resp) {
        company.value!.pto_vta_fe = String(ptoVta.value);
        message.info({
            content: 'El punto de venta se actualizó correctamente',
            duration: 3,
        });
        setTimeout(() => {
            closeDrawerPtoVta();
        }, 2000);
    }
};
</script>

<style scoped></style>
