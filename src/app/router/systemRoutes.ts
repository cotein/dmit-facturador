const routes = [
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
		name: 'NewCustomer',
		path: 'cliente',
		component: () => import('@/app/pages/NewCustomer.vue'),
	},
	{
		name: 'AddCategory',
		path: 'ingresar-categoria',
		component: () => import('@/app/pages/categories/AddNewCategory.vue'),
	},
	{
		name: 'AddProduct',
		path: 'ingresar-producto',
		component: () => import('@/app/pages/products/AddNewProduct.vue'),
	},
	{
		name: 'AddPriceList',
		path: 'ingresar-lista-de-precios',
		component: () => import('@/app/pages/priceList/AddNewPriceListPage.vue'),
	},
];

export default routes;
