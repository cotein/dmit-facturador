<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import type { PropType } from 'vue';
import { customTooltips, chartLinearGradient } from '@/app/components/charts/utilities';
import Cards from '@/app/components/cards/frame/CardsFrame.vue';
import { BorderLessHeading } from '../../styled';
import { SalesReportWrapper, ChartContainer } from './style';
import Chart from '@/app/components/charts/Chartjs.vue';
import type { SalesReportType } from '@/app/types/DashBoard';
import { formatCurrency } from '@/app/helpers/formatCurrency';
const salesReport = defineComponent({
    name: 'SalesReport',

    props: {
        salesReportData: {
            type: Object as PropType<SalesReportType>,
            required: true,
        },
    },

    components: {
        Cards,
        BorderLessHeading,
        SalesReportWrapper,
        ChartContainer,
        Chart,
    },
    setup(props) {
        const { salesReportData } = props;
        const height = window.innerWidth <= 575 ? 200 : 100;
        const isLoading = ref(false);

        const tooltip = {
            usePointStyle: true,
            callbacks: {
                label(t: any) {
                    const dstLabel = t.dataset.label;
                    const { formattedValue, raw } = t;
                    let value;

                    // Verifica si el dato es un importe o un número
                    if (dstLabel.toLowerCase().includes('ventas')) {
                        // Formatea como moneda
                        const fvalue = formatCurrency(raw, true);
                        return ` ${fvalue}`;
                    } else {
                        // Formatea como número sin formato
                        value = raw;
                        return ` ${value} ${dstLabel}`;
                    }
                },
                labelColor(t: any) {
                    return {
                        backgroundColor: t.dataset.pointBackgroundColor,
                        borderColor: 'transparent',
                    };
                },
            },
        };

        /* const salesReportData: SalesReportType = {
            title: 'www Report',
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            orders: [10, 55, 42, 30, 42, 80, 35, 10, 53, 62, 45, 78],
            sales: [30, 45, 35, 10, 5, 60, 8, 42, 30, 70, 54, 25],
            total: '8,331',
            growthRate: '25.36',
            growthStatus: 'down',
        }; */

        const salesRevenueDatasets = computed(() => {
            //const facturas = salesReportData.orders.reduce((a, b) => a + b, 0);
            const total = salesReportData.sales.reduce((a, b) => a + b, 0);

            return [
                /*  {
                    data: salesReportData.orders,
                    borderColor: '#8231D3',
                    borderWidth: 3,
                    fill: true,
                    backgroundColor: () =>
                        chartLinearGradient(document.getElementById('ninjadash-sales-revenue'), 300, {
                            start: 'transparent',
                            end: 'transparent',
                        }),
                    label: 'Facturas',
                    pointStyle: 'circle',
                    pointRadius: '0',
                    hoverRadius: '5',
                    pointBorderColor: 'transparent',
                    pointBackgroundColor: '#8231D3',
                    hoverBorderWidth: 5,
                    amount: facturas.toString(),
                    amountClass: 'current-amount',
                    labelType: 'primary',
                    growthStatus: 'up',
                    growthRate: '25',
                    lineTension: 0.5,
                }, */
                {
                    data: salesReportData.sales,
                    borderColor: '#00AAFF',
                    borderWidth: 3,
                    fill: true,
                    backgroundColor: () =>
                        chartLinearGradient(document.getElementById('ninjadash-sales-revenue'), 300, {
                            start: 'transparent',
                            end: 'transparent',
                        }),
                    label: 'Ventas',
                    pointStyle: 'circle',
                    pointRadius: '0',
                    hoverRadius: '5',
                    pointBorderColor: 'transparent',
                    pointBackgroundColor: '#00AAFF',
                    hoverBorderWidth: 5,
                    amount: formatCurrency(total),
                    amountClass: 'current-amount',
                    labelType: 'info',
                    /* growthStatus: 'down',
                    growthRate: '31',
                    lineTension: 0.5, */
                },
            ];
        });

        // Ejes en formato corto: antes el eje Y mostraba "$7.400.000,00" once
        // veces y el X las 31 fechas del mes, que es puro ruido.
        const formatoEjeY = (valor: number) => {
            const abs = Math.abs(Number(valor) || 0);

            if (abs >= 1000000) {
                return `$${(valor / 1000000).toLocaleString('es-AR', { maximumFractionDigits: 1 })}M`;
            }

            if (abs >= 1000) {
                return `$${Math.round(valor / 1000)}K`;
            }

            return `$${Math.round(valor)}`;
        };

        const formatoEjeX = (etiqueta: string) => {
            const partes = String(etiqueta).match(/^(\d{2})-(\d{2})-\d{4}$/);

            return partes ? `${partes[1]}/${partes[2]}` : String(etiqueta);
        };

        const scales = {
            y: {
                grid: {
                    color: '#F0F0F5',
                    drawTicks: false,
                    drawBorder: false,
                    borderWidth: 0,
                },
                ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 6,
                    font: {
                        size: 12,
                        family: "'Jost', sans-serif",
                    },
                    color: '#8A8F9C',
                    padding: 12,
                    callback: function (value: any) {
                        return formatoEjeY(Number(value));
                    },
                },
            },

            x: {
                offset: true,
                grid: {
                    display: false,
                    drawTicks: false,
                    drawBorder: false,
                    color: 'transparent',
                },
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 7,
                    maxRotation: 0,
                    font: {
                        size: 12,
                        family: "'Jost', sans-serif",
                    },
                    color: '#8A8F9C',
                    callback: function (value: any) {
                        const etiqueta =
                            typeof this?.getLabelForValue === 'function' ? this.getLabelForValue(value) : value;

                        return formatoEjeX(etiqueta);
                    },
                },
            },
        };

        return {
            customTooltips,
            salesRevenueDatasets,
            tooltip,
            scales,
            height,
            isLoading,
        };
    },
});
export default salesReport;
</script>

<template>
    <SalesReportWrapper>
        <BorderLessHeading v-if="salesReportData">
            <ChartContainer>
                <Cards more>
                    <template #title>
                        <div class="ninjadash-card-title-wrap">
                            <span class="ninjadash-card-title-text">
                                {{ salesReportData.title }}
                            </span>
                        </div>
                    </template>
                    <template #more>
                        <router-link to="#">
                            <unicon name="print" width="16"></unicon>
                            <span>Printer</span>
                        </router-link>
                        <router-link to="#">
                            <unicon name="book-open" width="16"></unicon>
                            <span>PDF</span>
                        </router-link>
                        <router-link to="#">
                            <unicon name="file-alt" width="16"></unicon>
                            <span>Google Sheets</span>
                        </router-link>
                        <router-link to="#">
                            <unicon name="x" width="16"></unicon>
                            <span>Excel (XLSX)</span>
                        </router-link>
                        <router-link to="#">
                            <unicon name="file" width="16"></unicon>
                            <span>CSV</span>
                        </router-link>
                    </template>
                    <div class="ninjadash-chart-container ninjadash-sales-revenue-lineChart">
                        <div class="label-detailed">
                            <div
                                class="label-detailed__single"
                                v-for="(item, index) in salesRevenueDatasets"
                                :key="index"
                            >
                                <span :class="`label-detailed__type label-detailed__type--${item.labelType}`">{{
                                    item.label
                                }}</span>
                                <strong class="label-detailed__total">{{ item.amount }}</strong>
                                <!-- <span
                                    :class="`label-detailed__status color-${
                                        item.growthStatus === 'up' ? 'success' : 'danger'
                                    }`"
                                >
                                    <unicon name="arrow-up" width="16" v-if="item.growthStatus === 'up'"></unicon>
                                    <unicon name="arrow-down" width="16" v-if="item.growthStatus === 'down'"></unicon>
                                    <strong>{{ item.growthRate }}%</strong>
                                </span> -->
                            </div>
                        </div>
                        <template v-if="!isLoading">
                            <Chart
                                type="line"
                                id="ninjadash-sales-revenue"
                                className="ninjadash-sales-revenue"
                                :labels="salesReportData.labels"
                                :datasets="salesRevenueDatasets"
                                :scales="scales"
                                :tooltip="{
                                    custom: customTooltips,
                                    ...tooltip,
                                }"
                                :height="height"
                            />
                        </template>
                        <div v-else class="ninjadash-sales-revenue-loading">
                            <a-spin />
                        </div>
                    </div>
                </Cards>
            </ChartContainer>
        </BorderLessHeading>
    </SalesReportWrapper>
</template>
<style scoped>
.chartjs-tooltip {
    max-width: none !important;
    white-space: nowrap;
    width: auto;
}
</style>
