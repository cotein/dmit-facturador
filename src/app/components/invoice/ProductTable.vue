<template>
    <div>
        <a-typography-title :level="5" v-if="loading">Generando comprobante de venta...</a-typography-title>
        <a-skeleton active :loading="loading" v-if="loading" />
        <a-skeleton active :loading="loading" v-if="loading" />
        <a-skeleton active :loading="loading" v-if="loading" />
        <a-skeleton active :loading="loading" v-if="loading" />
        <a-skeleton active :loading="loading" v-if="loading" />
        <Cards v-else>
            <template #title>
                <div class="ninjadash-card-title-wrap">
                    <span class="ninjadash-card-title-text"> Detalle </span>
                </div>
            </template>
            <a-row>
                <a-col :span="24" class="smaller-text">
                    <TableWrapper>
                        <ProductTable>
                            <div class="table-invoice table-responsive">
                                <a-table
                                    :dataSource="invoiceTableData"
                                    :columns="columns"
                                    :pagination="false"
                                    :scroll="{ x: '1000px' }"
                                >
                                    <template #headerCell="{ title }">
                                        <div style="text-align: left">{{ title }}</div>
                                    </template>
                                    <template #bodyCell="{ record, index }">
                                        <div class="scale-down">
                                            <a-row align="middle" justify="left" :gutter="31">
                                                <a-col :span="1">{{ index + 1 }}</a-col>
                                                <a-col :span="8" class="col">
                                                    <a-typography-text type="secondary">{{
                                                        columnTitle
                                                    }}</a-typography-text>
                                                    <ProductItem :record="record" :index="index" class="mt5" />
                                                </a-col>
                                                <a-col :span="8">
                                                    <a-typography-text type="secondary"
                                                        >Precio unitario</a-typography-text
                                                    >
                                                    <Unit :record="record" :index="index" class="mt5"
                                                /></a-col>
                                            </a-row>
                                            <a-row justify="left">
                                                <a-col class="width" :span="4">
                                                    <a-typography-text type="secondary">Cantidad</a-typography-text>
                                                    <Quantity :record="record" :index="index" class="mt5"
                                                /></a-col>
                                                <a-col class="width" :span="4">
                                                    <a-typography-text type="secondary">Iva</a-typography-text>
                                                    <Iva :record="record" :index="index" class="mt5"
                                                /></a-col>
                                                <a-col class="width" :span="4"
                                                    ><a-typography-text type="secondary">Descuento</a-typography-text>
                                                    <Discount :record="record" :index="index" class="mt5"
                                                /></a-col>
                                                <a-col class="width" :span="4"
                                                    ><a-typography-text type="secondary">Subtotal</a-typography-text>
                                                    <Subtotal :record="record" :index="index" class="mt5"
                                                /></a-col>
                                                <a-col class="width" :span="4"
                                                    ><a-typography-text type="secondary">Total</a-typography-text>
                                                    <Total :record="record" :index="index" class="mt5"
                                                /></a-col>
                                                <a-col class="width" :span="4"
                                                    ><a-typography-text type="secondary">Eliminar</a-typography-text>
                                                    <Actions :record="record" :index="index" class="mt5"
                                                /></a-col>
                                            </a-row>
                                        </div>
                                    </template>
                                </a-table>
                            </div>
                        </ProductTable>
                    </TableWrapper>
                    <FreeText />
                    <DrawerInvoiceComments />
                    <Totals />
                </a-col>
            </a-row>

            <a-row justify="end">
                <a-col :lg="12" :md="18" :sm="24" :offset="0">
                    <InvoiceAction>
                        <a-button
                            type="primary"
                            shape="round"
                            data-action="checkout"
                            @click="generateInvoice"
                            :loading="loading"
                            :disabled="loading || !invoiceValidation.valid"
                        >
                            <template #icon v-if="invoiceTableData.length">
                                <CloudUploadOutlined />
                            </template>
                            Facturar
                        </a-button>
                    </InvoiceAction>

                    <!-- Lo que falta para poder facturar, dicho en pantalla y no sólo en un mensaje -->
                    <div v-if="!invoiceValidation.valid" class="checkout-blockers" data-testid="checkout-blockers">
                        <strong>Para facturar falta:</strong>
                        <ul>
                            <li v-for="blocker in invoiceValidation.blockers" :key="blocker">{{ blocker }}</li>
                        </ul>
                    </div>

                    <div
                        v-if="checkoutError"
                        class="checkout-blockers checkout-blockers--error"
                        data-testid="checkout-error"
                    >
                        <strong>No se pudo facturar</strong>
                        <p>{{ checkoutError }}</p>
                    </div>
                </a-col>
            </a-row>
        </Cards>
        <Html2CanvasPdf />
        <ModalMiPyme />
    </div>
</template>

<script setup lang="tsx">
import { CloudUploadOutlined } from '@ant-design/icons-vue';
import { InvoiceAction, ProductTable } from './Style';
import { TableWrapper } from '../../styled';
import { ref, onUnmounted, watch } from 'vue';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { useInvoiceCheckoutComposable } from '@/app/composables/invoice/useInvoiceCheckoutComposable';
import Cards from '@/app/components/cards/frame/CardsFrame.vue';
import Html2CanvasPdf from '@/app/pdf/Html2CanvasPdf.vue';
import Actions from './product/Actions.vue';
import Discount from './product/Discount.vue';
import Iva from './product/Iva.vue';
import ProductItem from './product/ProductItem.vue';
import Quantity from './product/Quantity.vue';
import Subtotal from './product/Subtotal.vue';
import Total from './product/Total.vue';
import Totals from './Totals.vue';
import Unit from './product/Unit.vue';
import FreeText from './FreeText.vue';
import ModalMiPyme from './ModalMiPyme.vue';
import DrawerInvoiceComments from './DrawerInvoiceComments.vue';

const { invoiceTableData, invoiceInitialStatus, invoice, invoiceValidation } = useInvoiceComposable();

/**
 * La emisión vive en `useInvoiceCheckoutComposable` porque el modo mostrador tiene
 * su propia disposición y necesita exactamente el mismo camino contra la API.
 */
const { generateInvoice, loading, checkoutError } = useInvoiceCheckoutComposable();

const columns = ref<any>([
    {
        title: 'Ítems a facturar',
        dataIndex: 'index',
        key: 'index',
        width: '100%',
    },
]);

const columnTitle = ref<string>('Producto');

watch(
    () => invoice.value.Concepto, // Observamos la propiedad "concepto"
    (newConcepto) => {
        if (newConcepto === '2' || newConcepto === '3') {
            // Si "concepto" es igual a "2" o "3", cambiamos el título
            columnTitle.value = 'Servicio';
        } else {
            // Si no, restauramos el título original
            columnTitle.value = 'Producto';
        }
    },
    { immediate: true }, // Ejecutar el watch inmediatamente al montar el componente
);

onUnmounted(() => {
    invoiceInitialStatus();
    invoiceTableData.value = [];
});
</script>

<style scoped>
@media (max-width: 600px) {
    .ant-table-cell {
        font-size: 12px;
        padding: 8px;
    }
}
.col {
    text-align: left !important;
    padding: 1rem !important;
}
.width {
    text-align: center;
}
.mt5 {
    margin-top: 5px;
}
.checkout-blockers {
    margin-top: 12px;
    padding: 10px 12px;
    font-size: 14px;
    color: #404040;
    background: #f8f9fb;
    border: 1px solid #e3e6ef;
    border-radius: 4px;
}
.checkout-blockers--error {
    border-color: #ff0f0f;
}
.checkout-blockers ul {
    margin: 4px 0 0;
    padding-left: 18px;
}
</style>
