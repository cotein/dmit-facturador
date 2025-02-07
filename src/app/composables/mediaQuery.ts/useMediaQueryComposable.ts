import { useMediaQuery } from '@vueuse/core';
import { ref, watch } from 'vue';

export const useMediaQueryComposable = () => {
    const isMobile = ref<any>(useMediaQuery('(max-width: 481px)'));
    const isTablet = ref<any>(useMediaQuery('(min-width: 482px) and (max-width: 768px)'));
    const isDesktop = ref<any>(useMediaQuery('(min-width: 769px)'));
    const isLargeDesktop = ref<any>(useMediaQuery('(min-width: 1200px)'));

    const sizeButton = () => {
        if (isMobile.value) {
            return 'small';
        }
        if (isTablet.value) {
            return 'small';
        }
        return 'default';
    };

    const drawerWidth = (): string => {
        const screenWidth = window.innerWidth;

        if (isMobile.value || isTablet.value) {
            console.log('🚀 ~ drawerWidth ~ `${screenWidth * 0.9}px`:', `${screenWidth * 0.9}`);

            return `${screenWidth * 0.9}`;
        }
        console.log('🚀 ~ drawerWidth ~ `${screenWidth * 0.9}px`:', `${screenWidth * 0.9}`);
        return `${screenWidth * 0.6}`;
    };

    /*  watch(isMobile, (newVal) => {
        console.log('isMobile changed:', newVal);
    });

    watch(isTablet, (newVal) => {
        console.log('isTablet changed:', newVal);
    });

    watch(isDesktop, (newVal) => {
        console.log('isDesktop changed:', newVal);
    });

    watch(isLargeDesktop, (newVal) => {
        console.log('isLargeDesktop changed:', newVal);
    }); */

    return { isMobile, isTablet, isDesktop, isLargeDesktop, sizeButton, drawerWidth };
};
