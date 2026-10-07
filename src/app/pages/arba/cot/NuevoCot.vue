<template>
    <div>
        <sdPageHeader title="ARBA · Nuevo COT" class="ninjadash-page-header-main" />

        <a-card :bordered="false" class="cot-card">
            <template #title>
                <div class="cot-head">
                    <span class="cot-head__title">Código de Operación de Traslado</span>
                    <span class="cot-head__sub">
                        Comprobante de traslado de bienes para ARBA, Buenos Aires. Se emite antes de mover la
                        mercadería y viaja como archivo TXT firmado por el servicio.
                    </span>
                </div>
            </template>

            <a-form :model="formState" layout="vertical" :disabled="soloLectura">
                <!-- 1 · Sujeto generador -->
                <a-divider orientation="left">1 · Sujeto generador</a-divider>
                <a-radio-group v-model:value="formState.sujetoGenerador" button-style="solid">
                    <a-radio-button value="E">Emisor · la mercadería sale de acá</a-radio-button>
                    <a-radio-button value="D">Destinatario · la mercadería llega acá</a-radio-button>
                </a-radio-group>
                <p class="cot-hint">Define quién encabeza la operación ante ARBA.</p>

                <!-- 2 · Remito -->
                <a-divider orientation="left">2 · Remito</a-divider>
                <a-row :gutter="16">
                    <a-col :xs="24" :md="6">
                        <a-form-item label="CUIT del emisor">
                            <a-input :value="cuitEmpresa" disabled />
                        </a-form-item>
                    </a-col>
                    <a-col :xs="24" :md="6">
                        <a-form-item label="Punto de venta" required>
                            <a-input v-model:value="formState.puntoVenta" placeholder="00001" :maxlength="5" />
                        </a-form-item>
                    </a-col>
                    <a-col :xs="24" :md="6">
                        <a-form-item label="Número de remito" required>
                            <a-input v-model:value="formState.numeroRemito" placeholder="00012345" :maxlength="8" />
                        </a-form-item>
                    </a-col>
                    <a-col :xs="24" :md="6">
                        <a-form-item label="Punto de traslado" required>
                            <a-select v-model:value="formState.puntoTrasladoId" placeholder="Elegí el punto">
                                <a-select-option v-for="punto in catalogos.puntosTraslado" :key="punto.id" :value="punto.id">
                                    {{ punto.nombre }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>

                <a-row :gutter="16">
                    <a-col :xs="24" :md="6">
                        <a-form-item label="Fecha de emisión" required>
                            <a-date-picker
                                v-model:value="formState.fechaEmision"
                                value-format="YYYYMMDD"
                                style="width: 100%"
                                placeholder="Elegí la fecha"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :xs="24" :md="6">
                        <a-form-item label="Fecha de salida del transporte" required>
                            <a-date-picker
                                v-model:value="formState.fechaSalidaTransporte"
                                value-format="YYYYMMDD"
                                style="width: 100%"
                                placeholder="Elegí la fecha"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>

                <!-- 3 · Origen y destino -->
                <a-divider orientation="left">3 · Origen y destino</a-divider>
                <a-row :gutter="24">
                    <a-col :xs="24" :lg="12">
                        <h4 class="cot-section">Origen</h4>
                        <a-row :gutter="16">
                            <a-col :xs="24" :md="12">
                                <a-form-item label="Provincia" required>
                                    <a-select v-model:value="formState.origen.provincia" show-search placeholder="Elegí la provincia">
                                        <a-select-option v-for="prov in catalogos.provincias" :key="prov.codigo" :value="prov.codigo">
                                            {{ prov.nombre }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :xs="24" :md="12">
                                <a-form-item label="Localidad" required>
                                    <a-input v-model:value="formState.origen.localidad" placeholder="Ej. Junín" />
                                </a-form-item>
                            </a-col>
                            <a-col :xs="24" :md="16">
                                <a-form-item label="Domicilio" required>
                                    <a-input v-model:value="formState.origen.domicilio" placeholder="Calle, número y piso" />
                                </a-form-item>
                            </a-col>
                            <a-col :xs="24" :md="8">
                                <a-form-item label="Código postal">
                                    <a-input v-model:value="formState.origen.codigoPostal" placeholder="6000" :maxlength="8" />
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-col>

                    <a-col :xs="24" :lg="12">
                        <h4 class="cot-section">Destino</h4>
                        <a-row :gutter="16">
                            <a-col :xs="24" :md="12">
                                <a-form-item label="CUIT del destinatario" required>
                                    <a-input v-model:value="formState.destino.cuit" placeholder="30-00000000-0" />
                                </a-form-item>
                            </a-col>
                            <a-col :xs="24" :md="12">
                                <a-form-item label="Razón social" required>
                                    <a-input v-model:value="formState.destino.razonSocial" placeholder="Nombre o razón social" />
                                </a-form-item>
                            </a-col>
                            <a-col :xs="24" :md="12">
                                <a-form-item label="Provincia" required>
                                    <a-select v-model:value="formState.destino.provincia" show-search placeholder="Elegí la provincia">
                                        <a-select-option v-for="prov in catalogos.provincias" :key="prov.codigo" :value="prov.codigo">
                                            {{ prov.nombre }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :xs="24" :md="12">
                                <a-form-item label="Localidad" required>
                                    <a-input v-model:value="formState.destino.localidad" placeholder="Ej. Pergamino" />
                                </a-form-item>
                            </a-col>
                            <a-col :xs="24" :md="16">
                                <a-form-item label="Domicilio" required>
                                    <a-input v-model:value="formState.destino.domicilio" placeholder="Calle, número y piso" />
                                </a-form-item>
                            </a-col>
                            <a-col :xs="24" :md="8">
                                <a-form-item label="Código postal">
                                    <a-input v-model:value="formState.destino.codigoPostal" placeholder="2700" :maxlength="8" />
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-col>
                </a-row>

                <!-- 4 · Productos -->
                <a-divider orientation="left">4 · Productos transportados</a-divider>
                <p class="cot-hint">
                    El código se elige del nomenclador de ARBA. La unidad de medida sale de la descripción del producto,
                    no se escribe a mano.
                </p>

                <a-table
                    :data-source="formState.productos"
                    :columns="columnas"
                    :pagination="false"
                    row-key="_key"
                    size="middle"
                >
                    <template #bodyCell="{ column, record, index }">
                        <template v-if="column.key === 'codigo'">
                            <a-select
                                v-model:value="record.codigo"
                                show-search
                                placeholder="Buscar producto"
                                :filter-option="filtrarProducto"
                                style="width: 100%"
                                @change="(valor: string) => aplicarProducto(record, valor)"
                            >
                                <a-select-option
                                    v-for="prod in catalogos.nomenclador"
                                    :key="prod.codigo"
                                    :value="prod.codigo"
                                >
                                    {{ prod.codigo }} · {{ prod.descripcion }}
                                </a-select-option>
                            </a-select>
                        </template>
                        <template v-else-if="column.key === 'descripcion'">
                            {{ descripcionDe(record.codigo) }}
                        </template>
                        <template v-else-if="column.key === 'unidad'">
                            <span>{{ unidadDe(record.codigo) || '—' }}</span>
                        </template>
                        <template v-else-if="column.key === 'cantidad'">
                            <a-input v-model:value="record.cantidad" placeholder="0,00" />
                        </template>
                        <template v-else-if="column.key === 'importe'">
                            <a-input v-model:value="record.importe" placeholder="0,00" />
                        </template>
                        <template v-else-if="column.key === 'acciones'">
                            <a-button type="link" danger @click="quitarProducto(index)">Quitar</a-button>
                        </template>
                    </template>
                </a-table>

                <a-button type="dashed" block style="margin-top: 12px" @click="agregarProducto">
                    Agregar producto
                </a-button>

                <a-alert
                    v-if="productosSinUnidad.length"
                    type="warning"
                    show-icon
                    style="margin-top: 16px"
                    :message="`${productosSinUnidad.length} producto(s) sin unidad de medida mapeada. ARBA los va a rechazar.`"
                />

                <!-- 5 · Resumen -->
                <a-divider orientation="left">5 · Resumen</a-divider>
                <a-row :gutter="24">
                    <a-col :xs="12" :md="6">
                        <div class="cot-stat">
                            <span class="cot-stat__label">Productos cargados</span>
                            <span class="cot-stat__value">{{ formState.productos.length }}</span>
                        </div>
                    </a-col>
                    <a-col :xs="12" :md="6">
                        <div class="cot-stat">
                            <span class="cot-stat__label">Importe total</span>
                            <span class="cot-stat__value">{{ importeTotal }}</span>
                        </div>
                    </a-col>
                    <a-col :xs="24" :md="12">
                        <div class="cot-stat">
                            <span class="cot-stat__label">Archivo a generar</span>
                            <span class="cot-stat__value cot-stat__value--file">{{ nombreArchivo }}</span>
                        </div>
                    </a-col>
                </a-row>

                <a-alert
                    v-if="errores.length"
                    type="error"
                    show-icon
                    style="margin-top: 16px"
                    :message="`ARBA rechazó el COT (${errores.length} error/es)`"
                    :description="errores.join(' · ')"
                />

                <div class="cot-actions">
                    <a-button type="primary" :loading="guardando" @click="guardar"> Guardar borrador </a-button>
                    <a-button :loading="emitiendo" @click="emitir"> Emitir a ARBA </a-button>
                    <a-button v-if="cotId" @click="descargar"> Descargar TXT </a-button>
                </div>
            </a-form>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import {
    crearCot,
    descargarCot,
    emitirCot,
    getCotCatalogos,
    type CotCatalogos,
    type CotDomicilio,
    type CotProducto,
    type CotSujetoGenerador,
} from '@/api/arba/cot-api';

type ProductoEnPantalla = CotProducto & { _key: number };

const cuitEmpresa = ref<string>('');
const cotId = ref<number | null>(null);
const guardando = ref(false);
const emitiendo = ref(false);
const errores = ref<string[]>([]);
const estadoCot = ref<string>('borrador');

const catalogos = reactive<CotCatalogos>({
    provincias: [],
    puntosTraslado: [],
    nomenclador: [],
});

const domicilioVacio = (): CotDomicilio => ({
    provincia: '',
    localidad: '',
    domicilio: '',
    codigoPostal: '',
});

const formState = reactive({
    sujetoGenerador: 'E' as CotSujetoGenerador,
    fechaEmision: '',
    fechaSalidaTransporte: '',
    puntoVenta: '',
    numeroRemito: '',
    puntoTrasladoId: undefined as number | undefined,
    origen: domicilioVacio(),
    destino: { ...domicilioVacio(), cuit: '', razonSocial: '' },
    productos: [] as ProductoEnPantalla[],
});

let siguienteClave = 1;

const columnas = [
    { title: 'Código de producto', key: 'codigo', width: 280 },
    { title: 'Descripción', key: 'descripcion' },
    { title: 'Unidad', key: 'unidad', width: 100 },
    { title: 'Cantidad', key: 'cantidad', width: 140 },
    { title: 'Importe', key: 'importe', width: 160 },
    { title: '', key: 'acciones', width: 100 },
];

/** El COT emitido no se edita: se anula y se crea uno nuevo. */
const soloLectura = computed(() => estadoCot.value === 'emitido' || estadoCot.value === 'anulado');

const descripcionDe = (codigo: string): string =>
    catalogos.nomenclador.find((p) => p.codigo === codigo)?.descripcion ?? '';

const unidadDe = (codigo: string): string => catalogos.nomenclador.find((p) => p.codigo === codigo)?.unidadMedida ?? '';

const productosSinUnidad = computed(() =>
    formState.productos.filter((p) => p.codigo && unidadDe(p.codigo) === ''),
);

const filtrarProducto = (input: string, opcion: { value: string; children?: unknown }): boolean => {
    const texto = String(opcion?.children ?? '').toLowerCase();

    return texto.includes(input.toLowerCase());
};

const aNumero = (valor: string | number): number => {
    const limpio = String(valor ?? '')
        .replace(/\./g, '')
        .replace(',', '.');

    return Number(limpio) || 0;
};

const importeTotal = computed(() => {
    const total = formState.productos.reduce((acc, p) => acc + aNumero(p.importe), 0);

    return total.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
});

const nombreArchivo = computed(() => {
    const cuit = cuitEmpresa.value.replace(/\D/g, '') || '00000000000';
    const planta = (formState.puntosTraslado ?? '001').toString().padStart(3, '0');
    const puerta = (formState.puntoVenta || '001').padStart(3, '0');
    const fecha = formState.fechaEmision || 'AAAAMMDD';

    return `TB_${cuit}_${planta.slice(0, 3)}${puerta.slice(0, 3)}_${fecha}_000001.txt`;
});

const agregarProducto = (): void => {
    formState.productos.push({ _key: siguienteClave++, codigo: '', cantidad: '', importe: '' });
};

const quitarProducto = (indice: number): void => {
    formState.productos.splice(indice, 1);
};

const aplicarProducto = (fila: ProductoEnPantalla, codigo: string): void => {
    fila.codigo = codigo;
};

const validar = (): string | null => {
    if (!formState.fechaEmision) return 'Falta la fecha de emisión.';
    if (!formState.fechaSalidaTransporte) return 'Falta la fecha de salida del transporte.';
    if (!formState.puntoVenta) return 'Falta el punto de venta.';
    if (!formState.numeroRemito) return 'Falta el número de remito.';
    if (!formState.origen.provincia || !formState.origen.localidad) return 'Completá el origen.';
    if (!formState.destino.cuit || !formState.destino.provincia || !formState.destino.localidad) {
        return 'Completá el destino.';
    }
    if (!formState.productos.length) return 'Cargá al menos un producto.';
    if (productosSinUnidad.value.length) return 'Hay productos sin unidad de medida mapeada.';

    return null;
};

const armarBorrador = () => ({
    sujetoGenerador: formState.sujetoGenerador,
    fechaEmision: formState.fechaEmision,
    fechaSalidaTransporte: formState.fechaSalidaTransporte,
    puntoVenta: formState.puntoVenta,
    numeroRemito: formState.numeroRemito,
    origen: { ...formState.origen },
    destino: { ...formState.destino },
    productos: formState.productos.map(({ codigo, cantidad, importe }) => ({ codigo, cantidad, importe })),
});

const guardar = async (): Promise<number | null> => {
    const problema = validar();

    if (problema) {
        message.warning(problema);

        return null;
    }

    guardando.value = true;

    try {
        const cot = await crearCot(armarBorrador());
        cotId.value = cot.id;
        estadoCot.value = cot.estado;
        message.success(`Borrador guardado · COT ${cot.id}`);

        return cot.id;
    } catch (error) {
        message.error('No se pudo guardar el borrador del COT');

        return null;
    } finally {
        guardando.value = false;
    }
};

const emitir = async (): Promise<void> => {
    const id = cotId.value ?? (await guardar());

    if (!id) return;

    emitiendo.value = true;
    errores.value = [];

    try {
        const cot = await emitirCot(id);

        estadoCot.value = cot.estado;

        if (cot.estado === 'rechazado') {
            errores.value = cot.errores ?? [];
            message.error('ARBA rechazó el COT');
        } else {
            message.success(`COT encolado para emisión · comprobante ${cot.numeroComprobante ?? 'pendiente'}`);
        }
    } catch (error) {
        message.error('No se pudo emitir el COT');

        return;
    } finally {
        emitiendo.value = false;
    }
};

const descargar = async (): Promise<void> => {
    if (!cotId.value) return;

    try {
        const blob = await descargarCot(cotId.value);
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement('a');

        enlace.href = url;
        enlace.download = nombreArchivo.value;
        enlace.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        message.error('No se pudo descargar el archivo del COT');
    }
};

onMounted(async () => {
    try {
        const data = await getCotCatalogos();

        catalogos.provincias = data.provincias;
        catalogos.puntosTraslado = data.puntosTraslado;
        catalogos.nomenclador = data.nomenclador;
    } catch (error) {
        message.error('No se pudieron cargar los catálogos de ARBA');
    }
});
</script>

<style scoped>
.cot-head {
    display: flex;
    flex-direction: column;
}

.cot-head__title {
    font-size: 16px;
    font-weight: 600;
}

.cot-head__sub {
    font-size: 12px;
    font-weight: 400;
}

.cot-section {
    margin: 0 0 12px 0;
    font-size: 13px;
    font-weight: 600;
}

.cot-hint {
    margin-bottom: 16px;
    font-size: 12px;
}

.cot-stat {
    display: flex;
    flex-direction: column;
}

.cot-stat__label {
    font-size: 12px;
}

.cot-stat__value {
    font-size: 20px;
    font-weight: 600;
}

.cot-stat__value--file {
    font-size: 13px;
    word-break: break-all;
}

.cot-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
}
</style>
