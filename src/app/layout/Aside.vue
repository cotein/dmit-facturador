<script setup lang="ts">
import { reactive, ref } from "vue";
import CreateCompanyForm from "../components/company/CreateCompanyForm.vue";
import { useOpenCompanyPanelStore } from "@/app/store/panels/useOpenCompanyPanelStore";
import { useAddNewCompanyPanelComposable } from "@/app/composables/panels/useAddNewCompanyPanelComposable";
import { useUserComposable } from "../composables/user/useUserComposable";
import { useCompanyComposable } from "../composables/company/useCompanyComposable";
import type { CompanyRawData } from "../types/Company";
import { CONCEPTO } from "../types/Constantes";
import { onMounted } from "vue";
const {
  IHaveMoreThanOneCompany,
  IHaveOneCompany,
  IHaventGotCompanies,
} = useUserComposable();
const { createCompanyMutation, CompanyGetter } = useCompanyComposable();

const props = defineProps({
  toggleCollapsed: {
    type: Function,
    required: true,
  },
  events: {
    type: Object,
    required: true,
  },
});

const darkMode = ref<boolean>(false);
const mode = ref("inline");

const state = reactive({
  rootSubmenuKeys: ["sub1", "sub2", "sub4"],
  selectedKeys: ["home"],
  openKeys: ["dashboard"],
  preOpenKeys: ["dashboard"],
});

const onOpenChange = (keys: any) => {
  state.openKeys =
    keys[keys.length - 1] !== "recharts" ? [keys.length && keys[keys.length - 1]] : keys;
};

const onClick = (item: { keyPath: any }) => {
  if (item.keyPath.length === 1) state.openKeys = [];
};

const visible = ref<boolean>(false);
const isMobile = ref<boolean>(false);

const onClose = () => {
  visible.value = !visible.value;
};

const { AddNewCompany, closeAddNewCompanyPanel } = useAddNewCompanyPanelComposable();

const { OpenPanelWithMyCompanies } = useOpenCompanyPanelStore();

const handleSubmitCompanyForm = (data: CompanyRawData) => {
  console.log("🚀 ~ handleSubmitCompanyForm ~ data:", data);
  createCompanyMutation.mutateAsync(data);
};

onMounted(() => {
  if (window.innerWidth <= 768) {
    isMobile.value = true;
  }
});
</script>

<template>
  <a-drawer
    :title="
      IHaventGotCompanies
        ? 'Debe cargar una compañía para administrar'
        : 'Agregar nueva compañía para administrar'
    "
    :width="isMobile ? '100%' : '80%'"
    :height="isMobile ? '100%' : '80%'"
    @close="IHaventGotCompanies ? null : closeAddNewCompanyPanel"
    :visible="AddNewCompany"
    :closable="IHaventGotCompanies ? false : true"
    :mask="IHaventGotCompanies ? true : false"
    :placement="isMobile ? 'top' : 'right'"
  >
    <CreateCompanyForm
      @submitCompanyForm="handleSubmitCompanyForm"
      :loadingButton="!createCompanyMutation.isLoading"
    />
  </a-drawer>

  <a-drawer
    title="Debe seleccionar la compañía con la que trabajará"
    :width="isMobile ? '100%' : '80%'"
    :visible="OpenPanelWithMyCompanies"
    @close="onClose"
    :closable="false"
    :mask="true"
    :placement="isMobile ? 'top' : 'right'"
  >
    ppppppppppppppppppppppppppp
  </a-drawer>

  <a-menu
    :open-keys="state.openKeys"
    v-model:selectedKeys="state.selectedKeys"
    :mode="mode"
    :theme="darkMode ? 'dark' : 'light'"
    class="scroll-menu"
    @openChange="onOpenChange"
    @click="onClick"
  >
    <NavTitle class="ninjadash-sidebar-nav-title">Ventas</NavTitle>
    <a-sub-menu key="sales">
      <template #icon>
        <unicon name="dollar-sign-alt"></unicon>
      </template>
      <template #title>Ventas</template>
      <a-menu-item @click="toggleCollapsed" key="dashboard">
        <router-link :to="{ name: 'Dashboard' }"> Dashboard </router-link>
      </a-menu-item>
      <a-menu-item @click="toggleCollapsed" key="generate">
        <router-link :to="{ name: 'NewInvoice' }"> Generar comprobante</router-link>
      </a-menu-item>
      <a-menu-item @click="toggleCollapsed" key="vouchers">
        <router-link :to="{ name: 'ListInvoice' }"> Comprobantes </router-link>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu key="customers">
      <template #icon>
        <unicon name="users-alt"></unicon>
      </template>
      <template #title>Clientes</template>
      <a-menu-item @click="toggleCollapsed" key="customers-new">
        <router-link :to="{ name: 'NewCustomer' }"> Alta </router-link>
      </a-menu-item>
      <!-- <a-menu-item @click="toggleCollapsed" key="customers-cuentas-corrientes">
        <router-link :to="{ name: 'ListCuentasCorrientes' }">
          Cuentas Corrientes
        </router-link>
      </a-menu-item> -->
    </a-sub-menu>

    <a-sub-menu key="categories">
      <template #icon>
        <unicon name="layer-group"></unicon>
      </template>
      <template #title>Categorías</template>
      <a-menu-item @click="toggleCollapsed" key="categories-new">
        <router-link :to="{ name: 'AddCategory' }"> Alta </router-link>
      </a-menu-item>
    </a-sub-menu>

    <a-sub-menu
      key="products"
      :disabled="CompanyGetter?.billing_concept === CONCEPTO.SERVICIOS"
    >
      <template #icon>
        <unicon name="gift"></unicon>
      </template>
      <template #title>Productos</template>
      <a-menu-item @click="toggleCollapsed" key="products-new">
        <router-link :to="{ name: 'AddProduct' }"> Alta </router-link>
      </a-menu-item>
    </a-sub-menu>
    <a-sub-menu
      key="services"
      :disabled="CompanyGetter?.billing_concept === CONCEPTO.PRODUCTOS"
    >
      <template #icon>
        <unicon name="constructor" fill="royalblue" />
      </template>
      <template #title>Servicios</template>
      <a-menu-item @click="toggleCollapsed" key="services-new">
        <router-link :to="{ name: 'AddService' }"> Alta </router-link>
      </a-menu-item>
    </a-sub-menu>

    <NavTitle class="ninjadash-sidebar-nav-title">Configuración del sistema</NavTitle>
    <a-sub-menu key="settings">
      <template #icon>
        <unicon name="dollar-sign-alt"></unicon>
      </template>
      <template #title>Lista de precios</template>
      <a-menu-item @click="toggleCollapsed" key="settings-add">
        <router-link :to="{ name: 'AddPriceList' }"> Alta </router-link>
      </a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>
