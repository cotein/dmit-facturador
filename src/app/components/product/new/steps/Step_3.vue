<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useProductComposable } from '@/app/composables/product/useProductComposable';
import { usePriceListComposable } from '@/app/composables/priceList/usePriceListComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import type { PriceListTranferData, PriceList } from '@/app/types/PriceList';

const company_id = ref<number>(0);

const { CompanyGetter } = useCompanyComposable();

if (CompanyGetter.value) {
    company_id.value = CompanyGetter.value.id!;
}

const { priceListForTransferComponent, PriceListGetter } = usePriceListComposable(company_id.value);

const { selectedKeysInPriceListTransfer, product, selectedPriceList } = useProductComposable();

const step3FormRef = ref();

const disabled = ref<boolean>(false);

const handleChange = (nextTargetKeys: number[], direction: string, moveKeys: string[]) => {
    selectedPriceList.value = [];

    nextTargetKeys.map((id: number) => {
        PriceListGetter.value.map((pl: PriceList) => {
            if (pl.value === id) {
                selectedPriceList.value.push(`${pl.label} - Gcia. ${pl.profit_percentage} %`);
            }
        });
    });
};

const handleSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    // Si hay elementos seleccionados en el lado izquierdo, deselecciona todos los del lado derecho
    if (sourceSelectedKeys.length > 0) {
        selectedKeysInPriceListTransfer.value = sourceSelectedKeys;
    } else {
        selectedKeysInPriceListTransfer.value = targetSelectedKeys;
    }
};

const handleScroll = (direction: string, e: Event) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
};

const costValidator = (rule: any, value: any) => {
    return new Promise((resolve, reject) => {
        if (!/^\d+(\.\d+)?$/.test(value)) {
            reject('Sólo se permiten números.');
        }

        if (value <= 0) {
            reject('El costo del producto debe ser mayor a cero.');
        }
        resolve(true);
    });
};

const priceListValidator = (rule: any, value: any) => {
    return new Promise((resolve, reject) => {
        if (value <= 0) {
            reject('El producto debe estar relacionado con alguna lista de precios');
        } else {
            resolve(true);
        }
    });
};

const rules = reactive({
    cost: [
        {
            validator: costValidator,
            trigger: 'blur',
        },
    ],
    price_list: [
        {
            validator: priceListValidator,
            trigger: 'blur',
        },
    ],
});

const validateForm = async () => {
    const isValid = await step3FormRef.value.validate().catch((error: any) => {
        return false;
    });

    if (isValid) {
        return true;
    } else {
        return false;
    }
};

defineExpose({ validateForm });
</script>
<template>
    <div class="content--step">
        <a-form name="ninjadash_validation-form" ref="step3FormRef" :model="product" :rules="rules" layout="vertical">
            <a-row justify="space-between" align="middle" :gutter="31">
                <a-col :span="5">
                    <a-form-item ref="cost" label="Precio de costo del producto" name="cost">
                        <a-input v-model:value="product.cost" placeholder="Costo" />
                    </a-form-item>
                </a-col>
                <a-col :span="19">
                    <a-form-item ref="price_list" label="Seleccionar listas de precio" name="price_list">
                        <a-transfer
                            v-model:target-keys="product.price_list"
                            v-model:selected-keys="selectedKeysInPriceListTransfer"
                            :data-source="priceListForTransferComponent"
                            :one-way="false"
                            :list-style="{
                                width: '300px',
                                height: '300px',
                                'text-align': 'left',
                            }"
                            :titles="[' Listas de precio', ' Seleccionado/s']"
                            :render="(item:PriceListTranferData) => `${item.title} - Gcia. ${item.profit_percentage} %`"
                            :disabled="disabled"
                            @change="handleChange"
                            @selectChange="handleSelectChange"
                            @scroll="handleScroll"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </div>
</template>

<style scoped>
.content--step {
    min-height: 25rem;
}
</style>
