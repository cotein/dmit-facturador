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
	price_base: number;
	quantity: number;
	iva: {
		id: number;
		name: string;
		percentage: number;
		afip_code: number;
	};
	iva_import: number;
	discount: number;
	subtotal: number;
	total: number;
	actions: {};
	priceList: PriceListFromDataBase | undefined;
	aditional: {
		percentage: number;
		value: number;
	};
};

export type ProductTransformer = {
	id: number;
	name: string;
	price_list: PriceListFromDataBase[] | [];
	iva: {
		id: number;
		name: string;
		percentage: number;
		afip_code: number;
	};
	aditional: {
		percentage: number;
		value: number;
	};
};

export type ProductForNotaCredito = {
	id: number;
	key: number;
	name: string;
	quantity: number;
	neto_import: number;
	iva_import: number;
	iva_id: number;
	iva_afip_code: string;
	unit_price: number;
	total: number;
};
