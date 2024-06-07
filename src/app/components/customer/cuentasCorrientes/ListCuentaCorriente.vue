<template>
    <TopToolBox>
        <div class="list-customer-cuenta-corriente-filters">
            <a-row :gutter="15" class="justify-content-center">
                <a-col :xxl="13" :lg="13" :xs="24">
                    <SearchCustomer :multiple="true" />
                </a-col>

                <a-col :xxl="7" :lg="7" :xs="24">
                    <BetweenDaysRangePicker />
                </a-col>
                <a-col :xxl="2" :lg="2" :xs="24">
                    <div class="table-toolbox-actions text-right">
                        <sdButton size="sm" type="secondary" transparented> Buscar </sdButton>
                        <!-- <sdButton size="sm" type="secondary" transparented @click="print" :loading="printSpinner">
								Exportar
							</sdButton> -->
                    </div>
                </a-col>
                <a-col :xxl="2" :lg="2" :xs="24">
                    <div class="table-toolbox-actions text-right">
                        <sdButton size="sm" type="secondary" transparented> Exportar </sdButton>
                        <!-- <sdButton size="sm" type="secondary" transparented @click="print" :loading="printSpinner">
								Exportar
							</sdButton> -->
                    </div>
                </a-col>
            </a-row>
        </div>
    </TopToolBox>
    <div class="list-customer-cuenta-corriente" v-for="(item, index) in groupedData" :key="index">
        <CustomerCuentaCorriente :customer-cuenta-corriente="item.items" />
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import CustomerCuentaCorriente from './CustomerCuentaCorriente.vue';
import { getCustomerCuentaCorriente } from '@/api/customer/customer-api';
import type { CustomerCuentaCorrienteType } from '@/app/types/Customer';
import SearchCustomer from '../SearchCustomer.vue';
import BetweenDaysRangePicker from '../../shared/BetweenDaysRangePicker.vue';
import { TopToolBox } from '../../invoice/Style';
const ccs = ref<CustomerCuentaCorrienteType[]>([]);
const groupedData = ref();

onBeforeMount(async () => {
    ccs.value = await getCustomerCuentaCorriente(1, null, null, null);

    groupedData.value = Object.values(
        ccs.value.reduce((groups: any, item: CustomerCuentaCorrienteType) => {
            const { customer } = item;
            if (!groups[customer]) {
                groups[customer] = [];
            }
            groups[customer].push(item);
            return groups;
        }, {}),
    ).map((group: any) => ({
        customer: group[0].customer,
        items: group,
    }));
});
</script>

<style scoped>
.list-customer-cuenta-corriente {
    margin: 2rem;
    box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1);
}
.list-customer-cuenta-corriente-filters {
    margin: 0px 2rem;
}
</style>
