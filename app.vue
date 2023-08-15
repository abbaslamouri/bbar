<script setup lang="ts">
const appWrapperRef = ref()
const viewportWidth = useViewportWidth()
const { toasts, toastsOptions } = useToast()
const { $toast } = useNuxtApp()
const { searchText, page, perPage, sort, appFetch } = useHttp()

onMounted(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach(async (entry) => {
      viewportWidth.value = entry.contentRect.width
    })
  })
  if (appWrapperRef.value) resizeObserver.observe(appWrapperRef.value)
  // $toast('You are logged in', { type: 'success', position: 'center', duration: 20 })

  // setTimeout(() => {
  //   $toast('You are logged out', { type: 'error', duration: 10 })
  // }, 1000)

  // setTimeout(() => {
  //   $toast('You are logged aagin!!!!!!asddasdasd asasdddasdasasd sasdasdasd asdasdasdd asdassdasdas asdadsdas ', {
  //     type: 'info',
  //   })
  // }, 2000)
})

const someErrorLogger = async (err: any) => {
  console.log('Got some error', err)
}

const resetError = async (error: any) => {
  return navigateTo({
    path: '/',
  })
  // location.reload()
}

// watch(perPage, () => {
//   if (!perPage.value) perPage.value = 10
// })

// watch(page, () => {
//   if (!page.value) page.value = 1
// })

// watch(searchText, () => {
//   updateSearch()
// })
</script>

<template>
  <div class="app-wrapper" ref="appWrapperRef">
    <NuxtLayout>
      <NuxtLoadingIndicator color="#00DC82" :height="5" />
      <NuxtErrorBoundary @error="someErrorLogger">
        <div class="toasts flow-l" :data-position="toastsOptions.position" v-if="toasts.length">
          <ul role="list">
            <template v-for="toast in toasts">
              <li>
                <transition name="toast">
                  <Toast class="toast" :toast="toast" v-if="toast" />
                </transition>
              </li>
            </template>
          </ul>
        </div>
        <NuxtPage />
        <template #error="{ error }">
          <div>
            <div class="container | flow-s">
              <p>Something went terribly wrong. We aplogize for the inconvenience</p>
              <p>{{ error }}</p>
              <button class="btn btn-filled" @click="resetError(error)">Click here to continue</button>
            </div>
          </div>
        </template>
      </NuxtErrorBoundary>
    </NuxtLayout>
  </div>
</template>

<style lang="scss" scoped></style>
