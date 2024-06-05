<template>
  <div>
    <!-- <span
			v-if="invoice.customer.afip_inscription.id === AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO"
			class="product-total-price"
			>{{ $filters.formatCurrency(props.record.unit) }}</span
		>-->
    <!-- <span v-if="!edit"  class="product-unit">{{
      $filters.formatCurrency(props.record.unit)
    }}</span> -->
    <a-input
      @input="input"
      :value="inputValue"
      class="custom--input fixed-width"
      @keypress="onlyNumeric"
      @focus="selectText"
      @blur="formatCurrency"
    />
  </div>
</template>

<script setup lang="ts">
import type { ProductOnInvoiceTable } from "@/app/types/Product";
import { useInvoiceComposable } from "@/app/composables/invoice/useInvoiceComposable";
import { onlyNumeric, selectText } from "@/app/helpers/onlyNumbers";
import { computed, ref } from "vue";

const { invoiceTableData } = useInvoiceComposable();

const edit = ref<boolean>(false);
type Props = {
  record: ProductOnInvoiceTable;
  index: number;
};

const inputValue = ref<any>();
const props = withDefaults(defineProps<Props>(), {
  record: undefined,
  index: undefined,
});

const input = (e: Event) => {
  const target = e.target as HTMLInputElement;
  invoiceTableData.value[props.index].unit = parseFloat(target.value);
};

const formatCurrency = (e: Event) => {
  const target = e.target as HTMLInputElement;

  const value = parseFloat(target.value);

  if (!isNaN(value)) {
    target.value = new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);

    inputValue.value = target.value;
  }
};
</script>

<style scoped>
div {
  text-align: right;
  width: 100%;
}
.fixed-width {
  width: 100%; /* replace with your desired width */
  text-align: right;
}
</style>
