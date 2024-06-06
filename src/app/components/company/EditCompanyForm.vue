<script setup lang="ts">
import FormWww from "./FormWww.vue";
import { useCompanyComposable } from "@/app/composables/company/useCompanyComposable";
import { useAddNewCompanyPanelComposable } from "@/app/composables/panels/useAddNewCompanyPanelComposable";
import type { Company } from "@/app/types/Company";

const { closeEditCompanyPanel } = useAddNewCompanyPanelComposable();
const { updateCompanyMutation } = useCompanyComposable();

const handleSubmitCompanyForm = (data: Company) => {
  updateCompanyMutation.mutateAsync(data);
  closeEditCompanyPanel();
};
</script>

<template>
  <FormWww :is-save-button="false" @submitCompanyForm="handleSubmitCompanyForm" />
</template>
