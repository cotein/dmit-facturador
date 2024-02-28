<template>
	<a-range-picker
		style="width: 100%"
		:format="dateFormat"
		v-model:value="dates"
		:placeholder="['Fecha inicial', 'Fecha final']"
		@change="servDates"
		:locale="localeObject"
	/>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useFilterSearchByBetweenDaysStore } from '@/app/store/filter-search/useFilterSearchByBetweenDaysStore';
import { localeObject } from '@/app/config/date-picker-settings';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
const { from, to } = storeToRefs(useFilterSearchByBetweenDaysStore());
const dates = ref();

const appendZero = function (number: number) {
	return Number(number) < 10 ? '0' + number : number;
};

const dateFormat = 'DD/MM/YYYY';

const servDates = (date: Dayjs): void => {
	console.log('🚀 ~ servDates ~ date:', date);
	if (date) {
		from.value = `${date[0].$y}-${appendZero(date[0].$M + 1)}-${appendZero(date[0].$D)}`;
		to.value = `${date[1].$y}-${appendZero(date[1].$M + 1)}-${appendZero(date[1].$D)}`;
	} else {
		from.value = null;
		to.value = null;
	}
};

onMounted(() => {});
</script>

<style scoped></style>
