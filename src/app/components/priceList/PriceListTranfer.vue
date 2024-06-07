<template>
    <div>
        <a-transfer
            v-model:target-keys="targetKeys"
            v-model:selected-keys="selectedKeys"
            :data-source="dataSource"
            :one-way="true"
            :list-style="{
                width: '300px',
                height: '300px',
                'text-align': 'left',
            }"
            :titles="[' Listas de precio', ' Seleccionado/s']"
            :render="(item:SouceData) => item.title"
            :disabled="disabled"
            @change="handleChange"
            @selectChange="handleSelectChange"
            @scroll="handleScroll"
        />
    </div>
</template>
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';

const { CompanyGetter } = useCompanyComposable();
import { usePriceListComposable } from '@/app/composables/priceList/usePriceListComposable';
const { PriceListGetter } = usePriceListComposable(CompanyGetter.value.id!);

interface SouceData {
    key: string;
    title: string;
    description: string;
    disabled: boolean;
}

const dataSource: SouceData[] = [];

const disabled = ref<boolean>(false);

const targetKeys = ref<string[]>([]);

const selectedKeys = ref<string[]>([]);

const handleChange = (nextTargetKeys: string[], direction: string, moveKeys: string[]) => {
    console.log('targetKeys: ', nextTargetKeys);
    console.log('direction: ', direction);
    console.log('moveKeys: ', moveKeys);
};
const handleSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    console.log('targetSelectedKeys: ', targetSelectedKeys);
};
const handleScroll = (direction: string, e: Event) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
};

onBeforeMount(() => {
    PriceListGetter.value.forEach((el) => {
        console.log('🚀 ~ file: PriceListTranfer.vue:60 ~ PriceListGetter.value.forEach ~ el:', el);
        dataSource.push({
            key: el.value,
            title: el.label,
        });
    });
});
</script>
