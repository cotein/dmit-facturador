import type { CategoryRawData } from './Category';
import type { PriceListFromDataBase } from './PriceList';

export type Product = {
	apply_discount: boolean;
	apply_discount_amount: number;
	apply_discount_percentage: number;
	category: CategoryRawData[] | [];
	cost: number;
	code: string;
	critical_stock: number;
	discount_amount: number;
	discount_percentage: number;
	iva: number;
	meters_by_unity: number;
	name: string;
	pictures: [];
	price_list: PriceListFromDataBase[];
	priority: number;
	published_here: boolean;
	quantity: number;
	sale_by_meter: boolean;
	view_price: boolean;
};

export type ProductOnInvoiceTable = {
	key: string;
	row: string;
	product: {
		id: number;
		name: string;
	};
	unit: number;
	quantity: number;
	iva: {
		id: number;
		name: string;
		percentage: number;
	};
	iva_import: number;
	discount: number;
	subtotal: number;
	total: number;
	actions: {};
	priceList: PriceListFromDataBase;
};

export type ProductTransformer = {
	id: number;
	name: string;
	price_list: PriceListFromDataBase[] | [];
	iva: {
		id: number;
		name: string;
		percentage: number;
	};
};
