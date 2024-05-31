import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
	{
		name: 'Dashboard',
		path: 'dashboard',
		component: () => import( '@/app/pages/Dashboard.vue' ),
	},
	{
		name: 'NewInvoice',
		path: 'invoice',
		component: () => import( '@/app/pages/invoices/NewInvoice.vue' ),
	},
	{
		name: 'ListInvoice',
		path: 'list/invoice',
		component: () => import( '@/app/pages/invoices/ListInvoice.vue' ),
	},
	{
		name: 'AddCategory',
		path: 'ingresar-categoria',
		component: () => import( '@/app/pages/categories/AddNewCategory.vue' ),
	},
	{
		name: 'AddProduct',
		path: 'ingresar-producto',
		component: () => import( '@/app/pages/products/AddNewProduct.vue' ),
	},
	{
		name: 'AddService',
		path: 'ingresar-servicio',
		component: () => import( '@/app/pages/services/AddNewService.vue' ),
	},
	{
		name: 'AddPriceList',
		path: 'ingresar-lista-de-precios',
		component: () => import( '@/app/pages/priceList/AddNewPriceListPage.vue' ),
	},
];

export default routes;
