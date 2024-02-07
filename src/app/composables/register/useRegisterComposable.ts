import { apiRegisterUser } from '@/api/auth/register-api';
import { useMutation } from '@tanstack/vue-query';
import { notification } from 'ant-design-vue';

export const useRegister = () => {
	const { isSuccess, error, mutate, data, isError, isLoading } = useMutation(apiRegisterUser, {
		onError(error: any) {
			if (error.response) {
				console.log('🚀 ~ file: useRegisterComposable.ts:7 ~ onError ~ error:', error.response.data.errors);

				for (const key in error.response.data.errors) {
					const element = error.response.data.errors[key];

					notification.open({
						message: 'Registración de Usuario',
						description: element[0],
						style: {
							width: '600px',
							marginLeft: `${335 - 600}px`,
							color: 'red',
						},
					});
				}
			}
		},
	});

	return {
		data,
		error,
		isError,
		isLoading,
		isSuccess,
		mutate,
	};
};
