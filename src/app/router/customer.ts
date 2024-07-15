import type { RouteRecordRaw } from 'vue-router';

const customerRoutes: Array<RouteRecordRaw> = [
    {
        name: 'NewCustomer',
        path: 'clientes/nuevo',
        component: () => import('@/app/pages/customer/NewCustomer.vue'),
    },
    {
        name: 'CustomersList',
        path: 'clientes/listado-de-clientes',
        component: () => import('@/app/pages/customer/CustomersList.vue'),
    },
    {
        name: 'ListCuentasCorrientes',
        path: 'clientes/listado-cuentas-corrientes',
        component: () => import('@/app/pages/customer/CuentasCorrientes.vue'),
    },
];

export default customerRoutes;
