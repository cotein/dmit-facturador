<template>
    <div>
        <CustomerTable :list="customersList" :loading="isLoading" />
    </div>
</template>

<script setup lang="ts">
import CustomerTable from '@/app/components/customer/list/CustomerTable.vue';
import { useCustomerListComposable } from '@/app/composables/customer/useCustomerListComposable';
const { isLoading, customersList } = useCustomerListComposable();
</script>
