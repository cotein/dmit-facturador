import { saveProduct } from '@/api/product/product-api';
import { useProductStore } from '@/app/store/product/useProductStore';
import { useMutation } from '@tanstack/vue-query';

const productStore = useProductStore();

productStore.$subscribe(
	(value) => {
		/* console.log(
			'🚀 ~ file: useProductComposable.ts:8 ~ productStore.$subscribe ~ value:',
			typeof productStore.product.category,
		); */
	},
	{ detached: true },
);

export const useProductComposable = () => {
	const productStoreMutation = useMutation({
		mutationFn: saveProduct,
		onSuccess(data, variables, context) {
			console.log('🚀 ~ file: useProductComposable.ts:21 ~ onSuccess ~ data:', data);
		},
	});
	return {
		saveProduct,
		productStore,
		productStoreMutation,
	};
};
