<template>
    <div>
        <div>
            <sdPageHeader title="Dashboard" class="ninjadash-page-header-main" :routes="pageRoutes"></sdPageHeader>
            <Main>
                <a-row :gutter="25">
                    <a-col :xxl="12" :lg="12" :md="12" :sm="12" :xs="24">
                        <a-row :gutter="25">
                            <a-col :lg="12" :md="12" :sm="12" :xs="24">
                                <Suspense>
                                    <template #default>
                                        <OverviewCard :ocData="OverviewDataLastMonthInvoiced" />
                                    </template>
                                    <template #fallback>
                                        <sdCards headless>
                                            <a-skeleton active />
                                        </sdCards>
                                    </template>
                                </Suspense>
                            </a-col>
                            <a-col :lg="12" :md="12" :sm="12" :xs="24">
                                <Suspense>
                                    <template #default>
                                        <OverviewCard :ocData="OverviewDataThisMonthInvoiced" />
                                    </template>
                                    <template #fallback>
                                        <sdCards headless>
                                            <a-skeleton active />
                                        </sdCards>
                                    </template>
                                </Suspense>
                            </a-col>
                            <a-col :lg="12" :md="12" :sm="12" :xs="24">
                                <Suspense>
                                    <template #default>
                                        <OverviewCard :ocData="OverviewDataTotalCustomers" :bottomStatus="false" />
                                    </template>
                                    <template #fallback>
                                        <sdCards headless>
                                            <a-skeleton active />
                                        </sdCards>
                                    </template>
                                </Suspense>
                            </a-col>

                            <a-col :lg="12" :md="12" :sm="12" :xs="24">
                                <Suspense>
                                    <template #default>
                                        <OverviewCard :ocData="OverviewDataTotalProducts" :bottomStatus="false" />
                                    </template>
                                    <template #fallback>
                                        <sdCards headless>
                                            <a-skeleton active />
                                        </sdCards>
                                    </template>
                                </Suspense>
                            </a-col>
                        </a-row>
                    </a-col>

                    <a-col :xxl="12" :xl="12" :xs="24">
                        <Suspense>
                            <template #default v-if="salesReportData">
                                <SalesReport :salesReportData="salesReportData" />
                            </template>
                            <template #fallback>
                                <sdCards headless>
                                    <a-skeleton active />
                                </sdCards>
                            </template>
                        </Suspense>
                    </a-col>
                    <!-- <a-col :xxl="8" :xl="12" :xs="24">
                        <Suspense>
                            <template #default>
                                <SalesGrowth />
                            </template>
                            <template #fallback>
                                <sdCards headless>
                                    <a-skeleton active />
                                </sdCards>
                            </template>
                        </Suspense>
                    </a-col> -->
                    <!-- <a-col :xxl="16" :xs="24">
                        <Suspense>
                            <template #default>
                                <SalesByLocation />
                            </template>
                            <template #fallback>
                                <sdCards headless>
                                    <a-skeleton active />
                                </sdCards>
                            </template>
                        </Suspense>
                    </a-col> -->
                    <!-- <a-col :xxl="12" :xs="24">
                        <Suspense>
                            <template #default>
                                <TopSellingProduct />
                            </template>
                            <template #fallback>
                                <sdCards headless>
                                    <a-skeleton active />
                                </sdCards>
                            </template>
                        </Suspense>
                    </a-col> -->
                    <!-- <a-col :xxl="12" :xs="24">
                        <Suspense>
                            <template #default>
                                <BrowsersState />
                            </template>
                            <template #fallback>
                                <sdCards headless>
                                    <a-skeleton active />
                                </sdCards>
                            </template>
                        </Suspense>
                    </a-col> -->
                </a-row>
            </Main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Main } from '../styled';
import { onBeforeMount, defineAsyncComponent, ref, computed } from 'vue';
import { useIvaComposable } from '../composables/afip/useIvaComposable';
import { useVoucherComposable } from '../composables/voucher/useVoucherComposable';
import { useBankComposable } from '../composables/bank/useBankComposable';
import { useCompanyComposable } from '../composables/company/useCompanyComposable';
import { onMounted } from 'vue';
import { useAddNewCompanyPanelComposable } from '../composables/panels/useAddNewCompanyPanelComposable';
import { dashBoardTotalcustomers } from '@/api/customer/customer-api';
import { useDashBoardComposable } from '../composables/dashboard/useDashBoardComposable';
import { getTotalProducts } from '@/api/product/product-api';
import { getLastMonthInvoiced, getDailySalesReport } from '@/api/invoice/invoice-api';
import type { Invoiced, LastMonthInvoiced, SalesReportType } from '../types/DashBoard';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Importa la localización en español
import { useSleepComposable } from '../composables/sleep/useSleepComposable';

const { sleep } = useSleepComposable();
dayjs.locale('es');

const OverviewDataList = defineAsyncComponent(() => import('./dashBoard/OverviewDataList.vue'));
const SalesReport = defineAsyncComponent(() => import('./dashBoard/SalesReport.vue'));
const SalesGrowth = defineAsyncComponent(() => import('./dashBoard/SalesGrowth.vue'));
const SalesByLocation = defineAsyncComponent(() => import('./dashBoard/SalesByLocation.vue'));
const TopSellingProduct = defineAsyncComponent(() => import('./dashBoard/TopSellingProduct.vue'));
const BrowsersState = defineAsyncComponent(() => import('./dashBoard/BrowserState.vue'));

const pageRoutes = [
    {
        path: '/',
        breadcrumbName: 'Dashboard',
    },
    {
        path: 'demo-one',
        breadcrumbName: 'Demo one',
    },
];

const { company, CompanyGetter } = useCompanyComposable();

const { openAddNewCompanyPanel } = useAddNewCompanyPanelComposable();

const {
    totalCustomers,
    OverviewDataTotalCustomers,
    OverviewDataTotalProducts,
    OverviewDataLastMonthInvoiced,
    OverviewDataThisMonthInvoiced,
    salesReportData,
} = useDashBoardComposable();

onBeforeMount(async () => {
    useIvaComposable();
    useVoucherComposable();
    useBankComposable();

    const currentMonth = dayjs().format('MMMM YYYY');

    // Obtener el mes y año anterior
    const previousMonth = dayjs().subtract(1, 'month').format('MMMM YYYY');

    if (CompanyGetter.value) {
        totalCustomers.value = await dashBoardTotalcustomers(CompanyGetter.value.id);

        OverviewDataTotalCustomers.value = {
            id: '1',
            type: 'primary',
            icon: 'users-alt',
            total: totalCustomers.value.toString(),
            suffix: '',
            prefix: '',
            label: 'Clientes registrados',
            growth: 'downward',
            growthRate: '15.31',
            dataPeriod: 'Since Last Month',
            decimal: 0,
        };

        const totalProducts = await getTotalProducts(CompanyGetter.value.id);

        OverviewDataTotalProducts.value = {
            id: '2',
            type: 'primary',
            icon: 'briefcase-alt',
            total: totalProducts!.toString(),
            suffix: '',
            prefix: '',
            label: 'Productos en cartera',
            growth: 'upward',
            growthRate: '15.31',
            dataPeriod: 'Since Last Month',
            decimal: 0,
        };

        const invoiced: Invoiced = await getLastMonthInvoiced(CompanyGetter.value.id);

        let variationPercentageCurrentToPrevious: number = 0;
        let variationPercentagePreviousToCurrent: number = 0;

        if (invoiced.totalIncomeLastMonth !== 0) {
            variationPercentageCurrentToPrevious =
                ((invoiced.totalIncomeThisMonth - invoiced.totalIncomeLastMonth) / invoiced.totalIncomeLastMonth) * 100;
            variationPercentagePreviousToCurrent =
                ((invoiced.totalIncomeLastMonth - invoiced.totalIncomeThisMonth) / invoiced.totalIncomeThisMonth) * 100;
        } else if (invoiced.totalIncomeThisMonth !== 0) {
            variationPercentageCurrentToPrevious = 100; // Asumimos un crecimiento del 100% si no había ingresos el mes pasado
            variationPercentagePreviousToCurrent = -100; // Asumimos una disminución del 100% si no hay ingresos este mes
        }

        let trendCurrentToPrevious: 'downward' | 'upward' | 'stable' = 'stable';
        let trendPreviousToCurrent: 'downward' | 'upward' | 'stable' = 'stable';

        if (variationPercentageCurrentToPrevious > 0) {
            trendCurrentToPrevious = 'upward';
        } else if (variationPercentageCurrentToPrevious < 0) {
            trendCurrentToPrevious = 'downward';
        }

        if (variationPercentagePreviousToCurrent > 0) {
            trendPreviousToCurrent = 'upward';
        } else if (variationPercentagePreviousToCurrent < 0) {
            trendPreviousToCurrent = 'downward';
        }

        OverviewDataLastMonthInvoiced.value = {
            id: '1',
            type: 'secondary',
            icon: 'dollar-alt',
            total: invoiced.totalIncomeLastMonth.toString(),
            suffix: '',
            prefix: '',
            label: `Facturado en ${previousMonth}`,
            growth: trendPreviousToCurrent,
            growthRate: variationPercentagePreviousToCurrent.toFixed(2),
            dataPeriod: 'Respecto al mes actual',
            decimal: 0,
        };

        OverviewDataThisMonthInvoiced.value = {
            id: '2',
            type: 'primary',
            icon: 'dollar-alt',
            total: invoiced.totalIncomeThisMonth.toString(),
            suffix: '',
            prefix: '',
            label: `Facturado en ${currentMonth}`,
            growth: trendCurrentToPrevious,
            growthRate: variationPercentageCurrentToPrevious.toFixed(2),
            dataPeriod: 'Respecto al mes anterior',
            decimal: 0,
        };

        salesReportData.value = undefined;

        await sleep(1000);

        salesReportData.value = await getDailySalesReport(CompanyGetter.value.id);
    }
});

const SalesReportData = computed(() => {
    return salesReportData.value;
});

onMounted(() => {
    if (company.value === null || company.value === undefined) {
        openAddNewCompanyPanel();
    }
});
</script>
<style scoped></style>
