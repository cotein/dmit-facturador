import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        name: 'Dashboard',
        path: 'dashboard',
        component: () => import('@/app/pages/Dashboard.vue'),
    },
    {
        name: 'NewInvoice',
        path: 'invoice',
        component: () => import('@/app/pages/invoices/NewInvoice.vue'),
    },
    {
        name: 'ListInvoice',
        path: 'list/invoice',
        component: () => import('@/app/pages/invoices/ListInvoice.vue'),
    },
    {
        name: 'AddCategory',
        path: 'ingresar/categoria',
        component: () => import('@/app/pages/categories/AddNewCategory.vue'),
    },
    {
        name: 'AddProduct',
        path: 'ingresar/producto',
        component: () => import('@/app/pages/products/AddNewProduct.vue'),
    },
    {
        name: 'ProductList',
        path: '/productos',
        component: () => import('@/app/components/product/list/Products.vue'),
        children: [
            {
                name: 'pro-grid',
                path: 'grilla',
                components: {
                    default: () => import('@/app/components/product/list/Products.vue'),
                    grid: () => import('@/app/components/product/list/overview/Grid.vue'),
                },
            },
            {
                name: 'pro-list',
                path: 'listado',
                components: {
                    default: () => import('@/app/components/product/list/Products.vue'),
                    grid: () => import('@/app/components/product/list/overview/List.vue'),
                },
            },
        ],
    },
    {
        name: 'pro-edit',
        path: '/productos/actualizar/:id',
        component: () => import('@/app/pages/products/EditProduct.vue'),
    },
    {
        name: 'NewReceiptPage',
        path: 'cancelar/facturas',
        component: () => import('@/app/pages/receipts/NewReceiptPage.vue'),
    },
    {
        name: 'ReceiptsList',
        path: 'listado/recibos',
        component: () => import('@/app/pages/receipts/ReceiptsList.vue'),
    },
    /* {
        name: 'AddService',
        path: 'ingresar-servicio',
        component: () => import('@/app/pages/services/AddNewService.vue'),
    }, */
    {
        name: 'AddPriceList',
        path: 'ingresar-lista-de-precios',
        component: () => import('@/app/pages/priceList/AddNewPriceListPage.vue'),
    },
];

export default routes;
