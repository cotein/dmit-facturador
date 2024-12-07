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
import { onBeforeMount } from 'vue';
import { useIvaComposable } from '../composables/afip/useIvaComposable';
import { useVoucherComposable } from '../composables/voucher/useVoucherComposable';
import TotalInvoiced from '../components/charts/dashboard/TotalInvoiced.vue';
import { useBankComposable } from '../composables/bank/useBankComposable';

onBeforeMount(() => {
    useIvaComposable();
    useVoucherComposable();
    useBankComposable();
});
</script>
<style scoped></style>
