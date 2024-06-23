<script setup lang="ts">
import FormCompany from './FormCompany.vue';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useAddNewCompanyPanelComposable } from '@/app/composables/panels/useAddNewCompanyPanelComposable';
import type { Company } from '@/app/types/Company';

const { closeEditCompanyPanel } = useAddNewCompanyPanelComposable();
const { updateCompanyMutation } = useCompanyComposable();

const handleSubmitCompanyForm = (data: Company) => {
    updateCompanyMutation.mutateAsync(data);
    closeEditCompanyPanel();
};
</script>

<template>
    <FormCompany :is-save-button="false" @submitCompanyForm="handleSubmitCompanyForm" />
</template>
