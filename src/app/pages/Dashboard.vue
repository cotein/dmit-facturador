<template>
    <div>
        <div>
            <sdPageHeader title="Dashboard" class="ninjadash-page-header-main" :routes="pageRoutes"></sdPageHeader>
            <Main>
                <div class="dash-wrap">
                    <!-- KPIs: una sola fila en pantallas anchas -->
                    <a-row :gutter="[24, 24]">
                        <a-col class="dash-kpi" :xxl="6" :xl="6" :lg="12" :md="12" :sm="12" :xs="24">
                            <Suspense>
                                <template #default>
                                    <OverviewCard :ocData="OverviewDataLastMonthInvoiced" separator="." decimalSeparator="," />
                                </template>
                                <template #fallback>
                                    <sdCards headless>
                                        <a-skeleton active />
                                    </sdCards>
                                </template>
                            </Suspense>
                        </a-col>
                        <a-col class="dash-kpi" :xxl="6" :xl="6" :lg="12" :md="12" :sm="12" :xs="24">
                            <Suspense>
                                <template #default>
                                    <OverviewCard :ocData="OverviewDataThisMonthInvoiced" separator="." decimalSeparator="," />
                                </template>
                                <template #fallback>
                                    <sdCards headless>
                                        <a-skeleton active />
                                    </sdCards>
                                </template>
                            </Suspense>
                        </a-col>
                        <a-col class="dash-kpi" :xxl="6" :xl="6" :lg="12" :md="12" :sm="12" :xs="24">
                            <Suspense>
                                <template #default>
                                    <OverviewCard :ocData="OverviewDataTotalCustomers" :bottomStatus="false" separator="." decimalSeparator="," />
                                </template>
                                <template #fallback>
                                    <sdCards headless>
                                        <a-skeleton active />
                                    </sdCards>
                                </template>
                            </Suspense>
                        </a-col>
                        <a-col class="dash-kpi" :xxl="6" :xl="6" :lg="12" :md="12" :sm="12" :xs="24">
                            <Suspense>
                                <template #default>
                                    <OverviewCard :ocData="OverviewDataTotalProducts" :bottomStatus="false" separator="." decimalSeparator="," />
                                </template>
                                <template #fallback>
                                    <sdCards headless>
                                        <a-skeleton active />
                                    </sdCards>
                                </template>
                            </Suspense>
                        </a-col>
                    </a-row>

                    <!-- Ventas diarias + Cobros online: llenan el ancho y la mitad inferior -->
                    <a-row :gutter="[24, 24]" class="dash-charts">
                        <a-col :xxl="16" :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
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

                        <a-col :xxl="8" :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                            <MercadoPagoDashboardSummary />
                        </a-col>
                    </a-row>
                </div>
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
import OverviewCard from '@/app/components/cards/OverviewCard.vue';
import MercadoPagoDashboardSummary from '@/app/components/mercadoPago/MercadoPagoDashboardSummary.vue';

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

        const { data: invoiced } = await getLastMonthInvoiced(CompanyGetter.value.id);

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
            growthRate: Math.abs(variationPercentagePreviousToCurrent).toFixed(2),
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
            growthRate: Math.abs(variationPercentageCurrentToPrevious).toFixed(2),
            dataPeriod: 'Respecto al mes anterior',
            decimal: 0,
        };

        salesReportData.value = undefined;

        await sleep(1000);

        const { data: salesReport } = await getDailySalesReport(CompanyGetter.value.id);
        salesReportData.value = salesReport;
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
<style scoped>
/* Superficie del tablero: gris muy suave para que las tarjetas blancas se lean
   como tarjetas (antes eran blanco sobre blanco). Va SÓLO en esta pantalla. */
.dash-wrap {
    padding: 24px;
    border-radius: 18px;
    background: #f7f8fa;
}

.dash-wrap .ant-row {
    row-gap: 24px;
}

/* Entre filas, el mismo ancho de separación que entre tarjetas (24px) */
.dash-wrap > .ant-row + .ant-row {
    margin-top: 24px;
}

/* --- Tarjetas KPI (restyling scoped: no toca la pantalla de recibos) --- */
.dash-kpi :deep(.ninjadash-overview-card-box) {
    height: 100%;
    /* El componente del template trae margin-bottom: 25px; acá el espaciado lo
       maneja el grid, así que se anula para que TODOS los gaps midan lo mismo. */
    margin-bottom: 0 !important;
}

.dash-kpi :deep(.ninjadash-overview-card-box .ant-card) {
    height: 100%;
    border: 1px solid #efedf4;
    border-radius: 16px;
    box-shadow: 0 6px 24px rgba(130, 49, 211, 0.06);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.dash-kpi :deep(.ninjadash-overview-card-box .ant-card:hover) {
    transform: translateY(-3px);
    box-shadow: 0 14px 34px rgba(130, 49, 211, 0.14);
}

.dash-kpi :deep(.ant-card-body) {
    padding: 22px 24px !important;
}

.dash-kpi :deep(.ninjadash-overview-card__top--icon) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(130, 49, 211, 0.1);
    color: #8231d3;
}

.dash-kpi :deep(.ninjadash-overview-total) {
    font-size: 32px;
    font-weight: 700;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
    color: #1b1b27;
}

.dash-kpi :deep(.ninjadahs-overview-label) {
    font-size: 13px;
    color: #6b7280;
}

.dash-kpi :deep(.ninjadash-overview-status) {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
}

.dash-kpi :deep(.ninjadash-status-upward) {
    background: rgba(14, 159, 110, 0.1);
    color: #0e9f6e;
}

.dash-kpi :deep(.ninjadash-status-downward) {
    background: rgba(224, 36, 36, 0.1);
    color: #e02424;
}

.dash-kpi :deep(.ninjadash-status-rate) {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.dash-kpi :deep(.ninjadash-status-label) {
    font-weight: 500;
    color: #8a8f9c;
}

/* --- Tarjetas de gráficos / paneles --- */
.dash-charts :deep(.ant-card) {
    border: 1px solid #efedf4;
    border-radius: 16px;
    box-shadow: 0 6px 24px rgba(130, 49, 211, 0.06);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.dash-charts :deep(.ant-card:hover) {
    transform: translateY(-3px);
    box-shadow: 0 14px 34px rgba(130, 49, 211, 0.14);
}

/* --- Entrada suave (sin dependencias: CSS, respetando reduced-motion) --- */
.dash-wrap > .ant-row {
    animation: dashEnter 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.dash-wrap > .ant-row:nth-child(2) {
    animation-delay: 0.1s;
}

@keyframes dashEnter {
    from {
        opacity: 0;
        transform: translateY(12px);
    }
    to {
        opacity: 1;
        transform: none;
    }
}

@media (prefers-reduced-motion: reduce) {
    .dash-wrap > .ant-row {
        animation: none;
    }

    .dash-kpi :deep(.ant-card),
    .dash-charts :deep(.ant-card) {
        transition: none;
    }
}
</style>
