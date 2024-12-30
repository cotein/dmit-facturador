import type { LoggedUser } from '@/app/types/User';
import { ApiHttp } from '../base-api';
import type { AxiosResponse } from 'axios';
import { useSleepComposable } from '@/app/composables/sleep/useSleepComposable';

const { sleep } = useSleepComposable();

export const getMyData = async (): Promise<any> => {
    try {
        await sleep(1500);
        const response = await ApiHttp.get<AxiosResponse<LoggedUser>>('/api/users');

        return response;
    } catch (error) {
        console.log('🚀 ~ file: login-api.ts:13 ~ Login ~ error:', error);
        throw error;
    }
};
