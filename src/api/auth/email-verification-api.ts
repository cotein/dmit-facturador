import { ApiHttp } from '../base-api';

/**
 * Sends a GET request to the specified URL to verify an email.
 *
 * @param url - The URL to which the email verification request is sent.
 * @returns A promise that resolves to the response of the email verification request.
 */
export const apiEmailVerification = async (url: string): Promise<any> => {
    const response = await ApiHttp.get<any>(url);

    return response;
};

/**
 * Sends a POST request to the specified URL to resend the email verification.
 *
 * @param id - The ID of the user to resend the email verification.
 * @returns A promise that resolves to the response of the email verification request.
 */
export const apiEmailResendVerification = async (id: any): Promise<any> => {
    const response = await ApiHttp.post<any>(`/email/resend`, {
        id,
    });

    return response;
};

/**
 * Sends a request to the API to generate a reset code for forgotten password.
 *
 * @param email - The email address of the user who forgot their password.
 * @returns A promise that resolves to the response from the API.
 */
export const apiEmailForgotPasswordResetCode = async (email: string): Promise<any> => {
    const response = await ApiHttp.post<any>(`/forgotPassword/reset/code`, {
        email,
    });

    return response;
};

/**
 * Validates the reset password code using the provided token.
 *
 * @param code - The reset password code to be validated.
 * @returns A promise that resolves to the response of the validation request.
 */
export const apiResetPassword = async (token: string, password: string): Promise<any> => {
    const response = await ApiHttp.post<any>(`/forgotPassword/resetPassword`, {
        token,
        password,
    });

    return response;
};
