<template>
    <div>
        <a-drawer :width="500" title="Basic Drawer" :visible="VisibleGetter" @close="onClose">
            <template #extra>
                <a-button style="margin-right: 8px" @click="onClose">Cancel</a-button>
                <a-button type="primary" @click="onClose">Submit</a-button>
            </template>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <ReceiptInvoice />
        </a-drawer>
    </div>
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue';
import { useVisibleComposable } from '@/app/composables/visible/useVisibleComposable';
import ReceiptInvoice from '@/app/components/customer/receipts/ReceiptInvoice.vue';
const { setVisible, VisibleGetter } = useVisibleComposable();

const onClose = () => {
    setVisible(false);
};

onUnmounted(() => {
    setVisible(false);
});
</script>

<style scoped></style>
