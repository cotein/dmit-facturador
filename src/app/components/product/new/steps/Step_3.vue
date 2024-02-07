<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useProductComposable } from '@/app/composables/product/useProductComposable';
import { usePriceListComposable } from '@/app/composables/priceList/usePriceListComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import type { PriceListTranferData, PriceList } from '@/app/types/PriceList';

const { CompanyGetter } = useCompanyComposable();
const { priceListForTransferComponent, PriceListGetter } = usePriceListComposable(CompanyGetter.value.id!);
const { productStore } = useProductComposable();

const step3FormRef = ref();

const disabled = ref<boolean>(false);

const selectedKeys = ref<string[]>([]);

const handleChange = (nextTargetKeys: number[], direction: string, moveKeys: string[]) => {
	productStore.selectedPriceList = [];

	nextTargetKeys.map((id: number) => {
		PriceListGetter.value.map((pl: PriceList) => {
			console.log('🚀 ~ file: Step_3.vue:23 ~ PriceListGetter.value.map ~ pl:', pl, id);
			if (pl.value === id) {
				productStore.selectedPriceList.push(`${pl.label} - Gcia. ${pl.profit_percentage} %`);
			}
		});
	});
};

const handleSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
	//console.log('targetSelectedKeys: ', targetSelectedKeys);
};

const handleScroll = (direction: string, e: Event) => {
	console.log('direction:', direction);
	console.log('target:', e.target);
};

const costValidator = (rule: any, value: any) => {
	return new Promise((resolve, reject) => {
		if (!/^\d+(\.\d+)?$/.test(value)) {
			reject('Sólo se permiten números.');
		}

		if (value <= 0) {
			reject('El costo del producto debe ser mayor a cero.');
		}
		resolve(true);
	});
};

const priceListValidator = (rule: any, value: any) => {
	return new Promise((resolve, reject) => {
		if (value <= 0) {
			reject('El producto debe estar relacionado con alguna lista de precios');
		} else {
			resolve(true);
		}
	});
};

const rules = reactive({
	cost: [
		{
			validator: costValidator,
			trigger: 'blur',
		},
	],
	price_list: [
		{
			validator: priceListValidator,
			trigger: 'blur',
		},
	],
});

const validateForm = async () => {
	const isValid = await step3FormRef.value.validate().catch((error: any) => {
		return false;
	});

	if (isValid) {
		return true;
	} else {
		return false;
	}
};

defineExpose({ validateForm });
</script>
<template>
	<div class="content--step">
		<a-form
			name="ninjadash_validation-form"
			ref="step3FormRef"
			:model="productStore.product"
			:rules="rules"
			layout="vertical"
		>
			<a-row justify="space-between" align="middle" :gutter="31">
				<a-col :span="5">
					<a-form-item ref="cost" label="Precio de costo del producto" name="cost">
						<a-input v-model:value="productStore.product.cost" placeholder="Costo" />
					</a-form-item>
				</a-col>
				<a-col :span="19">
					<a-form-item ref="price_list" label="Seleccionar listas de precio" name="price_list">
						<a-transfer
							v-model:target-keys="productStore.product.price_list"
							v-model:selected-keys="selectedKeys"
							:data-source="priceListForTransferComponent"
							:one-way="true"
							:list-style="{
								width: '300px',
								height: '300px',
								'text-align': 'left',
							}"
							:titles="[' Listas de precio', ' Seleccionado/s']"
							:render="(item:PriceListTranferData) => item.title"
							:disabled="disabled"
							@change="handleChange"
							@selectChange="handleSelectChange"
							@scroll="handleScroll"
						/>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
	</div>
</template>

<style scoped>
.content--step {
	min-height: 25rem;
}
</style>
