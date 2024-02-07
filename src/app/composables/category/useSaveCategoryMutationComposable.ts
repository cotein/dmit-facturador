import { useMutation, useQueryClient, useQuery } from '@tanstack/vue-query';
import { saveCategory } from '@/api/category/category-api';
import { message } from 'ant-design-vue';
import { useCompanyComposable } from '../company/useCompanyComposable';
import { getCategories } from '@/api/category/category-api';
import { useCategoryComposable } from './useCategoryComposable';

const { transform_categories, setCategories } = useCategoryComposable();

export const useSaveCategoryMutationComposable = (company_id: number) => {
	const queryClient = useQueryClient();

	const { mutateAsync, isLoading } = useMutation(saveCategory, {
		onSuccess: async (data) => {
			queryClient.invalidateQueries({
				queryKey: ['categories'],
				exact: false,
			});

			message.success('La categoría fue ingresada');

			const res = await getCategories(company_id, 0);

			const categories = transform_categories(res.data);

			setCategories(categories);
		},

		onSettled(data, error, variables, context) {},
	});
	return { mutateAsync, isLoading };
};
