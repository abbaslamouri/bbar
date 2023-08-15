export default defineNuxtPlugin(async () => {
  const nuxtApp = useNuxtApp()

  const { cart } = useCartStore()

  // console.log('PLUGIN', cart.value)

  const res = nuxtApp.ssrContext?.event.node.res ?? {}
  // console.log('RES', res._cartSession)
  // console.log('IN', '_cartSession' in res)

  if ('_cartSession' in res) nuxtApp.payload.cartSession = res._cartSession // expose

  // return {
  //   provide: {
  //     cartSession: res?._cartSession,
  //   },
  // }
})
