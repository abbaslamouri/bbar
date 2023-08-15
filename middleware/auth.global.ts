// import { useToast } from 'vue-toastification'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { authUser, authenticated } = useAuthStore()
  const { appFormErrors, appApiErrorMsgs } = useAppErrors()
  const { searchText, page, perPage, sort, appFetch, updatePerPage } = useHttp()

  const config = useRuntimeConfig()
  appApiErrorMsgs.value = []
  appFormErrors.value = []

  // searchText.value = ''
  // page.value = 1
  // perPage.value = 10
  // sort.value.field = ''
  // sort.value.order = -1

  // console.log(to.name)

  const { data, error } = await useFetch(`session`, {
    baseURL: config.public.apiUrl,
    method: 'GET',
    headers: { ...useRequestHeaders(['cookie']), sessionId: authUser.value.sessionId },
  })
  // console.log('DDDDD', data.value)

  if (!data.value) authUser.value = { userName: '', authenticated: false, sessionId: '' }

  // if(process.client)
  // const userSession = useCookie('user_session')

  // console.log('PPPPPPPP', userSession.value)

  if (to.name && (to.name as string).includes('admin') && !authenticated.value) {
    // useToast().error('You do not have permission to access these resources.  Please login')
    return navigateTo({
      path: '/auth/signin',
      query: {
        // page: 'signin',
      },
    })
  }
})
