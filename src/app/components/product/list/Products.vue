<script setup lang="ts">
import { onMounted, ref, defineAsyncComponent, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Main } from '../../../styled';
import { TopToolBox } from '../Style';
import { useProductComposable } from '@/app/composables/product/useProductComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';

const Filters = defineAsyncComponent(() => import('./overview/Filters.vue'));
const pageRoutes = [
    {
        path: '/',
        breadcrumbName: 'Dashboard',
    },
    {
        path: 'demo-one',
        breadcrumbName: 'Products',
    },
];

const { CompanyGetter } = useCompanyComposable();

const { useFetchProducts } = useProductComposable();
//const searchData = computed(() => state.headerSearchData.data);
const { matched } = useRoute();

const { path } = matched[1];

const router = useRouter();

const active = ref('active');

const onSorting = (e: any) => {
    //dispatch('sorting', e.target.value);
};
const sortDefault = ref('rate');
const innerWidth = ref(window.innerWidth);

onBeforeMount(async () => {
    if (CompanyGetter.value && CompanyGetter.value.id) {
        useFetchProducts(CompanyGetter.value.id);
    }
});
onMounted(() => {
    router.push(`${path}/grilla`);
});
</script>

<template>
    <sdPageHeader title="Shop pp" class="ninjadash-page-header-main" :routes="pageRoutes"></sdPageHeader>
    <Main>
        <a-row :gutter="30">
            <!-- <a-col class="product-sidebar-col" :xxl="5" :xl="7" :lg="7" :md="10" :xs="24">
                <Suspense>
                    <template #default>
                        <Filters />
                    </template>
                    <template #fallback>
                        <sdCards headless>
                            <a-skeleton :paragraph="{ rows: 22 }" active />
                        </sdCards>
                    </template>
                </Suspense>
            </a-col>-->
            <a-col class="product-content-col" :xxl="19" :lg="17" :md="14" :xs="24">
                <TopToolBox>
                    <a-row :gutter="0">
                        <a-col :xxl="7" :lg="12" :xs="24">
                            <!-- <sdAutoComplete :dataSource="[]" placeholder="Search" width="100%" patterns /> -->
                            <h3>Listado de productos</h3>
                        </a-col>
                        <!--  <a-col :xxl="7" :lg="12" :xs="24">
                            <p class="search-result">Showing 1–8 of 86 results</p>
                        </a-col> -->
                        <a-col :xxl="10" :xs="24">
                            <div class="product-list-action d-flex justify-content-between align-items-center">
                                <!-- <div class="product-list-action__tab">
                                    <span class="toolbox-menu-title"> Status:</span>
                                    <a-radio-group @change="onSorting" v-model:value="sortDefault">
                                        <a-radio-button value="rate">Top Rated</a-radio-button>
                                        <a-radio-button value="popular">Popular</a-radio-button>
                                        <a-radio-button value="time">Newest</a-radio-button>
                                        <a-radio-button value="price">Price</a-radio-button>
                                    </a-radio-group>
                                </div> -->

                                <div
                                    v-if="(innerWidth <= 991 && innerWidth >= 768) || innerWidth > 575"
                                    class="product-list-action__viewmode"
                                >
                                    <a-tooltip title="Ver en grilla">
                                        <router-link :to="`${path}/grilla`">
                                            <unicon name="apps" width="16"></unicon>
                                        </router-link>
                                    </a-tooltip>
                                    <a-tooltip title="Ver en listado">
                                        <router-link :to="`${path}/listado`">
                                            <unicon name="list-ul" width="16"></unicon>
                                        </router-link>
                                    </a-tooltip>
                                </div>
                            </div>
                        </a-col>
                    </a-row>
                </TopToolBox>
                <router-view name="grid"></router-view>
            </a-col>
        </a-row>
    </Main>
</template>
