import type { Company } from '@/app/types/Company';
import type { LoggedUser, UserToken } from '@/app/types/User';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { getItem, removeItem, setItem } from '@/utility/localStorageControl';

// Clave donde se guarda la sesión para que sobreviva a un recargue o a una pestaña nueva.
const SESSION_STORAGE_KEY = 'dmit.session';

type StoredSession = {
    user: LoggedUser | any;
    userToken: UserToken;
    avatar: string;
};

const readStoredSession = (): StoredSession | null => {
    const stored = getItem(SESSION_STORAGE_KEY) as StoredSession | string;

    if (stored && typeof stored === 'object' && (stored as StoredSession).userToken) {
        return stored as StoredSession;
    }

    return null;
};

export const useUserStore = defineStore('user', () => {
    const storedSession = readStoredSession();

    const user = ref<LoggedUser | any>(storedSession?.user ?? {});
    const userToken = ref<UserToken>(storedSession?.userToken);
    const auth = ref<boolean>(Boolean(storedSession?.userToken));
    const addNewCompany = ref<boolean>(false);
    const avatar = ref<string>(storedSession?.avatar ?? '');

    const persistSession = () => {
        if (!userToken.value) {
            removeItem(SESSION_STORAGE_KEY);

            return;
        }

        setItem(SESSION_STORAGE_KEY, {
            user: user.value,
            userToken: userToken.value,
            avatar: avatar.value,
        });
    };

    //Actions
    const setUser = (value: LoggedUser) => {
        user.value = value;
        persistSession();
    };
    const setUserToken = (value: any) => {
        userToken.value = value;
        persistSession();
    };

    const setLogin = () => {
        auth.value = true;
    };

    const clearSession = () => {
        auth.value = false;
        user.value = {};
        userToken.value = undefined;
        avatar.value = '';
        removeItem(SESSION_STORAGE_KEY);
    };

    const logout = () => {
        clearSession();
    };

    const setAvatar = (value: any) => {
        avatar.value = value;
        // El avatar se guarda junto con la sesión para que sobreviva al recargue.
        persistSession();
    };

    const setAddNewCompany = (value: boolean) => {
        addNewCompany.value = value;
    };

    const setUserCompanies = (companies: Company[]) => {
        user.value.companies = companies;
        persistSession();
    };

    const resetEmailToken: string = ref('');
    //Computed

    return {
        //State properties
        //Actions
        setUser,
        setLogin,
        setUserToken,
        logout,
        clearSession,
        setAvatar,
        setUserCompanies,
        setAddNewCompany,
        //Getters
        UserGetter: computed(() => user),
        UserTokenGetter: computed(() => userToken.value),
        AuthUser: computed(() => auth.value),
        Avatar: computed(() => avatar.value),
        IHaveMoreThanOneCompany: computed(() => {
            if (user.value && user.value.companies && user.value.companies.length > 1) return true;

            return false;
        }),
        IHaveOneCompany: computed(() => {
            if (user.value && user.value.companies && user.value.companies.length === 1) return true;

            return false;
        }),
        IHaventGotCompanies: computed(() => {
            if (user.value && user.value.companies && user.value.companies === false) return true;
            return false;
        }),
        resetEmailToken,
    };
});
