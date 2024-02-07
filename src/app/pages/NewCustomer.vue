<template>
	<div>
		<sdPageHeader title="Alta Clientes" class="ninjadash-page-header-main"> </sdPageHeader>
		<Main>
			<FormCustomer />
		</Main>
	</div>
</template>

<script setup lang="ts">
import { Main } from '../styled';
import FormCustomer from '@/app/components/customer/FormCustomer.vue';
</script>
