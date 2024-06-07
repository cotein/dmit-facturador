import type { Company } from './Company';

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
    email: string;
    isActive: boolean;
    companies: Company[];
    avatar?: string;
}

export interface Cuit {
    cuit: string | number | undefined;
}

export type UserTokenGetterType = {
    access_token?: string;
    expires_in?: number;
    refresh_token?: string;
    token_type?: string;
};
