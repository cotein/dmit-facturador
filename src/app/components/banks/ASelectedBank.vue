<template>
    <a-select
        v-model:value="companyForm.cbus[props.index].bank_id"
        placeholder="Banco"
        style="width: 100%"
        :default-active-first-option="false"
        :field-names="{ label: 'name', value: 'id' }"
        :options="banks"
        size="large"
        :allowClear="true"
        :option-label-prop="'name'"
    ></a-select>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useBankComposable } from '@/app/composables/bank/useBankComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';

interface Props {
    index: number;
}

const props = withDefaults(defineProps<Props>(), {
    index: 0,
});

const { banks, selectedBank } = useBankComposable();
const { companyForm } = useCompanyComposable();

const select = async (_: any, option: any) => {
    selectedBank.value = option;
    companyForm.value.cbus[props.index].bank_id = option.id;
};
</script>
