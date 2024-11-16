<template>
    <ProductTable>
        <a-row :gutter="15" class="margins">
            <a-col :md="24">
                <quill-editor
                    ref="editor"
                    theme="snow"
                    placeholder="Descripción"
                    style="height: 15rem"
                    v-model:content="invoice.comments"
                    contentType="html"
                ></quill-editor>
            </a-col>
        </a-row>
    </ProductTable>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ProductTable } from './Style';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';

const { invoice } = useInvoiceComposable();

const editor = ref(null);

watch(
    () => invoice.value.comments,
    (newVal) => {
        if (newVal === '') {
            editor.value.setContents('');
        }
    },
);
</script>

<style scoped>
.margins {
    margin: 2rem 0;
}
</style>
