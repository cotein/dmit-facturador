import type { RouteRecordRaw } from 'vue-router';

/**
 * Rutas del módulo COT de ARBA (Código de Operación de Traslado).
 * Cuelgan de la base /sistema, así que la pantalla queda en /sistema/arba/cot/nuevo.
 */
const arbaCotRoutes: Array<RouteRecordRaw> = [
    {
        name: 'NewCot',
        path: 'arba/cot/nuevo',
        component: () => import('@/app/pages/arba/cot/NuevoCot.vue'),
    },
];

export default arbaCotRoutes;
