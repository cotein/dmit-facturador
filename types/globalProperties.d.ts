import 'vue';

interface Filters {
    timeAgo: (value: any) => any;
    argentinianDate: (value: any) => any;
    afipDate: (value: any) => any;
    formatCurrency: (value: any) => any;
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $environment: Record<string, unknown>;
        $filters: Filters;
    }
}
