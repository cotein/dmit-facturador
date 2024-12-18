import { ApiHttp } from '../base-api';
import type { LoginDataOAuthToken, OAuthToken } from '@/app/types/OauthToken';

export const Login = async (loginData: LoginDataOAuthToken): Promise<any> => {
    try {
        const response = await ApiHttp.post<OAuthToken>('/oauth/token', loginData);

        return response;
    } catch (error) {
        console.log('🚀 ~ file: login-api.ts:13 ~ Login ~ error:', error);
        throw error;
    }
};
