// import { useAuthStore } from './composables/index'
export default defineNuxtPlugin(async () => {
  const { updateToastMessage } = useToast()

  return {
    provide: {
      toast: (msg: string, options: object) => {
        updateToastMessage(msg, options)
      },
    },
  }
  // const nuxtApp = useNuxtApp()
  // const { authUser } = useAuthStore()

  // const res = nuxtApp.ssrContext?.event.node.res ?? {}
  // if ('_userSession' in res)
  //   authUser.value = {
  //     userName: (res._userSession as typeof authUser.value).userName,
  //     authenticated: (res._userSession as typeof authUser.value).authenticated,
  //     sessionId: (res._userSession as typeof authUser.value).sessionId,
  //   }
})
