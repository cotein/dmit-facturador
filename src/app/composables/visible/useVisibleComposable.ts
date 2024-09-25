import { useVisibleStore } from '@/app/store/visible/store-visible';
import { storeToRefs } from 'pinia';

const { visible, VisibleGetter } = storeToRefs(useVisibleStore());
const { setVisible } = useVisibleStore();

export const useVisibleComposable = () => {
    return {
        visible,
        setVisible,
        VisibleGetter,
    };
};
