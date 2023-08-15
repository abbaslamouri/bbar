<script setup lang="ts">
const drawer = ref(true)

const navItems = ref([
  { route: 'admin', text: 'Dashboard', icon: 'mdi-view-dashboard', dropdown: false },
  { route: 'admin/media', text: 'Media', icon: 'mdi-panorama-outline', dropdown: false },
  { route: 'admin/categories/list', text: 'Categories', icon: 'mdi-view-list-outline', dropdown: false },
  // { route: 'admin/media', text: 'Orders', icon: 'mdi-cash-100', dropdown: false },
  {
    route: 'admin',
    dropdown: true,
    text: 'Products',
    icon: 'mdi-cart-outline',
    submenu: [
      { route: 'admin/products', text: 'List', icon: 'mdi-format-list-bulleted' },
      { route: 'admin/products/migrate', text: 'Migrate', icon: 'mdi-cloud-upload-outline' },
    ],
  },
])
</script>

<template>
  <v-app>
    <AdminNav />
    <v-main>
      <!-- <v-container> -->
      <slot />
      <AdminFooter />
      <!-- </v-container> -->
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped></style>
