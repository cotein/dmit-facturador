<template>
    <div>
        <sdPageHeader title="Remitos (COT de ARBA)" class="ninjadash-page-header-main"></sdPageHeader>

        <Main>
            <BorderLessHeading>
                <Cards>
                    <template #title> Remitos presentados a ARBA </template>

                    <TopToolBox>
                        <a-row :gutter="15" class="justify-content-center">
                            <a-col :xxl="6" :lg="6" :xs="24">
                                <a-range-picker
                                    v-model:value="rango"
                                    class="w-100"
                                    format="DD/MM/YYYY"
                                    :placeholder="['Desde', 'Hasta']"
                                    @change="onRangoChange"
                                />
                            </a-col>
                            <a-col :xxl="6" :lg="6" :xs="24">
                                <a-input
                                    v-model:value="destinatario"
                                    allow-clear
                                    placeholder="Destinatario"
                                    @press-enter="recargarDesdeCero"
                                />
                            </a-col>
                            <a-col :xxl="5" :lg="5" :xs="24">
                                <a-select
                                    v-model:value="estado"
                                    class="w-100"
                                    :options="estadoOptions"
                                    allow-clear
                                    placeholder="Estado"
                                    @change="recargarDesdeCero"
                                />
                            </a-col>
                            <a-col :xxl="4" :lg="4" :xs="24">
                                <a-button type="primary" @click="recargarDesdeCero">Buscar</a-button>
                                <a-button class="cot-listado__nuevo" @click="irANuevo">Nuevo COT</a-button>
                            </a-col>
                        </a-row>
                    </TopToolBox>

                    <TableDefaultStyle class="ninjadash-having-header-bg">
                        <TopSellerWrap>
                            <div class="table-bordered top-seller-table table-responsive">
                                <a-table
                                    :columns="columnas"
                                    :loading="cargando"
                                    :data-source="cots"
                                    :pagination="false"
                                    :showSorterTooltip="{ title: 'Clic para ordenar' }"
                                >
                                    <template #headerCell="{ title }">
                                        <div style="text-align: center">{{ title }}</div>
                                    </template>

                                    <template #bodyCell="{ column, record, index }">
                                        <template v-if="column.key === 'row'">
                                            <RowNumber :index="index" />
                                        </template>

                                        <template v-if="column.key === 'numeroCot'">
                                            {{ record.numeroCot || '—' }}
                                        </template>

                                        <template v-if="column.key === 'remito'">
                                            {{ record.numeroRemito || '—' }}
                                        </template>

                                        <template v-if="column.key === 'fecha'">
                                            {{ formatearFecha(record.fechaEmision) }}
                                        </template>

                                        <template v-if="column.key === 'destinatario'">
                                            {{ record.destinatarioRazonSocial || '—' }}
                                        </template>

                                        <template v-if="column.key === 'productos'">
                                            {{ record.productos?.length ?? 0 }}
                                        </template>

                                        <template v-if="column.key === 'importe'">
                                            {{ record.importe ? $filters.formatCurrency(Number(record.importe)) : '—' }}
                                        </template>

                                        <template v-if="column.key === 'estado'">
                                            <a-tag :color="colorDeEstado(record.estado)">{{
                                                etiquetaDeEstado(record.estado)
                                            }}</a-tag>
                                        </template>

                                        <template v-if="column.key === 'acciones'">
                                            <a-button type="link" @click="verDetalle(record)">Ver</a-button>
                                            <a-button
                                                v-if="record.estado === 'borrador'"
                                                type="link"
                                                :loading="emitiendo === record.id"
                                                @click="emitir(record)"
                                            >
                                                Emitir
                                            </a-button>
                                            <a-button
                                                v-if="record.archivoNombre"
                                                type="link"
                                                @click="descargar(record)"
                                            >
                                                TXT
                                            </a-button>
                                            <a-button
                                                v-if="record.estado === 'borrador'"
                                                type="link"
                                                danger
                                                @click="abrirAnular(record)"
                                            >
                                                Anular
                                            </a-button>
                                        </template>
                                    </template>
                                </a-table>
                            </div>
                        </TopSellerWrap>
                    </TableDefaultStyle>

                    <div class="wrap-pagination">
                        <a-pagination
                            :total="total"
                            v-model:current="page"
                            v-model:page-size="perPage"
                            :page-size-options="['10', '20', '50', '100']"
                            show-size-changer
                            :show-total="(t: number) => `${t} remitos`"
                            @showSizeChange="recargarDesdeCero"
                            @change="cargar"
                        />
                    </div>
                </Cards>
            </BorderLessHeading>
        </Main>

        <a-drawer
            title="Detalle del remito"
            placement="right"
            :width="560"
            :visible="verDrawer"
            @close="verDrawer = false"
        >
            <template v-if="seleccionado">
                <a-descriptions bordered :column="1" size="small">
                    <a-descriptions-item label="Estado">
                        <a-tag :color="colorDeEstado(seleccionado.estado)">
                            {{ etiquetaDeEstado(seleccionado.estado) }}
                        </a-tag>
                    </a-descriptions-item>
                    <a-descriptions-item label="Número de COT">
                        {{ seleccionado.numeroCot || 'Todavía sin número de ARBA' }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Remito">{{ seleccionado.numeroRemito }}</a-descriptions-item>
                    <a-descriptions-item label="Fecha de emisión">
                        {{ formatearFecha(seleccionado.fechaEmision) }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Salida del transporte">
                        {{ formatearFecha(seleccionado.fechaSalidaTransporte) }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Destinatario">
                        {{ seleccionado.destinatarioRazonSocial }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Importe">
                        {{ seleccionado.importe ? $filters.formatCurrency(Number(seleccionado.importe)) : '—' }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Archivo enviado">
                        {{ seleccionado.archivoNombre || 'Sin archivo' }}
                    </a-descriptions-item>
                </a-descriptions>

                <a-alert
                    v-if="seleccionado.errores && seleccionado.errores.length"
                    class="cot-listado__aviso"
                    type="warning"
                    show-icon
                    :message="seleccionado.errores.join(' ')"
                />

                <h4 class="cot-listado__titulo">Productos</h4>
                <a-table
                    :data-source="seleccionado.productos ?? []"
                    :columns="columnasProductos"
                    :pagination="false"
                    size="small"
                    :row-key="(fila: any, indice: number) => fila.codigo + '-' + indice"
                />
            </template>
        </a-drawer>

        <a-modal
            v-model:visible="anularModal"
            title="Anular el remito"
            ok-text="Anular"
            cancel-text="Cancelar"
            :confirm-loading="anulando"
            @ok="confirmarAnular"
        >
            <p>
                Se anula el COT en borrador y no se presenta a ARBA. Un COT ya presentado no se anula desde acá: se
                corrige con una operación de anulación ante ARBA.
            </p>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { message } from 'ant-design-vue';
import { Main } from '@/app/components/invoice/product/styled';
import { BorderLessHeading, TableDefaultStyle } from '@/app/styled';
import Cards from '@/app/components/cards/frame/CardsFrame.vue';
import { TopSellerWrap } from '@/app/pages/dashBoard/style';
import { TopToolBox } from '@/app/components/invoice/Style';
import RowNumber from '@/app/components/shared/RowNumber.vue';
import { anularCot, descargarCot, emitirCot, listarCots } from '@/api/arba/cot-api';
import type { Cot } from '@/api/arba/cot-api';

const router = useRouter();

const cots = ref<Cot[]>([]);
const cargando = ref(false);
const page = ref(1);
const perPage = ref(20);
const total = ref(0);

const rango = ref<any>(null);
const destinatario = ref('');
const estado = ref<string | null>(null);

const verDrawer = ref(false);
const seleccionado = ref<Cot | null>(null);
const emitiendo = ref<number | null>(null);

const anularModal = ref(false);
const anulando = ref(false);
const aAnular = ref<Cot | null>(null);

const estadoOptions = [
    { label: 'Borrador', value: 'borrador' },
    { label: 'Emitido', value: 'emitido' },
    { label: 'Rechazado', value: 'rechazado' },
    { label: 'Anulado', value: 'anulado' },
];

const columnas = [
    { title: '#', key: 'row', width: 60 },
    { title: 'N° de COT', key: 'numeroCot', width: 160 },
    { title: 'Remito', key: 'remito', width: 130 },
    { title: 'Fecha', key: 'fecha', width: 120 },
    { title: 'Destinatario', key: 'destinatario' },
    { title: 'Productos', key: 'productos', width: 110, align: 'center' as const },
    { title: 'Importe', key: 'importe', width: 140, align: 'right' as const },
    { title: 'Estado', key: 'estado', width: 120 },
    { title: 'Acciones', key: 'acciones', width: 260 },
];

const columnasProductos = [
    { title: 'Código', dataIndex: 'codigo', key: 'codigo', width: 100 },
    { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion', ellipsis: true },
    { title: 'Unidad', dataIndex: 'unidad', key: 'unidad', width: 80 },
    { title: 'Cantidad', dataIndex: 'cantidad', key: 'cantidad', width: 100 },
];

const formatearFecha = (valor: string | null | undefined): string =>
    valor ? dayjs(valor, 'YYYYMMDD').format('DD/MM/YYYY') : '—';

const etiquetaDeEstado = (valor: string): string => {
    const etiquetas: Record<string, string> = {
        borrador: 'Borrador',
        encolado: 'Encolado',
        emitido: 'Emitido',
        rechazado: 'Rechazado',
        anulado: 'Anulado',
    };

    return etiquetas[valor] ?? valor;
};

const colorDeEstado = (valor: string): string => {
    if (valor === 'emitido') {
        return 'green';
    }

    if (valor === 'rechazado') {
        return 'red';
    }

    if (valor === 'anulado') {
        return 'default';
    }

    return 'blue';
};

const cargar = async () => {
    cargando.value = true;

    try {
        const respuesta: any = await listarCots({
            page: page.value,
            per_page: perPage.value,
            ...(rango.value?.[0] ? { desde: rango.value[0].format('YYYY-MM-DD') } : {}),
            ...(rango.value?.[1] ? { hasta: rango.value[1].format('YYYY-MM-DD') } : {}),
            ...(destinatario.value ? { destinatario: destinatario.value } : {}),
            ...(estado.value ? { estado: estado.value } : {}),
        });

        cots.value = respuesta?.data ?? [];
        total.value = respuesta?.meta?.total ?? 0;
    } catch (error) {
        message.error('No se pudo cargar el listado de remitos');
        console.log('🚀 ~ cargar ~ error:', error);
    } finally {
        cargando.value = false;
    }
};

const recargarDesdeCero = () => {
    page.value = 1;
    cargar();
};

const irANuevo = () => {
    router.push({ name: 'NewCot' });
};

const verDetalle = (cot: Cot) => {
    seleccionado.value = cot;
    verDrawer.value = true;
};

const emitir = async (cot: Cot) => {
    emitiendo.value = cot.id;

    try {
        const actualizado: any = await emitirCot(cot.id);
        message.success(
            actualizado?.estado === 'emitido'
                ? 'El COT se presentó a ARBA.'
                : 'El COT se procesó: revisá el detalle y los errores.',
        );
        await cargar();
    } catch (error) {
        message.error('No se pudo emitir el COT');
        console.log('🚀 ~ emitir ~ error:', error);
    } finally {
        emitiendo.value = null;
    }
};

const descargar = async (cot: Cot) => {
    try {
        const blob = await descargarCot(cot.id);
        const url = window.URL.createObjectURL(new Blob([blob], { type: 'text/plain' }));
        const enlace = document.createElement('a');

        enlace.href = url;
        enlace.download = cot.archivoNombre ?? `COT-${cot.id}.txt`;
        enlace.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        message.error('No se pudo descargar el archivo del COT');
        console.log('🚀 ~ descargar ~ error:', error);
    }
};

const abrirAnular = (cot: Cot) => {
    aAnular.value = cot;
    anularModal.value = true;
};

const confirmarAnular = async () => {
    if (!aAnular.value) {
        return;
    }

    anulando.value = true;

    try {
        await anularCot(aAnular.value.id);
        message.success('El COT quedó anulado.');
        anularModal.value = false;
        await cargar();
    } catch (error: any) {
        message.error(error?.message ?? 'No se pudo anular el COT');
        console.log('🚀 ~ confirmarAnular ~ error:', error);
    } finally {
        anulando.value = false;
    }
};

const onRangoChange = () => {
    recargarDesdeCero();
};

onMounted(cargar);
</script>

<style scoped>
.w-100 {
    width: 100%;
}

.cot-listado__nuevo {
    margin-left: 8px;
}

.cot-listado__titulo {
    margin: 20px 0 8px;
    font-size: 14px;
    font-weight: 600;
}

.cot-listado__aviso {
    margin-top: 16px;
}
</style>
