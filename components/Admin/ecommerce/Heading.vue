<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  route: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="admin-heading">
    <h1>{{ title }}</h1>
    <div class="">
      <NuxtLink class="btn btn-filled" :to="{ name: route, params: { _id: '_' } }">
        <Icon class="icon" name="mdi:plus" aria-hidden="true" focusable="false" />Add
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  h1 {
    font-size: var(--font-size-2);
  }

  .actions {
    display: flex;
    align-items: center;
    gap: var(--size-l);
  }
}
</style>
