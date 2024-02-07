import { useDarkModeStore } from '@/app/store/config/useDarkModeStore';

const { setDarkMode, DarkModeGetter } = useDarkModeStore();

export const useDarkModeComposable = () => {
	return { setDarkMode, DarkModeGetter };
};
