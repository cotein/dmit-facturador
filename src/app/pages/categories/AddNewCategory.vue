<template>
	<div>
		<sdPageHeader title="Ingresar Categoría" class="ninjadash-page-header-main"> </sdPageHeader>
		<Main>
			<AddFatherCategory />
			<GetInfoByCuitVue />
		</Main>
	</div>
</template>

<script setup lang="ts">
import GetInfoByCuitVue from '@/app/components/afip/GetInfoByCuit.vue';
import { Main } from '../../styled';
import AddFatherCategory from '@/app/components/category/AddFatherCategory.vue';
import { usePadronComposable } from '@/app/composables/afip/usePadronComposable';
import { watch } from 'vue';
const { SujetoGetter } = usePadronComposable();
</script>
