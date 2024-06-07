<template>
    <div class="pp">
        <sdPageHeader title="Listado de cuenta corriente de clientes" class="ninjadash-page-header-main">
        </sdPageHeader>
        <Main>
            <ListCuentaCorriente />
        </Main>
    </div>
</template>

<script setup lang="ts">
import ListCuentaCorriente from '@/app/components/customer/cuentasCorrientes/ListCuentaCorriente.vue';
</script>
<style scoped>
.pp {
    padding-bottom: 2rem;
}
</style>
