/**
 * Lo que se le manda a la API: el credential tal como lo devuelve Google.
 * No se manda el perfil decodificado: la API verifica el token contra Google
 * y saca de ahí el email y el sub (nunca confía en datos del cliente).
 */
export type GoogleCredential = {
    credential: string;
};

export type GoogleUserInfo = {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    email: string;
    email_verified: boolean;
    nbf: number;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    iat: number;
    exp: number;
    jti: string;
};
