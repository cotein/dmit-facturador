import { storeToRefs } from 'pinia';
import { useDashBoardStore } from '@/app/store/dash-board/useDashBoardStore';

const {
    totalCustomers,
    OverviewDataTotalCustomers,
    OverviewDataTotalProducts,
    OverviewDataLastMonthInvoiced,
    OverviewDataThisMonthInvoiced,
    salesReportData,
} = storeToRefs(useDashBoardStore());

export const useDashBoardComposable = () => {
    return {
        totalCustomers,
        OverviewDataTotalCustomers,
        OverviewDataTotalProducts,
        OverviewDataLastMonthInvoiced,
        OverviewDataThisMonthInvoiced,
        salesReportData,
    };
};
