<script setup lang="ts">
definePageMeta({
  title: 'Categories',
  description: 'ACS users',
  layout: 'admin',
  // middleware: ['auth'],
})
</script>

<template>
  <div>
    <div class="container">
      <AdminCategoriesList />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
