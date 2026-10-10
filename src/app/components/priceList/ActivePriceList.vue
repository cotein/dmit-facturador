<script setup lang="ts">
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { usePriceListComposable } from '@/app/composables/priceList/usePriceListComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import type { PriceList } from '@/app/types/PriceList';

const props = defineProps<{ priceList: PriceList }>();

const emit = defineEmits<{ (event: 'updated'): void }>();

const { CompanyGetter } = useCompanyComposable();
const { modifyPriceListAsync } = usePriceListComposable(CompanyGetter.value?.id ?? 0);

const updating = ref(false);

const isActive = computed(() => props.priceList.active !== false);

const name = computed(() => props.priceList.label ?? props.priceList.name ?? 'Lista de precios');

/**
 * La API exige los cuatro campos del body en el PUT, aunque sólo cambie el estado.
 */
const toggle = async (checked: boolean) => {
    updating.value = true;

    try {
        await modifyPriceListAsync({
            id: Number(props.priceList.id ?? props.priceList.value),
            name: name.value,
            profit_percentage: Number(props.priceList.profit_percentage) || 0,
            active: checked,
        });

        message.success(checked ? `"${name.value}" quedó activa.` : `"${name.value}" quedó desactivada.`);
        emit('updated');
    } catch (error) {
        message.error(
            `No pudimos cambiar el estado de "${name.value}". ${
                error instanceof Error && error.message ? error.message : 'Intentá de nuevo en unos segundos.'
            }`,
        );
    } finally {
        updating.value = false;
    }
};
</script>

<template>
    <a-switch
        :checked="isActive"
        :loading="updating"
        :disabled="updating"
        checked-children="Activa"
        un-checked-children="Inactiva"
        :aria-label="`Activar o desactivar la lista ${name}`"
        :data-action="`toggle-price-list-${priceList.id ?? priceList.value}`"
        @change="(checked: boolean | string | number) => toggle(Boolean(checked))"
    />
</template>
