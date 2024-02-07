<template>
	<a-button class="config--button" type="primary" @click="openDrawerAddCustomer">Ingresar Cliente</a-button>
	<a-drawer
		title="Ingresar Cliente"
		:visible="drawerAddCustomerIsVisible"
		@close="closeDrawerAddCustomer"
		:width="'80%'"
	>
		<template #extra>
			<a-button style="margin-right: 8px" @click="closeDrawerAddCustomer">Cerrar</a-button>
		</template>
		<FormCustomer :should-use-address-rule="false" />
	</a-drawer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import FormCustomer from './FormCustomer.vue';
import { useDrawerAddCustomerStore } from '@/app/store/panels/useDrawerAddCustomerStore';

const { drawerAddCustomerIsVisible } = storeToRefs(useDrawerAddCustomerStore());
const { openDrawerAddCustomer, closeDrawerAddCustomer } = useDrawerAddCustomerStore();
</script>

<style scoped>
.config--button {
	margin: 0 10px;
}
</style>
