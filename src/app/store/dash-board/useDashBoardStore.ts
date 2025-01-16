import type { OverviewCard } from '@/app/types/DashBoard';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { SalesReportType } from '@/app/types/DashBoard';

export const useDashBoardStore = defineStore('dash-board', () => {
    const totalCustomers = ref<number>(0);

    const OverviewDataTotalCustomers = ref<OverviewCard>();
    const OverviewDataTotalProducts = ref<OverviewCard>();
    const OverviewDataLastMonthInvoiced = ref<OverviewCard>();
    const OverviewDataThisMonthInvoiced = ref<OverviewCard>();

    const salesReportData = ref<SalesReportType>();

    return {
        totalCustomers,
        OverviewDataTotalCustomers,
        OverviewDataTotalProducts,
        OverviewDataLastMonthInvoiced,
        salesReportData,
        OverviewDataThisMonthInvoiced,
    };
});
