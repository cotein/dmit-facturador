export type User = {
	id: number;
	email: string;
	name: string;
};

export type UsersResponse = {
	data: User[];
};

export type RegisterUser = {
	name: string;
	lastName: string;
	email: string;
	password: string;
	password_confirmation: string;
};
export type RegisterUserResponse = {
	name: string;
	lastName: string;
	email: string;
};

export type LoginData = {
	email: string;
	password: string;
};

export interface LoggedUser {
	id: number;
	name: string;
	last_name: null;
	email: string;
	active: number;
	type_user_id: number;
	company_id: number;
	created_at: string;
	updated_at: string;
	deleted_at: null;
}

export interface Cuit {
	cuit: string | number | undefined;
}

export type UserGetterType = {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	token_type: string;
};
