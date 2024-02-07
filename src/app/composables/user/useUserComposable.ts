import { useUserStore } from '@/app/store/user/user-store';
import { storeToRefs } from 'pinia';
const { UserGetter, UserTokenGetter, Avatar, IHaveMoreThanOneCompany, AuthUser, IHaveOneCompany, IHaventGotCompanies } =
	storeToRefs(useUserStore());

const { setAvatar, setUserCompanies, setAddNewCompany } = useUserStore();

export const useUserComposable = () => {
	return {
		UserGetter,
		UserTokenGetter,
		setAvatar,
		Avatar,
		setUserCompanies,
		IHaveMoreThanOneCompany,
		AuthUser,
		IHaveOneCompany,
		setAddNewCompany,
		IHaventGotCompanies,
	};
};
