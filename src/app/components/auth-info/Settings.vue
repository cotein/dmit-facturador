<script setup lang="ts">
import { ref } from 'vue';
import { SettingDropdown } from './auth-info-style';
const visibleSettings = ref<boolean>(true);
</script>

<template>
    <div class="ninjadash-nav-actions__settings">
        <a-popover placement="bottomRight" action="click">
            <template v-slot:content>
                <SettingDropdown>
                    <div class="setting-dropdown">
                        <a-row :gutter="10">
                            <a-col :sm="12">
                                <router-link :to="{ name: 'delegate-afip-service' }">
                                    <figure class="setting-dropdown__single d-flex">
                                        <img
                                            :src="$environment.VITE_SRC_ASSETS + '/img/icon/013-document-1.png'"
                                            alt=""
                                        />
                                        <figcaption>
                                            <sdHeading as="h5">Factura electrónica</sdHeading>
                                            <p>Delegar servicio</p>
                                        </figcaption>
                                    </figure>
                                </router-link>
                            </a-col>
                            <a-col :sm="12">
                                <figure class="setting-dropdown__single d-flex">
                                    <img :src="$environment.VITE_SRC_ASSETS + '/img/icon/010-home.png'" alt="" />
                                    <figcaption>
                                        <sdHeading as="h5">Compañía</sdHeading>
                                        <p>Cambiar logo</p>
                                    </figcaption>
                                </figure>
                            </a-col>
                        </a-row>
                    </div>
                </SettingDropdown>
            </template>
            <a to="#" class="ninjadash-nav-action-link">
                <img :src="$environment.VITE_SRC_ASSETS + '/img/icon/setting.png'" />
            </a>
        </a-popover>
    </div>
</template>
