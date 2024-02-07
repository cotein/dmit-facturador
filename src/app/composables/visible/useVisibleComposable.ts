import { useVisibleStore } from '@/app/store/visible/store-visible';
const { visible, setVisible, VisibleGetter } = useVisibleStore();

export const useVisibleComposable = () => {
	return {
		visible,
		setVisible,
		VisibleGetter,
	};
};
