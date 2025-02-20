<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useProductComposable } from '@/app/composables/product/useProductComposable';
import { usePriceListComposable } from '@/app/composables/priceList/usePriceListComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import type { PriceListTranferData, PriceList } from '@/app/types/PriceList';
import { onlyNumeric, selectText } from '@/app/helpers/onlyNumbers';

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
    <div class="www">
        <a-form name="ninjadash_validation-form" ref="step3FormRef" :model="product" :rules="rules" layout="vertical">
            <a-row justify="space-between" align="middle" :gutter="[15, 15]">
                <a-col :xs="24" :sm="12" :md="8" :lg="6">
                    <a-form-item ref="cost" label="Precio de costo del producto" name="cost">
                        <input
                            v-model="product.cost"
                            placeholder="Costo"
                            @keypress="onlyNumeric"
                            inputmode="numeric"
                            @focus="selectText"
                            class="custom-input"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row justify="space-between" align="middle" :gutter="[15, 15]">
                <a-col :xs="24" :sm="24" :md="24" :lg="24">
                    <a-form-item ref="price_list" label="Seleccionar listas de precio" name="price_list">
                        <a-transfer
                            v-model:target-keys="product.price_list"
                            v-model:selected-keys="selectedKeysInPriceListTransfer"
                            :data-source="priceListForTransferComponent"
                            :one-way="false"
                            :list-style="{
                                width: '100%',
                                height: '300px',
                                'text-align': 'left',
                            }"
                            :titles="[' Listas de precio', ' Seleccionado/s']"
                            :render="(item:PriceListTranferData) => `${item.title} - Gcia. ${item.profit_percentage} %`"
                            :disabled="disabled"
                            @change="handleChange"
                            @selectChange="handleSelectChange"
                            @scroll="handleScroll"
                            class="responsive-transfer"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </div>
</template>

<style scoped>
.responsive-transfer .ant-transfer-list {
    width: 100%;
}

@media (max-width: 768px) {
    .responsive-transfer .ant-transfer-list {
        display: block;
        width: 100%;
        margin-bottom: 16px;
    }
}

.custom-input {
    padding: 0 8px;
    vertical-align: middle;
    border-radius: 5px;
    width: 100%;
    min-height: 41px;
    background-color: #ffffff;
    border: 1px solid rgba(157, 155, 153, 0.491);
    transition: all 0.2s ease-in-out 0s;
    font-size: 16px;
    line-height: 18px;
    font-weight: normal;
    text-align: right;
}

.custom-input:focus {
    outline: none;
    border: 1px solid #a2d2df;
    box-shadow: inset 0 0 0 1px #007c89;
}
</style>
