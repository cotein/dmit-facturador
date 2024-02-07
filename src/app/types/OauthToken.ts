export type OAuthToken = {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	token_type: string;
};

export type LoginDataOAuthToken = {
	grant_type: string;
	client_id: string;
	client_secret: string;
	username: string;
	password: string;
	scope: string;
};
