<template>
    <a-drawer
        v-model:visible="openDrawerEmail"
        class="custom-class"
        style="color: red"
        title="Basic Drawer"
        placement="right"
        width="31%"
    >
        <MailComposer />
    </a-drawer>
</template>
<script setup lang="ts">
import MailComposer from "./overview/ComposeEmailSender.vue";
import { useEmailComposable } from "@/app/composables/email/useEmailComposable";
const { openDrawerEmail } = useEmailComposable();
</script>
