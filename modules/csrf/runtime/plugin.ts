export default defineNuxtPlugin(async () => {
  const nuxtApp = useNuxtApp()
  const { csrfToken } = useCsrfStore()

  const res = nuxtApp.ssrContext?.event.node.res ?? {}
  if ('_csrfToken' in res) csrfToken.value = res._csrfToken as string
})
