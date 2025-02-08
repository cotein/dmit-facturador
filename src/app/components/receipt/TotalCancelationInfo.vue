<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { OverviewCard } from './../../../app/components/cards/style';
import Vue3Autocounter from 'vue3-autocounter';
import { formatCurrency } from '@/app/helpers/formatCurrency';
const props = defineProps({
    ocData: {
        type: Object,
        default: () => ({
            id: '1',
            type: 'primary',
            icon: 'dollar-alt',
            total: '31',
            suffix: '+',
            prefix: '',
            label: 'Total a cancelar',
            growth: 'downward',
            growthRate: '15.65',
            dataPeriod: 'Desde el último mes',
            decimal: 0,
        }),
    },
    bottomStatus: {
        type: Boolean,
        default: true,
    },
    contentFirst: {
        type: Boolean,
        default: true,
    },
    halfCircleIcon: {
        type: Boolean,
        default: true,
    },
});

const didViewCountUp = ref(false);

onMounted(() => {
    setTimeout(() => {
        didViewCountUp.value = true;
    }, 200);
});
</script>

<template>
    <OverviewCard class="ninjadash-overview-card-box">
        <a-card
            :bordered="false"
            :class="halfCircleIcon ? 'ninjadash-overview-halfCircle-card' : null"
            style="background-color: antiquewhite"
        >
            <div :class="`ninjadash-overview-card ninjadash-overview-card-${ocData.type}`">
                <div
                    :class="
                        contentFirst
                            ? 'ninjadash-overview-card__top d-flex justify-content-between ninjadash-overview-card-theme-2'
                            : 'ninjadash-overview-card__top d-flex justify-content-between'
                    "
                >
                    <div :class="`ninjadash-overview-card__top--icon ninjadash-${ocData.type}`">
                        <unicon :name="ocData.icon"></unicon>
                    </div>
                    <div
                        :class="
                            contentFirst
                                ? 'ninjadash-overview-card__top--content'
                                : 'ninjadash-overview-card__top--content text-right'
                        "
                    >
                        <template v-if="halfCircleIcon">
                            <span className="ninjadahs-overview-label">{{ ocData.label }}</span>
                            <h4 class="ninjadash-overview-total">
                                {{ ocData.total }}
                            </h4>
                        </template>
                    </div>
                </div>
            </div>
        </a-card>
    </OverviewCard>
</template>
