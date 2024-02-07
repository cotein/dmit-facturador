import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useVoucherStore = defineStore('vouchers', () => {
	const vouchers = ref<[]>([]);

	const setVouchers = (value: any) => (vouchers.value = value);

	return {
		//State properties
		//Actions
		setVouchers,
		//Getters
		Vouchers: computed(() => vouchers.value),
	};
});
