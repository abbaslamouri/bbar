<script setup lang="ts">
const { authUser } = useAuthStore()
const { csrfToken } = useCsrfStore()
// console.log(useNuxtApp())
// const { $toast } = useNuxtApp()
</script>

<template>
  <div class="content-wrapper">
    <!-- <h1>Toast</h1> -->
    <!-- {{ $toast('world') }} -->
    <!-- <Toast /> -->
    <!-- {{ authUser }}
    {{ csrfToken }} -->
    <HeroSection />
    <ProductSection />
    <ModuleSection />
    <LampComparisonSection />
  </div>
</template>

<style lang="scss" scoped></style>
