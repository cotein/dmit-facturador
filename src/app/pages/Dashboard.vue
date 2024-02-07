<template>
	<div>
		<sdPageHeader title="Mí Compañía" class="ninjadash-page-header-main"> </sdPageHeader>

		<Main>
			<a-row :gutter="25"> dash </a-row>
		</Main>
	</div>
</template>

<script setup lang="ts">
import { Main } from '../styled';
import { onBeforeMount } from 'vue';
import { useIvaComposable } from '../composables/afip/useIvaComposable';
import { useVoucherComposable } from '../composables/voucher/useVoucherComposable';
onBeforeMount(() => {
	useIvaComposable();
	useVoucherComposable();
});
</script>
