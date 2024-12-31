import type { Company } from '@/app/types/Company';
import type { LoggedUser, UserToken } from '@/app/types/User';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useUserStore = defineStore('user', () => {
    const user = ref<LoggedUser | any>({});
    const userToken = ref<UserToken>(undefined);
    const auth = ref<boolean>(false);
    const addNewCompany = ref<boolean>(false);
    const avatar = ref<string>('');

    //Actions
    const setUser = (value: LoggedUser) => {
        user.value = value;
    };
    const setUserToken = (value: any) => {
        userToken.value = value;
    };

    const setLogin = () => {
        auth.value = true;
    };

    const logout = () => {
        auth.value = false;
    };

    const setAvatar = (value: any) => {
        avatar.value = value;
    };

    const setAddNewCompany = (value: boolean) => {
        addNewCompany.value = value;
    };

    const setUserCompanies = (companies: Company[]) => {
        user.value.companies = companies;
    };
    //Computed

    return {
        //State properties
        //Actions
        setUser,
        setLogin,
        setUserToken,
        logout,
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
    };
});
