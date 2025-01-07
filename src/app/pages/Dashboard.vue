<template>
    <div>
        <sdPageHeader title="Mí Compañía" class="ninjadash-page-header-main"> </sdPageHeader>

        <Main style="padding-top: 1rem">
            <a-row :gutter="25">
                <a-col :md="12" :sm="24" :xs="24">
                    <TotalInvoiced />
                </a-col>
                <a-col :md="12" :sm="24" :xs="24"> </a-col>
            </a-row>
        </Main>
    </div>
</template>

<script setup lang="ts">
import { Main } from '../styled';
import { onBeforeMount, watch } from 'vue';
import { useIvaComposable } from '../composables/afip/useIvaComposable';
import { useVoucherComposable } from '../composables/voucher/useVoucherComposable';
import TotalInvoiced from '../components/charts/dashboard/TotalInvoiced.vue';
import { useBankComposable } from '../composables/bank/useBankComposable';
import { useCompanyComposable } from '../composables/company/useCompanyComposable';
import { onMounted } from 'vue';
import { useAddNewCompanyPanelComposable } from '../composables/panels/useAddNewCompanyPanelComposable';

const { company } = useCompanyComposable();
const { openAddNewCompanyPanel } = useAddNewCompanyPanelComposable();
onBeforeMount(() => {
    useIvaComposable();
    useVoucherComposable();
    useBankComposable();
});

onMounted(() => {
    console.log('Dashboard mounted');
    console.log('company', company.value);
    if (company.value === null || company.value === undefined) {
        openAddNewCompanyPanel();
    }
});
</script>
<style scoped></style>
