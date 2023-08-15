// import { useNuxtApp, useFetch } from '#app'

// export const useCsrfFetch = (request: string, opts) => {
//   const nuxtApp = useNuxtApp()
//   const csrfToken = nuxtApp.payload.csrfToken
//   const headers = { ...useRequestHeaders(['cookie']), csrfToken }
//   const options = { ...opts }
//   if (opts.body) {
//     options.body.csrfToken = csrfToken
//   }
//   options.params = { ...options.params, csrfToken: csrfToken }
//   return useFetch(request, { ...options, headers })
// }

export const useAuthStore = () => {
  const authUser = useState('authUser', () => {
    return { userName: '', authenticated: false, sessionId: '' }
  })

  const authenticated = computed(() => {
    return !!authUser.value.authenticated
  })

  // const XcsrfFetch = async (method: 'GET' | 'POST') => {
  //   const config = useRuntimeConfig()

  //   const {
  //     data: products,
  //     pending,
  //     error,
  //     refresh,
  //   } = await useFetch(`ecommerce/products/index`, {
  //     baseURL: config.public.apiUrl,
  //     method: method,
  //     params: { csrfToken: authUser.value.csrfToken },
  //     headers: { ...useRequestHeaders(['cookie']), csrfToken: authUser.value.csrfToken },
  //   })
  // }

  return {
    authUser,
    authenticated,
    // csrfFetch,
  }
}
