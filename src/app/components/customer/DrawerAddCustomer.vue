<template>
    <a-button
        v-if="showTrigger"
        class="config--button"
        type="primary"
        @click="openDrawerAddCustomer"
        :size="sizeButton()"
        >{{ triggerLabel }}</a-button
    >
    <a-drawer
        :visible="drawerAddCustomerIsVisible"
        @close="closeDrawerAddCustomer"
        :width="drawerWidth()"
        class="drawer-add-customer"
        @after-visible-change="onAfterVisibleChange"
    >
        <template #title>
            <div class="drawer-head">
                <h2 class="drawer-head__title">Nuevo cliente</h2>
                <p class="drawer-head__subtitle">
                    Cargá los datos fiscales y el domicilio. El nombre se completa solo con la búsqueda del CUIT.
                </p>
            </div>
        </template>

        <!--
            El pie vive en el footer del drawer y no adentro del formulario: queda pegado abajo
            y a la vista aunque el cuerpo scrollee (antes los botones viajaban al final del form).
            Los botones llaman a los métodos que el formulario expone, así la validación, el payload
            y el reseteo siguen siendo los mismos.
        -->
        <FormCustomer ref="formCustomerRef" :should-use-address-rule="false" @keydown="onBodyKeydown" />

        <template #footer>
            <div class="drawer-foot">
                <a-button :size="sizeButton()" @click="closeDrawerAddCustomer" class="drawer-foot__cancel">
                    Cancelar
                </a-button>
                <div class="drawer-foot__actions">
                    <a-button :size="sizeButton()" @click="limpiar" :disabled="loading"> Limpiar </a-button>
                    <a-button
                        type="primary"
                        :size="sizeButton()"
                        @click="guardar"
                        :loading="loading"
                        class="drawer-foot__save"
                    >
                        Guardar cliente
                    </a-button>
                </div>
            </div>
        </template>
    </a-drawer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { nextTick, ref, watch } from 'vue';
import FormCustomer from './FormCustomer.vue';
import { useDrawerAddCustomerStore } from '@/app/store/panels/useDrawerAddCustomerStore';
import { usePadronAfipStore } from '@/app/store/afip/usePadronAfipStore';
import { useMediaQueryComposable } from '@/app/composables/mediaQuery.ts/useMediaQueryComposable';

/**
 * El drawer de alta se usa desde dos lugares: solo —con su propio botón— o colgado de
 * otra barra de acciones, que pone su propio disparador. En ese segundo caso el botón
 * de acá se esconde para no tener dos controles que abren lo mismo.
 */
type Props = {
    showTrigger?: boolean;
    triggerLabel?: string;
};

withDefaults(defineProps<Props>(), {
    showTrigger: true,
    triggerLabel: 'Ingresar cliente nuevo',
});

/** Lo que el formulario expone para que el pie del drawer pueda disparar guardar y limpiar. */
type CustomerFormGateway = {
    submit: () => Promise<void>;
    reset: () => void;
};

const formCustomerRef = ref<CustomerFormGateway | null>(null);

const { drawerAddCustomerIsVisible } = storeToRefs(useDrawerAddCustomerStore());
const { openDrawerAddCustomer, closeDrawerAddCustomer } = useDrawerAddCustomerStore();
const { clearSujetoData } = usePadronAfipStore();

/**
 * El pie no adivina si el guardado salió bien: se apoya en el `loading` que el formulario ya
 * usa para el spinner de su botón. Si el guardado no pasó la validación o falló la API, sigue en
 * false y el botón queda disponible.
 */
const loading = ref(false);

const guardar = async () => {
    if (loading.value) {
        return;
    }

    loading.value = true;

    try {
        await formCustomerRef.value?.submit();
    } finally {
        loading.value = false;
    }
};

const limpiar = () => {
    formCustomerRef.value?.reset();
};

/**
 * Enter en un campo de texto guarda, como pedía el flujo. Queda afuera el textarea del domicilio
 * (ahí Enter tiene que hacer salto de línea) y el `select` (ahí Enter elige la opción).
 */
const onBodyKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' || event.shiftKey) {
        return;
    }

    const target = event.target as HTMLElement | null;

    if (!target || target.tagName !== 'INPUT') {
        return;
    }

    event.preventDefault();
    guardar();
};

/**
 * El foco entra al primer campo al abrir, para poder tipear el CUIT sin tocar el mouse.
 *
 * El campo no existe en el primer frame (Ant monta y anima el panel), así que se reintenta con
 * `requestAnimationFrame` hasta encontrarlo, con un tope de tiempo para no quedar en loop.
 */
const FOCUS_RETRY_MAX_MS = 1500;

const focusFirstFieldWhenReady = (startedAt: number) => {
    const field = document.querySelector('.drawer-add-customer .customer-form__field--cuit input');

    if (field instanceof HTMLElement) {
        field.focus();
        return;
    }

    if (performance.now() - startedAt >= FOCUS_RETRY_MAX_MS) {
        return;
    }

    requestAnimationFrame(() => focusFirstFieldWhenReady(startedAt));
};

const onAfterVisibleChange = (visible: boolean) => {
    if (!visible) {
        return;
    }

    nextTick(() => focusFirstFieldWhenReady(performance.now()));
};

// El contenido del drawer queda montado entre aperturas, así que el CUIT cargado para una
// compañía o para otro cliente seguía apareciendo: al abrir, se limpia el padrón.
watch(drawerAddCustomerIsVisible, (abierto) => {
    if (abierto) {
        clearSujetoData();
    }
});

const { sizeButton, drawerWidth } = useMediaQueryComposable();
</script>

<style scoped>
.drawer-head {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-right: 16px;
}

.drawer-head__title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.3;
    color: #404040;
}

.drawer-head__subtitle {
    margin: 0;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.4;
    color: #585858;
}

.drawer-foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.drawer-foot__actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.drawer-foot :deep(.ant-btn) {
    min-height: 32px;
    border-radius: 4px;
}

.drawer-foot :deep(.ant-btn:focus-visible) {
    outline: 2px solid #8231d3;
    outline-offset: 2px;
}

@media (max-width: 481px) {
    .drawer-head__title {
        font-size: 16px;
    }

    /*
        En celular los tres botones van a lo ancho y apilados, con el primario abajo —donde llega
        el pulgar—: Cancelar, Limpiar, Guardar cliente. En escritorio quedan en una sola fila.
    */
    .drawer-foot {
        flex-direction: column;
        align-items: stretch;
    }

    .drawer-foot__actions {
        flex-direction: column;
        align-items: stretch;
    }

    .drawer-foot :deep(.ant-btn) {
        min-height: 40px;
        width: 100%;
    }
}

@media (prefers-reduced-motion: reduce) {
    .drawer-foot :deep(.ant-btn) {
        transition: none;
    }
}
</style>

<style>
/*
    Sin scope: el ancho del panel lo calcula `drawerWidth()` (90% en celular y tablet, 60% en
    escritorio) y Ant lo aplica al wrapper, que vive fuera del árbol del componente. Acá solo
    se ajustan los paddings de las tres zonas y el alto del panel.
*/
.drawer-add-customer .ant-drawer-header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid #f1f2f6;
}

.drawer-add-customer .ant-drawer-body {
    padding: 24px;
    overflow-x: hidden;
}

.drawer-add-customer .ant-drawer-footer {
    padding: 16px 24px;
    border-top: 1px solid #e3e6ef;
    background: #fff;
}

@media (max-width: 481px) {
    .drawer-add-customer .ant-drawer-header,
    .drawer-add-customer .ant-drawer-body,
    .drawer-add-customer .ant-drawer-footer {
        padding-left: 16px;
        padding-right: 16px;
    }

    /*
        `main.css` fuerza 260px a TODOS los drawers por debajo de 400px de ancho, con
        `!important`. En este el formulario es el contenido, y con 260px queda una sola columna
        de 213px: ilegible. Se pisa solo para este drawer, conservando el `!important` (y con
        más especificidad), para que el resto de los drawers siga igual.
    */
    .drawer-add-customer .ant-drawer-content-wrapper {
        width: 100vw !important;
    }
}
</style>
