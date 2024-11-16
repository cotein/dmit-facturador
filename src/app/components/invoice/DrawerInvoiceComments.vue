<template>
    <div>
        <a-button
            type="primary"
            @click="showDrawer"
            :disabled="!invoiceConfigIsValidated || invoiceTableData.length == 0"
            >Buscar comentarios de facturación</a-button
        >

        <a-drawer
            title="Copiar comentarios"
            :visible="visible"
            @close="closeDrawer"
            width="50%"
            :style="{ height: '100%' }"
            body-style="display: flex; flex-direction: column; height: 100%;"
        >
            <div v-if="isLoading" class="spin-container">
                <a-spin />
            </div>
            <div v-else class="content-container">
                <div id="comments" class="comments-container">
                    <template v-for="(html, index) in commentsList" :key="index">
                        <a-card title="Copiar comentarios" style="width: 100%; margin-bottom: 2rem">
                            <template #extra>
                                <a-button type="primary" @click="copyToClipboard(html)">Copiar comentario</a-button>
                            </template>
                            <div v-html="html"></div>
                        </a-card>
                    </template>
                </div>
                <div id="pagination" class="pagination-container">
                    <a-pagination
                        :total="totalItems"
                        v-model:current="currentPage"
                        v-model:page-size="itemsPerPage"
                        show-size-changer
                        @showSizeChange="onShowSizeChange"
                        @change="changeCurrentPage"
                    >
                        <template #itemRender="{ type, originalElement }">
                            <a v-if="type === 'prev'">Ant.</a>
                            <a v-else-if="type === 'next'">Sig.</a>
                            <component :is="originalElement" v-else></component>
                        </template>
                    </a-pagination>
                </div>
            </div>
        </a-drawer>
    </div>
</template>

<script setup lang="ts">
import { useInvoiceCommentsComposable } from '@/app/composables/invoice/useInvoiceCommentsComposable';
import { ref } from 'vue';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';

const { invoice, invoiceConfigIsValidated, invoiceTableData } = useInvoiceComposable();
const { isLoading, commentsList, currentPage, itemsPerPage, totalItems } = useInvoiceCommentsComposable();

const visible = ref<boolean>(false);

const showDrawer = () => {
    visible.value = true;
};

const closeDrawer = () => {
    visible.value = false;
};

const copyToClipboard = (html: any) => {
    invoice.value.comments = html;
};

const www = async (visible: boolean) => {
    if (visible) {
        console.log('🚀 ~ www ~ visible:', visible);
    }
};
const onShowSizeChange = (current: number, pageSize: number) => {
    itemsPerPage.value = pageSize;
};

const changeCurrentPage = (current: number, pageSize: number) => {
    currentPage.value = current;
    itemsPerPage.value = pageSize;
};
</script>

<style scoped>
.spin-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.content-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: hidden;
}

.comments-container {
    flex-grow: 1;
    overflow-y: auto;
}

.pagination-container {
    flex-shrink: 0;
    padding: 1rem 0;
    background: #fff;
    border-top: 1px solid #f0f0f0;
    text-align: center;
}
</style>
