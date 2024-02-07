import { getVouchers } from '@/api/voucher/voucher-api';
import { useQuery } from '@tanstack/vue-query';

import { useVoucherStore } from '@/app/store/voucher/useVoucherStore';

const { setVouchers } = useVoucherStore();

export const useVoucherComposable = () => {
	const fetchVouchers = (company_inscription_id: any) => {
		return useQuery(['vouchers'], () => getVouchers(company_inscription_id), {
			cacheTime: -1,

			onSuccess(data: []) {
				setVouchers(data);
			},
		});
	};
	return {
		fetchVouchers,
	};
};
