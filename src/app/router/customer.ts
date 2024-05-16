import type { RouteRecordRaw } from 'vue-router';

const customerRoutes: Array<RouteRecordRaw> = [
	{
		name: 'NewCustomer',
		path: 'nuevo',
		component: () => import('@/app/pages/customer/NewCustomer.vue'),
	},
	{
		name: 'ListCuentasCorrientes',
		path: 'listado-cuentas-corrientes',
		component: () => import('@/app/pages/customer/CuentasCorrientes.vue'),
	},
];

export default customerRoutes;
