import type { Sujeto } from './Company';

export type CustomerForm = {
    name: any;
    lastName: any;
    cuit: any;
    cuit_id: number;
    inscription: any;
    number: any;
    address: {
        state_id: any;
        city: any;
        street: any;
        cp: any;
        number: any;
        obs: any;
        between_streets: any;
        addressable_id: any;
        addressable_type: any;
    };
    afip_data: Sujeto | undefined;
    fantasy_name: any;
    type_customer: any;
    company_id: any;
};

export type CustomerSelectComponent = {
    value: number | null;
    label: string;
    cuit: number | null;
};

/* export type Customer = {
	id: number;
	name: string;
	last_name: string;
	afip_number: string;
	inscription: {
		id: number;
		name: string;
	};
	afipDocument: {
		id: number;
		name: string;
		afip_code: string;
	};
}; */

// Generated by https://quicktype.io

export type CustomerOnSaleInvoice = {
    id: number;
    name: string;
    last_name: string;
    fantasy_name: string;
    cuit: string;
    afipInscription: string;
    afipInscription_id: number;
    afipDocument: string;
    afipDocTipo: string;
    address: string;
};

export type CustomerInvoice = {
    value: number;
    label: string;
    cuit: number;
    afip_inscription: AfipInscription;
    afip_document: AfipDocument;
};

export type AfipDocument = {
    id: number;
    name: string;
    afip_code: string;
};

export type AfipInscription = {
    id: number;
    name: string;
};

export type CustomerCuentaCorrienteType = {
    company: string;
    cuotaables: string;
    customer: string;
    id: number;
    number: number;
    pay: string;
    sale: string;
};
