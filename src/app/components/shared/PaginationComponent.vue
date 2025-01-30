<template>
    <div class="wrap-pagination">
        <a-pagination
            :total="totalItems"
            v-model:current="currentPage"
            v-model:page-size="itemsPerPage"
            :page-size-options="pageSizeOptions"
            show-size-changer
            @showSizeChange="onShowSizeChange"
            @change="changeCurrentPage"
            :show-total="showTotal"
        >
            <template #buildOptionText="props">
                <span>{{ props.value }} {{ itemsPerPageText }}</span>
            </template>
            <template #itemRender="{ type, originalElement }">
                <a v-if="type === 'prev'" @click="prevPage">Ant.</a>
                <a v-else-if="type === 'next'" @click="nextPage">Sig.</a>
                <component :is="originalElement" v-else></component>
            </template>
        </a-pagination>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { usePaginationComposable } from '@/app/composables/pagination/usePaginationComposable';

// Definir las props
type Props = {
    initialCurrentPage: number;
    initialItemsPerPage: number;
    initialTotalItems: number;
    itemsPerPageText: string;
};

const props = withDefaults(defineProps<Props>(), {
    itemsPerPageText: 'Ítems por pág.',
});

// Usar el composable de paginación
const { currentPage, itemsPerPage, totalItems, setCurrentPage, setItemsPerPage, setTotalPages, prevPage, nextPage } =
    usePaginationComposable();

// Inicializar valores de paginación con las props
setCurrentPage(props.initialCurrentPage);
setItemsPerPage(props.initialItemsPerPage);
//setTotalPages(props.initialTotalItems);

const pageSizeOptions = ref<string[]>(['1', '2', '10', '20', '30', '40', '50', '100']);

// Manejar el cambio de página
const changeCurrentPage = (current: number, pageSize: number) => {
    currentPage.value = current;
    //setCurrentPage(current);
    //setItemsPerPage(pageSize);
    itemsPerPage.value = pageSize;
};

const onShowSizeChange = (current: number, pageSize: number) => {
    currentPage.value = current;
    //setCurrentPage(current);
    //setItemsPerPage(pageSize);
    itemsPerPage.value = pageSize;
};

const showTotal = (totalPages: number, range: [number, number]) => {
    totalPages = Number(totalPages);

    // Convertir los elementos de range a números y asegurarse de que siempre hay exactamente dos elementos
    const newRange: [number, number] = [Number(range[0]), Number(range[1])];

    // Comprobar si los datos son números válidos
    if (isNaN(totalPages) || newRange.some(isNaN)) {
        return 'Cargando...';
    }
    return `${newRange[0]}-${newRange[1]} de ${totalPages} 'Ítems'`;
};

// Sincronizar las props con los valores internos
/* watch(
    () => props.initialCurrentPage,
    (newVal) => setCurrentPage(newVal),
);
watch(
    () => props.initialItemsPerPage,
    (newVal) => setItemsPerPage(newVal),
);
watch(
    () => props.initialTotalItems,
    (newVal) => setTotalPages(newVal),
); */
</script>
