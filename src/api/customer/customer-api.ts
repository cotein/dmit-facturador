import type { AxiosResponse } from 'axios';
import { ApiHttp } from '../base-api';
import type { Sujeto } from '@/app/types/Company';

const URL = '/api/customer';

export const saveCustomer = async ( customer: Sujeto ): Promise<AxiosResponse<Sujeto>> => {
	try {
		const response = await ApiHttp.post<Sujeto>( URL, { customer } );

		return response;
	} catch ( error ) {
		throw error
	}
};

export const getCustomers = async ( company_id: number, name: string = '' ) => {
	try {
		const params = new URLSearchParams();

		if ( company_id != null ) {
			params.append( 'company_id', company_id.toString() );
		}

		if ( name != null ) {
			params.append( 'name', name );
		}

		const { data } = await ApiHttp.get<[]>( URL, { params } );

		return data;
	} catch ( error ) {
		throw new Error();
	}
};

export const getCustomerCuentaCorriente = async (
	company_id: number,
	customer_id: number | null = null,
	from: string | null,
	to: string | null,
	page: number | null = 1,
	per_page: number | null = 10,
	print: string = 'no',
) => {
	try {
		const params = new URLSearchParams();

		params.append( 'is_customer_cuenta_corriente', 'yes' );

		if ( company_id != null ) {
			params.append( 'company_id', company_id.toString() );
		}

		if ( customer_id != null ) {
			params.append( 'customer_id', customer_id.toString() );
		}

		if ( from != null ) {
			params.append( 'from', from );
		}

		if ( to != null ) {
			params.append( 'to', to );
		}

		if ( print != null ) {
			params.append( 'print', print.toString() );
		}

		if ( page != null ) {
			params.append( 'page', page.toString() );
		}

		if ( per_page != null ) {
			params.append( 'per_page', per_page.toString() );
		}

		const { data } = await ApiHttp.get<[]>( URL, { params } );

		return data;
	} catch ( error ) {
		throw new Error();
	}
};
