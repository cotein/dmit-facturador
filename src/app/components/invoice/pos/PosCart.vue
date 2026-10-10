<template>
    <div class="pos-surface" data-testid="pos-cart">
        <div class="pos-cart__head">
            <h2 class="pos-cart__title">Ticket</h2>
            <span class="pos-cart__count" data-testid="pos-cart-count">
                {{ lineCount }} {{ lineCount === 1 ? 'ítem' : 'ítems' }}
            </span>
        </div>

        <div v-if="lineCount === 0" class="pos-cart__empty" data-testid="pos-cart-empty">
            <div class="pos-cart__empty-title">Todavía no agregaste productos</div>
            <p class="pos-cart__empty-text">
                Buscá por nombre o código en el campo de arriba y apretá Enter para sumar el ítem al ticket.
            </p>
        </div>

        <!-- La zona existe sólo con líneas: con el ticket vacío `F8` cae al buscador. -->
        <div v-else class="pos-cart__body" data-zone="ticket">
            <ol class="pos-lines" role="list" aria-label="Ítems del ticket">
                <PosCartLine v-for="(item, index) in invoiceTableData" :key="item.key" :index="index" />
            </ol>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import PosCartLine from './PosCartLine.vue';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';

/** Lista de ítems del ticket, con scroll propio para que el panel nunca se vaya de pantalla. */
const { invoiceTableData } = useInvoiceComposable();

const lineCount = computed(() => invoiceTableData.value.length);
</script>
