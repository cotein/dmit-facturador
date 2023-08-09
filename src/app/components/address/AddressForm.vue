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
		<a-form :model="addressStore.address" :rules="rules" layout="vertical" ref="addressFormRef">
			<a-row :gutter="16">
				<a-col :span="12">
					<a-form-item ref="state_id" name="state_id" label="Provincia">
						<a-select
							v-model:value="addressStore.address.state_id"
							size="large"
							show-search
							placeholder="Inscripción en Afip"
							:default-active-first-option="false"
							:show-arrow="false"
							:filter-option="false"
							allowClear
							:not-found-content="null"
							:loading="statesLoading"
							:options="statesStore.StatesGetter"
						>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item ref="city" name="city" label="Localidad">
						<a-input v-model:value="addressStore.address.city" autocomplete="off" />
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="16">
				<a-col :span="24">
					<a-form-item ref="street" name="street" label="Calle">
						<a-input v-model:value="addressStore.address.street" autocomplete="off" />
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="16">
				<a-col :span="12">
					<a-form-item ref="cp" name="cp" label="Código Postal">
						<a-input v-model:value="addressStore.address.cp" autocomplete="off" />
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item ref="number" name="number" label="Número">
						<a-input v-model:value="addressStore.address.number" autocomplete="off" />
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="16">
				<a-col :span="24">
					<a-form-item label="Entre calles" name="between_streets">
						<a-textarea
							v-model:value="addressStore.address.between_streets"
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
							v-model:value="addressStore.address.obs"
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
import { ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { useState } from '@/composables/afip/useStateComposable';
import { useAddressStore } from '@/store/address/address-store';

interface Props {
	title: string;
}
/**STORE */
const addressStore = useAddressStore();
const { statesLoading, statesStore } = useState();

/**PROPS */
const props = defineProps<Props>();

const rules: Record<string, Rule[]> = {
	state_id: [{ required: true, message: 'La provincia es requerida' }],
	city: [{ required: true, message: 'La localidad es requerida' }],
	street: [{ required: true, message: 'La calle es requerida' }],
	cp: [{ required: true, message: 'El código postal es requerido' }],
	//number: [{ required: true, message: 'El número es requerido' }],
};

const addressFormRef = ref();

const open = ref<boolean>(false);

/**METHODS */
const showDrawer = () => {
	open.value = true;
};

const onClose = () => {
	open.value = false;
};

const resetForm = () => {
	addressFormRef.value.resetFields();
	addressStore.isValid = false;
};

const onSubmit = async () => {
	const addressIsOk = await addressFormRef.value.validate();

	if (addressIsOk) {
		addressStore.isValid = true;
		open.value = false;
	}
};
</script>
