<template>
    <a-drawer
        v-model:visible="openDrawerEmail"
        class="custom-class"
        style="color: red"
        title="Envíar comprobante por e-mail"
        placement="right"
        :width="drawerWidth()"
    >
        <MailComposer />
    </a-drawer>
</template>
<script setup lang="ts">
import MailComposer from './overview/ComposeEmailSender.vue';
import { useEmailComposable } from '@/app/composables/email/useEmailComposable';
import { useMediaQueryComposable } from '@/app/composables/mediaQuery.ts/useMediaQueryComposable';

const { drawerWidth } = useMediaQueryComposable();
const { openDrawerEmail } = useEmailComposable();
</script>
