import { ApiHttp } from '../base-api';
import type { LoginDataOAuthToken, OAuthToken } from '@/types/OauthToken';

export const Login = async (loginData: LoginDataOAuthToken): Promise<any> => {
	try {
		const response = await ApiHttp.post<OAuthToken>('/oauth/token', loginData);

		return response;
	} catch (error) {
		console.log('🚀 ~ file: login-api.ts:13 ~ Login ~ error:', error);
		throw error;
	}
};
/* $response = $http->post('http://your-app.com/oauth/token', [
    'form_params' => [
        'grant_type' => 'password',
        'client_id' => 'client-id',
        'client_secret' => 'client-secret',S
        'username' => 'taylor@laravel.com',
        'password' => 'my-password',
        'scope' => '',
    ],
]); */
/* {
    grant_type: 'password',
    client_id: '2',
    client_secret: 'RYKSIhpei3pF1dSxXFkhQiyN2iTKxV7pIFWnQPSe',
    username: 'diego@diego.com',
    password: '11111111',
    scope: '',
} */
/* generate token from refresh_token

$http = new GuzzleHttp\Client;

$response = $http->post('http://your-app.com/oauth/token', [
    'form_params' => [
        'grant_type' => 'refresh_token',
        'refresh_token' => 'the-refresh-token',
        'client_id' => 'client-id',
        'client_secret' => 'client-secret',
        'scope' => '',
    ],
]); */
