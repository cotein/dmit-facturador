<template>
	<a-table :columns="columns" :data-source="props.companies" :loading="false">
		<template #headerCell="{ column }">
			<template v-if="column.key === 'name'">
				<span>
					<font-awesome-icon :icon="faBuilding" size="2x" :style="{ color: '#ccc' }" />
					{{ column.title }}
				</span>
			</template>
		</template>

		<template #bodyCell="{ column, record: company }">
			<template v-if="column.key === 'cuit'">
				<p style="text-align: center">{{ company.cuit }}</p>
			</template>

			<template v-if="column.key === 'inscription'">
				<p style="text-align: left">{{ company.inscription }}</p>
			</template>
			<template v-if="column.key === 'environment'">
				<p style="text-align: left">{{ company.environment }}</p>
			</template>
			<template v-if="column.key === 'created_at'">
				<p style="text-align: left">
					{{ moment(company.created_at).format('DD/MM/YYYY') }}
				</p>
			</template>

			<template v-if="column.key === 'action'">
				<a-button :icon="faShare" @click="asignCompanyData(company)">Seleccionar</a-button>
			</template>
		</template>
	</a-table>
</template>
<script lang="ts" setup>
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import type { Company } from '@/app/types/Company';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

interface Props {
	companies: Company[];
}

const props = defineProps<Props>();

const columns = [
	{
		title: 'COMPAÑÍA',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: 'CUIT',
		dataIndex: 'cuit',
		key: 'cuit',
	},
	{
		title: 'INSCRIPCIÓN',
		dataIndex: 'inscription',
		key: 'inscription',
	},
	{
		title: 'ENTORNO',
		key: 'environment',
		dataIndex: 'environment',
	},
	{
		title: 'CREADA EL:',
		key: 'created_at',
		dataIndex: 'created_at',
	},
	{
		title: 'ACCIÓN',
		key: 'action',
	},
];
</script>
