<script setup lang="ts">
const { perPage, updatePerPage } = useHttp()

const localPerPage = ref(perPage.value)

watch(localPerPage, () => {
  updatePerPage(localPerPage.value)
})
</script>

<template>
  <div class="per-page">
    <v-text-field v-model="localPerPage" label="Per page" variant="solo" density="compact"></v-text-field>
  </div>
</template>

<style lang="scss" scoped>
.per-page {
  min-width: var(--size-7xl);
}
</style>
