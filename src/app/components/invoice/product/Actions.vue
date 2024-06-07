<template>
    <a-space>
        <!-- <a-tooltip title="Editar">
			<a-button type="default" shape="circle" size="small">
				<template #icon>
					<EditOutlined />
				</template>
			</a-button>
		</a-tooltip> -->
        <a-tooltip title="Eliminar">
            <a-button type="danger" shape="circle" size="small" @click="remove">
                <template #icon>
                    <DeleteOutlined />
                </template>
            </a-button>
        </a-tooltip>
    </a-space>
</template>

<script setup lang="ts">
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
const { invoiceTableData } = useInvoiceComposable();
type Props = {
    index: number;
};

const props = withDefaults(defineProps<Props>(), {
    index: undefined,
});

const remove = () => {
    invoiceTableData.value.splice(props.index, 1);
};
</script>

<style scoped>
.ant-tooltip-inner {
    background-color: red;
}
</style>
