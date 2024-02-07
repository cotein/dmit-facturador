<template>
	<a-range-picker
		style="width: 100%"
		:format="dateFormat"
		v-model:value="dates"
		:placeholder="['Fecha inicial', 'Fecha final']"
		@change="servDates"
	/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useFilterSearchByBetweenDaysStore } from '@/app/store/filter-search/useFilterSearchByBetweenDaysStore';

const { from, to } = storeToRefs(useFilterSearchByBetweenDaysStore());
const dates = ref();

const appendZero = function (number: number) {
	return Number(number) < 10 ? '0' + number : number;
};
const dateFormat = 'DD/MM/YYYY';

const servDates = (date: any): void => {
	console.log('🚀 ~ servDates ~ date:', date);
	if (date) {
		from.value = `${date[0].$y}-${appendZero(date[0].$M + 1)}-${appendZero(date[0].$D)}`;
		to.value = `${date[1].$y}-${appendZero(date[1].$M + 1)}-${appendZero(date[1].$D)}`;
	} else {
		from.value = null;
		to.value = null;
	}
};
</script>

<style scoped></style>
