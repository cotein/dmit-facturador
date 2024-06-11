import type { Address } from './Address';
import type { PersonaReturn } from './Afip';

export type Sujeto = {
    name: string | undefined;
    lastName?: string;
    cuit: any;
    cuit_id: number;
    inscription: '' | number;
    number: string;
    address: Address;
    afip_data: PersonaReturn | undefined;
    fantasy_name?: string;
    type_customer?: number | null;
    type_company?: number;
};

export type CompanyRawData = Sujeto & {
    activity_init: any;
    iibb: string;
    afip_environment: 'testing' | 'production';
    perception_iibb: boolean;
    perception_iva: boolean;
    pto_vta_fe: number | null;
    pto_vta_remito: number | null;
    pto_vta_recibo: number | null;
    type_company: number;
    billing_concept: string;
};

export type CustomerRawData = Sujeto;

export type Company = CompanyRawData & {
    id?: number;
    name?: string;
    lastName?: string;
    fantasy_name?: string | boolean;
    inscription?: string;
    inscription_id?: number;
    document?: string;
    cuit?: string;
    afip_environment?: string;
    pto_vta_fe?: string;
    billing_concept?: number;
    user_id: number;
    address?: any;
    vouchers?: any;
};
