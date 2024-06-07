<template>
    <a-tag class="is-active" :color="IsActive ? 'green' : 'red'">
        <template #icon>
            <check-circle-outlined v-if="IsActive" />
            <close-circle-outlined v-if="!IsActive" />
        </template>
        {{ IsActive ? 'Activo' : 'Deshabilitado' }}</a-tag
    >
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons-vue';

type Props = {
    active: boolean;
    showIcon: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    active: false,
    showIcon: true,
});

const IsActive = computed(() => {
    return props.active ? true : false;
});
</script>

<style scoped>
.is-active {
    margin-left: 1rem;
}
</style>
