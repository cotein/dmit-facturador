import type { RouteRecordRaw } from 'vue-router';

/**
 * Rutas del módulo COT de ARBA (Código de Operación de Traslado).
 * Cuelgan de la base /sistema, así que las pantallas quedan en
 * /sistema/arba/cot (listado de remitos) y /sistema/arba/cot/nuevo.
 */
const arbaCotRoutes: Array<RouteRecordRaw> = [
    {
        name: 'CotListado',
        path: 'arba/cot',
        component: () => import('@/app/pages/arba/cot/ListadoCot.vue'),
    },
    {
        name: 'NewCot',
        path: 'arba/cot/nuevo',
        component: () => import('@/app/pages/arba/cot/NuevoCot.vue'),
    },
];

export default arbaCotRoutes;
