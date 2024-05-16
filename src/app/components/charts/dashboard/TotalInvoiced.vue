<template>
	<Cards :more="true">
		<template #title>
			<!-- <div class="ninjadash-card-title-wrap">
				<span class="ninjadash-card-title-text"> www </span>
			</div> -->
		</template>
		<template #button>
			<div class="ninjadash-card-nav">
				<ul>
					<li :class="dates === 'today' ? 'ninjadash-active' : 'ninjadash-today'">
						<router-link @click="(e: any) => handleInvoicesByDates(e, 'today')" to="#"> Hoy </router-link>
					</li>
					<li :class="dates === 'yesterday' ? 'ninjadash-active' : 'ninjadash-week'">
						<router-link @click="(e: any) => handleInvoicesByDates(e, 'yesterday')" to="#">
							Ayer
						</router-link>
					</li>
					<li :class="dates === 'week' ? 'ninjadash-active' : 'ninjadash-week'">
						<router-link @click="(e: any) => handleInvoicesByDates(e, 'week')" to="#">
							Última semana
						</router-link>
					</li>
					<li :class="dates === 'month' ? 'ninjadash-active' : 'ninjadash-month'">
						<router-link @click="(e: any) => handleInvoicesByDates(e, 'month')" to="#">
							Último mes
						</router-link>
					</li>
				</ul>
			</div>
		</template>
		<a-row :gutter="25">
			<div class="wrapper--chart" v-if="!loading">
				<apexchart ref="chart" type="pie" :options="chartOptions" :series="series"></apexchart>
			</div>
			<div v-else class="spinner">
				<a-spin />
			</div>
		</a-row>
	</Cards>
</template>
<script setup lang="ts">
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import Cards from '../../../components/cards/frame/CardsFrame.vue';
import dayjs, { Dayjs } from 'dayjs';
import { getInvoiceList } from '@/api/invoice/invoice-api';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import type { InvoiceList, Item } from '@/app/types/Invoice';
import type { ApexOptions } from 'apexcharts';

const { CompanyGetter } = useCompanyComposable();

const chart = ref<ApexCharts | null>(null);

type Dates = 'today' | 'yesterday' | 'week' | 'month';

const dates = ref<Dates>('today');

const loading = ref<boolean>(true);

const labels = ref<string[]>([]);

const series = ref<number[]>([]);

const handleInvoicesByDates = (e: any, value: Dates) => {
	dates.value = value;
};

watch(
	() => dates.value,
	async (newVal) => {
		const today = dayjs();

		switch (newVal) {
			case 'today':
				// Utiliza el método updateOptions en el componente apexchart referenciado
				//chartOptions.value = { ...chartOptions, subtitle: { text: 'Hoy' } };
				await getData(today.format('YYYY-MM-DD'), today.format('YYYY-MM-DD'));
				chart.value?.updateOptions({
					subtitle: {
						text: `Desde: ${today.format('DD-MM-YYYY')} hasta: ${today.format('DD-MM-YYYY')}`,
					},
				});
				break;
			case 'yesterday':
				await getData(
					today.subtract(1, 'day').format('YYYY-MM-DD'),
					today.subtract(1, 'day').format('YYYY-MM-DD'),
				);
				chart.value?.updateOptions({
					subtitle: {
						text: `Desde: ${today.subtract(1, 'day').format('DD-MM-YYYY')} hasta: ${today
							.subtract(1, 'day')
							.format('DD-MM-YYYY')}`,
					},
				});
				break;
			case 'week':
				await getData(today.subtract(1, 'week').format('YYYY-MM-DD'), today.format('YYYY-MM-DD'));
				chart.value?.updateOptions({
					subtitle: {
						text: `Desde: ${today.subtract(1, 'week').format('DD-MM-YYYY')} hasta: ${today.format(
							'DD-MM-YYYY',
						)}`,
					},
				});
				break;
			case 'month':
				await getData(today.subtract(1, 'month').format('YYYY-MM-DD'), today.format('YYYY-MM-DD'));
				chart.value?.updateOptions({
					subtitle: {
						text: `Desde: ${today.subtract(1, 'month').format('DD-MM-YYYY')} hasta: ${today.format(
							'DD-MM-YYYY',
						)}`,
					},
				});

				break;
		}
	},
);

watch(
	() => series.value,
	(newVal) => {
		console.log('🚀 ~ newVal:', newVal);
		const total = newVal.reduce((acc, value) => acc + value, 0);
		console.log('🚀 ~ total:', total);

		chart.value?.updateOptions({
			title: {
				text: `Total facturado: ${formatCurrency(total)}`,
			},
		});
	},
	{ immediate: true },
);

const processData = (invoiceList: InvoiceList[]): Promise<Record<string, number>> => {
	return new Promise((resolve, reject) => {
		try {
			const grouped = invoiceList.reduce((acc: any, invoice: InvoiceList) => {
				const voucherName = invoice.voucher.name;

				const itemsTotal = invoice.items.reduce((total: number, item: Item) => total + item.total, 0);

				if (!acc[voucherName]) {
					acc[voucherName] = itemsTotal;
				} else {
					acc[voucherName] += itemsTotal;
				}

				return acc;
			}, {});

			resolve(grouped);
		} catch (error) {
			reject(error);
		}
	});
};

const processedData = ref<[]>();

const getData = async (from: string, to: string) => {
	const { data } = await getInvoiceList(CompanyGetter.value!.id, null, null, from, to, null, null, null);

	if (data) {
		processedData.value = await processData(data);
		series.value = Object.values(processedData.value);
		labels.value = Object.keys(processedData.value);
	}
};

onBeforeMount(async () => {
	loading.value = true;

	const today = dayjs();
	chart.value?.updateOptions({
		subtitle: {
			text: `Desde: ${today.format('DD-MM-YYYY')} hasta: ${today.format('DD-MM-YYYY')}`,
		},
	});
	await getData(today.format('YYYY-MM-DD'), today.format('YYYY-MM-DD'));

	loading.value = false;
});

onMounted(() => {
	const div: HTMLCollectionOf<Element> = document.getElementsByClassName('ant-card-extra');
	div[0].children[1].remove();
});

const formatCurrency = (value: number): string => {
	const formattedValue = value
		.toFixed(2)
		.replace(/\./g, ',')
		.replace(/\d(?=(\d{3})+,)/g, '$&.');
	return `$${formattedValue}`;
};

const chartOptions = ref<ApexOptions>({
	labels: labels.value,

	title: {
		text: '',
		align: 'left',
		margin: 1,
		offsetX: 0,
		offsetY: 0,
		floating: false,
		style: {
			fontSize: '12px',
			fontWeight: 'bold',
			fontFamily: 'Helvetica, Arial, sans-serif',
			color: '#263238',
		},
	},
	noData: {
		text: 'No hay datos para mostrar',
		align: 'center',
		verticalAlign: 'middle',
		offsetX: 0,
		offsetY: 0,
		style: {
			color: undefined,
			fontSize: '18px',
			fontFamily: 'Helvetica, Arial, sans-serif',
		},
	},
	subtitle: {
		text: 'Hoy',
		align: 'right',
		margin: 10,
		offsetX: 0,
		offsetY: 0,
		floating: false,
		style: {
			fontSize: '12px',
			fontWeight: 'normal',
			fontFamily: 'Helvetica, Arial, sans-serif',
			color: '#9699a2',
		},
	},

	tooltip: {
		enabled: true,
		enabledOnSeries: undefined,
		shared: true,
		followCursor: false,
		intersect: false,
		inverseOrder: false,
		custom: ({ series, seriesIndex, dataPointIndex, w }) => {
			const name = w.globals.labels[seriesIndex];
			return name;
		},
		fillSeriesColor: false,
		theme: 'false',
		style: {
			fontSize: '12px',
			fontFamily: 'Helvetica, Arial, sans-serif',
		},
		onDatasetHover: {
			highlightDataSeries: false,
		},
		x: {
			show: true,
			format: 'dd MMM',
			formatter: undefined,
		},
		y: {
			formatter: undefined,
			title: {
				formatter: (seriesName) => {
					return seriesName;
				},
			},
		},
		z: {
			formatter: undefined,
			title: 'Size: ',
		},
		marker: {
			show: true,
		},
		items: {
			display: 'flex',
		},
		fixed: {
			enabled: false,
			position: 'topRight',
			offsetX: 0,
			offsetY: 0,
		},
	},
	plotOptions: {
		pie: {
			startAngle: 0,
			endAngle: 360,
			expandOnClick: true,
			offsetX: 0,
			offsetY: 0,
			customScale: 1,
			dataLabels: {
				offset: 0,
				minAngleToShowLabel: 10,
			},

			donut: {
				size: '25%',
				background: 'transparent',
				labels: {
					show: true,
					name: {
						show: false,
						fontSize: '22px',
						fontFamily: 'Helvetica, Arial, sans-serif',
						fontWeight: 600,
						color: undefined,
						offsetY: -10,
						formatter: function (val) {
							console.log('🚀 ~ val:', val);
							return val;
						},
					},
					value: {
						show: true,
						fontSize: '16px',
						fontFamily: 'Helvetica, Arial, sans-serif',
						fontWeight: 400,
						color: undefined,
						offsetY: 16,
						formatter: function (val) {
							console.log('🚀 ~ qqq:', val);
							return formatCurrency(parseFloat(val));
						},
					},
					total: {
						show: false,
						showAlways: false,
						label: 'Total',
						fontSize: '22px',
						fontFamily: 'Helvetica, Arial, sans-serif',
						fontWeight: 600,
						color: '#373d3f',
						formatter: function (w) {
							return w.globals.seriesTotals.reduce((a: number, b: number) => {
								return a + b;
							}, 0);
						},
					},
				},
			},
		},
	},
	legend: {
		show: true,
		showForSingleSeries: false,
		showForNullSeries: true,
		showForZeroSeries: true,
		position: 'bottom',
		horizontalAlign: 'center',
		floating: false,
		fontSize: '10px',
		fontFamily: 'Helvetica, Arial',
		fontWeight: 400,
		formatter: function (val, opts) {
			const index = opts.w.globals.labels[opts.seriesIndex];
			return `${labels.value[index - 1]}`;
		},
		inverseOrder: false,
		width: undefined,
		height: undefined,
		tooltipHoverFormatter: undefined,
		customLegendItems: [],
		offsetX: 0,
		offsetY: 5,
		labels: {
			colors: undefined,
			useSeriesColors: false,
		},
		markers: {
			width: 12,
			height: 12,
			strokeWidth: 0,
			strokeColor: '#fff',
			fillColors: undefined,
			radius: 12,
			customHTML: undefined,
			onClick: undefined,
			offsetX: 0,
			offsetY: 0,
		},
		itemMargin: {
			horizontal: 5,
			vertical: 0,
		},
		onItemClick: {
			toggleDataSeries: true,
		},
		onItemHover: {
			highlightDataSeries: true,
		},
	},
	chart: {
		type: 'donut',
		animations: {
			enabled: true,
			easing: 'easeinout',
			speed: 800,
			animateGradually: {
				enabled: true,
				delay: 150,
			},
			dynamicAnimation: {
				enabled: true,
				speed: 350,
			},
		},
		sparkline: {
			enabled: true,
		},
	},
	dataLabels: {
		enabled: true,
		formatter: function (val, opts) {
			const index = opts.w.globals.labels[opts.seriesIndex];
			opts.w.globals.labels = labels.value;
			return `${parseFloat(val.toString()).toFixed(2)} %`;
		},
	},

	responsive: [
		{
			breakpoint: 480,
			options: {
				chart: {
					width: 200,
				},
				legend: {
					position: 'bottom',
				},
			},
		},
	],
});
</script>
<style scoped>
.wrapper--chart {
	margin: auto;
	height: 75%;
	width: 75%;
}
.spinner {
	margin: 37% auto;
	text-align: center;
}
</style>
