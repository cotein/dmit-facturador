import { useMediaQuery } from '@vueuse/core';

export const isMobile = useMediaQuery('(max-width: 481px)');
export const isTablet = useMediaQuery('(min-width: 482px) and (max-width: 768px)');
export const isDesktop = useMediaQuery('(min-width: 769px)');
export const isLargeDesktop = useMediaQuery('(min-width: 1200px)');
