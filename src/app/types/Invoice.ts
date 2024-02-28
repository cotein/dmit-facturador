import type { CbteAsoc } from './Afip';

export type Address = {
	city: string;
	street: string;
	cp: string;
	state: string;
};

export type Company = {
	id: number;
	name: string;
	last_name?: string; // Optional property
	fantasy_name: string;
	cuit: string;
	afipInscription: string;
	afipDocument: string;
	activity_init: string;
	iibb: string;
	address: Address;
};

export type Customer = {
	id: number;
	name: string;
	last_name?: string; // Optional property
	fantasy_name: string;
	cuit: string;
	afipInscription: string;
	afipInscription_id: number;
	afipDocument: string;
	afipDocTipo: number;
	address: Address;
};

export type Voucher = {
	name: string;
	pto_vta: string;
	cbte_desde: string;
	cbte_fch: string;
	cae: string;
	cae_fch_vto: string;
	sale_conditions: string;
	sale_conditions_id: number;
	voucher_type: number;
	status: number;
	concepto: number;
	cbteAsoc: CbteAsoc;
	total: number;
	typeNotaCredito: number;
	typeNotaDebito: number;
	isNotaCredito: boolean;
	isNotaDebito: boolean;
	parents: [];
};

export type Item = {
	id: number;
	name: string;
	quantity: number;
	neto_import: number;
	iva_import: number;
	unit_price: number;
	total: number;
};

export type InvoiceList = {
	id: number;
	company: Company;
	customer: Customer;
	voucher: Voucher;
	items: Item[];
	comment: string;
};
