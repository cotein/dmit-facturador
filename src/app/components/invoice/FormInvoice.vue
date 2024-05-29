<script setup lang="ts">
import { BillingConcepts } from '@/app/types/Afip';
import { computed, onUnmounted, watch, onBeforeMount } from 'vue';
import { InvoiceHeader, InvoiceLetterBox } from './Style';
import { Main } from '../../styled';
import { storeToRefs } from 'pinia';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useDrawerPtoVtaStore } from '@/app/store/panels/useDrawerPtoVtaStore';
import { useFilterSearchByCustomerStore } from '@/app/store/filter-search/useFilterSearchByCustomerStore';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { useSaleConditionComposable } from '@/app/composables/sale-condition/useSaleConditionComposable';
import { useVoucherComposable } from '@/app/composables/voucher/useVoucherComposable';
import { usePaymentTypeComposable } from '@/app/composables/payment-type/usePaymentTypeComposable';
import DrawerPtoVta from './DrawerPtoVta.vue';
import AditionalPayment from './AditionalPayment.vue';
import InvoiceConfig from './InvoiceConfig.vue';
import moment from 'moment';
import ProductTable from './ProductTable.vue';

const { CompanyGetter } = useCompanyComposable();
const { customer } = storeToRefs(useFilterSearchByCustomerStore());
const { fetchSaleConditions } = useSaleConditionComposable();
const { Vouchers } = useVoucherComposable();
const { invoice, isSale } = useInvoiceComposable();
const { InvoiceGetter } = useInvoiceComposable();
const { openDrawerPtoVta } = useDrawerPtoVtaStore();
const { fetchPaymentTypes } = usePaymentTypeComposable();

const VoucherDate = computed(() => {
	if (InvoiceGetter.value.CbteFch != '') {
		const date = InvoiceGetter.value.CbteFch;
		const day = String(date).substring(6, 8);
		const month = String(date).substring(4, 6);
		const year = String(date).substring(0, 4);

		return `${day}-${month}-${year}`;
	}

	return '';
});

const VoucherName = computed(() => {
	if (InvoiceGetter.value.voucher) {
		const index = Vouchers.value.findIndex((v) => v.id === InvoiceGetter.value.voucher);

		return Vouchers.value[index].name;
	}

	return '';
});

watch(
	() => CompanyGetter.value,
	(newValue) => {
		if (
			parseInt(newValue?.pto_vta_fe ?? '') === 0 ||
			newValue?.pto_vta_fe === undefined ||
			newValue?.pto_vta_fe === null
		) {
			openDrawerPtoVta();
		}
	},
	{ deep: true, immediate: true },
);

onBeforeMount(() => {
	//fetchVouchers(CompanyGetter.value.id);
	fetchPaymentTypes(CompanyGetter.value.id);
	fetchSaleConditions();
});

onUnmounted(() => {
	invoice.value.customer = null;
	customer.value = { value: null, label: '', cuit: '' };
});
</script>

<template>
	<Main>
		<DrawerPtoVta />
		<a-row :gutter="15">
			<a-col :md="24">
				<sdCards headless>
					<InvoiceHeader>
						<a-row>
							<a-col :sm="12" :xs="24">
								<InvoiceConfig />
							</a-col>
							<a-col :sm="12" :xs="24">
								<div>
									<address class="invoice-info" v-if="CompanyGetter">
										{{ CompanyGetter.name }}
										{{ CompanyGetter.lastName ? CompanyGetter.lastName : '' }}<br />
										<!-- 795 Folsom Ave, Suite 600 <br />
										San Francisco, CA 94107, USA <br />
										Reg. number : 245000003513 -->
									</address>
								</div>
							</a-col>
						</a-row>
					</InvoiceHeader>
					<InvoiceLetterBox>
						<div class="invoice-letter-inner">
							<a-row align="middle">
								<a-col :lg="12" :xs="24">
									<article class="invoice-author">
										<sdHeading class="invoice-customer__title" as="h5">
											{{ InvoiceGetter && InvoiceGetter.voucher ? VoucherName : '' }}</sdHeading
										>
										<p>
											{{
												InvoiceGetter && InvoiceGetter.PtoVta && InvoiceGetter.CbteNro
													? String(InvoiceGetter.PtoVta).padStart(4, '0') + '-'
													: ''
											}}
											{{
												InvoiceGetter && InvoiceGetter.CbteNro
													? String(InvoiceGetter.CbteNro).padStart(8, '0')
													: ''
											}}
										</p>
										<p>
											{{ InvoiceGetter && InvoiceGetter.CbteFch != '' ? VoucherDate : '' }}
										</p>
										<p>
											{{
												InvoiceGetter && InvoiceGetter.CbteNro && InvoiceGetter.Concepto
													? `${String(
															BillingConcepts[Number(InvoiceGetter.Concepto) - 1].key,
													  )}`
													: ''
											}}
											{{
												InvoiceGetter && InvoiceGetter.Concepto != '1'
													? ` - Desde: ${moment(
															InvoiceGetter.FchServDesde,
															'YYYYMMDD',
													  ).format('DD/MM/YYYY')} Hasta: ${moment(
															InvoiceGetter.FchServHasta,
															'YYYYMMDD',
													  ).format('DD/MM/YYYY')}`
													: ''
											}}
										</p>
									</article>
								</a-col>
								<!-- <a-col :lg="8" :xs="24">
									<div class="invoice-barcode">
										<sdCards class="invoice-card" headless>
											<img
												style="width: 100%"
												:src="$environment.VITE_SRC_ASSETS + '/img/barcode.png'"
												alt="barcode"
											/>
											<p>8364297359912267</p>
										</sdCards>
									</div>
								</a-col> -->
								<a-col :lg="12" :xs="24">
									<address class="invoice-customer">
										<sdHeading class="invoice-customer__title" as="h5"> Facturar a: </sdHeading>
										<p v-if="InvoiceGetter && InvoiceGetter.customer">
											{{ InvoiceGetter.customer!.label }} <br />
											<!-- 795 Folsom Ave, Suite 600 <br />
											San Francisco, CA 94107, USA -->
										</p>
									</address>
								</a-col>
							</a-row>
						</div>
					</InvoiceLetterBox>

					<br />
					<AditionalPayment v-if="InvoiceGetter" />
					<br />
					<!-- Facturo por productos -->
					<ProductTable v-if="isSale" />
					<!-- Facturo por nota de crédito / débito -->
				</sdCards>
			</a-col>
		</a-row>
	</Main>
</template>
