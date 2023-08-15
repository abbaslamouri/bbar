<script lang="ts" setup>
const drawer = ref(false)

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
  <nav>
    <v-navigation-drawer v-model="drawer">
      <v-list>
        <!-- <v-list-subheader>REPORTS</v-list-subheader> -->
        <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg" title="John Leider" nav>
          <!-- <template v-slot:append>
            <v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
          </template> -->
        </v-list-item>

        <v-divider></v-divider>
        <template v-for="(item, i) in navItems" :key="i">
          <v-list-item :value="item" :prepend-icon="item.icon" nuxt :to="`/${item.route}`" v-if="!item.dropdown">
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item>

          <v-list-group :value="item" v-else>
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" :prepend-icon="item.icon" :title="item.text"></v-list-item>
            </template>
            <v-list-item
              v-for="(subItem, j) in item.submenu"
              :key="j"
              :title="subItem.text"
              :prepend-icon="subItem.icon"
              :value="subItem"
              nuxt
              :to="`/${subItem.route}`"
            ></v-list-item>
          </v-list-group>
        </template>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block> Logout </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar app flat border>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <!-- <v-toolbar-title>Joke Machinehh</v-toolbar-title> -->
      <v-spacer></v-spacer>
      <v-btn prepend-icon="mdi-check-circle" append-icon="mdi-export">
        <template v-slot:prepend>
          <v-icon color="success"></v-icon>
        </template>
        Logout
        <template v-slot:append>
          <v-icon color="warning"></v-icon>
        </template>
      </v-btn>
    </v-app-bar>
  </nav>
</template>

<style lang="scss" scoped></style>
