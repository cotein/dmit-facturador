import type { Address } from './Address';

export type CompanyRawData = {
	layout: string;
	name: string | undefined;
	lastName?: string;
	cuit: string;
	inscription: '' | number;
	number: string;
	activity_init: string;
	iibb: string;
	afip_environment: string;
	type_company: number | null;
	perception_iibb: boolean;
	perception_iva: boolean;
	pto_vta_fe: number;
	pto_vta_remito: number;
	pto_vta_recibo: number;
	address: Address;
	afip_data: Object;
	fantasy_name: string;
};

export enum TypeCompany {
	JURIDICA = 1,
	FISICA = 2,
}
