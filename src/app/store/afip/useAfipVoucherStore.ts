import type { AfipVoucher, AfipState } from '@/app/types/Afip';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAfipVoucherStore = defineStore('afip-vouchers', () => {
	//State properties
	const vouchers = ref<AfipVoucher[]>([]);
	//Actions
	const setVouchersAction = (value: AfipVoucher[]) => (vouchers.value = value);
	//Getters
	return {
		//State properties
		//Actions
		setVouchersAction,
		vouchers,
		//Getters
	};
});
