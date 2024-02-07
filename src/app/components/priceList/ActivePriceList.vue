<script setup lang="ts">
import { computed } from 'vue';
import { usePriceListComposable } from '@/app/composables/priceList/usePriceListComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import type { PriceList } from '@/app/types/PriceList';

const { CompanyGetter } = useCompanyComposable();

const { modifyPriceListAsync, modifyPriceListLoading } = usePriceListComposable(CompanyGetter.value.id!);

type Props = {
	priceList: PriceList;
};

const props = defineProps<Props>();

const confirm = async (e: MouseEvent) => {
	console.log(e);
	const priceList = {
		id: props.priceList.value,
		active: !props.priceList.active,
		name: props.priceList.label,
		profit_percentage: props.priceList.profit_percentage,
	};
	console.log('🚀 ~ file: ActivePriceList.vue:28 ~ confirm ~ priceList:', priceList);

	await modifyPriceListAsync(priceList);
	/* return new Promise((resolve) => {
		setTimeout(() => resolve(true), 3000);
	}); */
};

const cancel = (e: MouseEvent) => {
	console.log(e);
};

const Title = computed(() => {
	return props.priceList.active ? true : false;
});
</script>
<template>
	<a-popconfirm
		:title="Title ? 'Desactivar lista de precios' : 'Activar lista de precios'"
		ok-text="SÍ"
		cancel-text="NO"
		@confirm="confirm"
		@cancel="cancel"
	>
		<a href="#">{{ Title ? 'Desactivar' : 'Activar' }}</a>
	</a-popconfirm>
</template>

<style scoped></style>
