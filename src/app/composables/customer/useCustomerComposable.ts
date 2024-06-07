import { useAddressStore } from '@/app/store/address/address-store';
import { reactive } from 'vue';
import { useCustomerStore } from '@/app/store/customer/useCustomerStore';
import { storeToRefs } from 'pinia';
import { useQuery } from '@tanstack/vue-query';
import { getCustomers } from '@/api/customer/customer-api';
import type { Rule } from '@/app/types/ValidationRule';

const { lastNameIsRequired, customerForm, CustomersGetter, selectedCustomer } = storeToRefs(useCustomerStore());

const customerStore = useCustomerStore();

customerStore.$subscribe((store) => {}, { detached: true });

const { clearData, setCustomers } = useCustomerStore();

const addressStore = useAddressStore();

const rules = reactive<Record<string, Rule[]>>({
    name: [
        {
            required: true,
            message: 'El nombre es requerido',
            trigger: 'blur',
        },
    ],
    lastName: [
        {
            required: lastNameIsRequired.value,
            message: 'El Apellido es requerido',
            trigger: 'blur',
        },
    ],
    cuit: [
        {
            required: true,
            message: 'La CUIT/CUIL/DNI es requerida',
            trigger: 'blur',
        },
        {
            message: 'La CUIT debe poseer sólo números',
            validator: (_: any, value: any) => {
                const number = Number(value);
                if (Number.isNaN(number)) {
                    return Promise.reject();
                }
                return Promise.resolve();
            },
        },
    ],
    inscription: [
        {
            required: true,
            message: 'La inscripción en Afip es requerida',
            trigger: 'blur',
        },
    ],
    address: [] as any[],
    /* address: [
		{
			required: true,
			message: 'Debe ingresar un domicilio válido',
			validator: () => {
				if (addressStore.isValid) {
					return Promise.resolve();
				}
				return Promise.reject();
			},
		},
	], */
});

export const useCustomerComposable = () => {
    const fetchCustomers = (name: string) => {
        return useQuery(['customers'], () => getCustomers(name), {
            cacheTime: -1,
            keepPreviousData: true,

            onSuccess(data: []) {
                setCustomers(data);
            },
        });
    };

    return { rules, lastNameIsRequired, customerForm, clearData, fetchCustomers, CustomersGetter, selectedCustomer };
};
