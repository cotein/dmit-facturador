<template>
	<a-select
		show-search
		placeholder="Búsqueda de clientes"
		style="width: 100%"
		:default-active-first-option="false"
		:show-arrow="false"
		:allowClear="true"
		:filter-option="false"
		:not-found-content="fetching ? undefined : null"
		:options="options"
		@search="handleSearch"
		@select="select"
		@change="change"
		:mode="props.multiple ? 'multiple' : ''"
	>
		<template v-if="fetching" #notFoundContent>
			<a-spin size="small" />
		</template>
	</a-select>
</template>
<script setup lang="ts">
import { getCustomers } from '@/api/customer/customer-api';
import { ref } from 'vue';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { useFilterSearchByCustomerStore } from '@/app/store/filter-search/useFilterSearchByCustomerStore';
import type { CustomerSelectComponent } from '@/app/types/Customer';
import { storeToRefs } from 'pinia';

const { customer } = storeToRefs(useFilterSearchByCustomerStore());
const { CompanyGetter } = useCompanyComposable();
const { invoice } = useInvoiceComposable();

const fetching = ref(false);
const options = ref<{ value: any; label: string }[]>([]);

type Props = {
	multiple: boolean;
};

const props = withDefaults(defineProps<Props>(), {
	multiple: false,
});

const handleSearch = async (name: string) => {
	if (name != '') {
		fetching.value = true;
		const resp = await getCustomers(CompanyGetter.value.id, name);

		options.value = resp.map((customer: any) => {
			return {
				value: customer.id,
				label: `${customer.name} ${customer.last_name}`,
				cuit: parseInt(customer.afip_number),
				afip_inscription: customer.afip_inscription,
				afip_document: customer.afip_document,
			};
		});

		fetching.value = false;
	}
};
const select = (e: any, option: CustomerSelectComponent): void => {
	invoice.value.customer = option;
	customer.value = option;
};

const change = (e: any, option: CustomerSelectComponent): void => {
	if (option === undefined || option === null) {
		invoice.value.customer = null;
		customer.value = { value: null, label: '', cuit: '' };
	}
};
</script>
