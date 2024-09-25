<template>
    <a-select
        v-model:value="companyForm.cbu.bank_id"
        placeholder="Banco"
        style="width: 100%"
        :default-active-first-option="false"
        :field-names="{ label: 'name', value: 'id' }"
        :options="banks"
        size="large"
        :allowClear="true"
    ></a-select>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useBankComposable } from '@/app/composables/bank/useBankComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';

const { banks, selectedBank } = useBankComposable();
const { companyForm } = useCompanyComposable();
const value = ref<any>();

const select = async (_: any, option: any) => {
    selectedBank.value = option;
    companyForm.value.cbu.bank_id = option.id;
};

const www = (w: any, q: any) => {
    console.log('🚀 ~ www ~ q:', q);
    console.log('🚀 ~ www ~ w:', w);
    selectedBank.value = null;
    companyForm.value.cbu.bank_id = undefined;
};
</script>
