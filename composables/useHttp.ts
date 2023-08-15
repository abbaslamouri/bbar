// import { IParams, ISort, IAppData } from '~/server/utils/schemas/app'
import debounce from 'lodash.debounce'
import { ISelectOption } from '~/server/utils/schemas/app'

export const useHttp = () => {
  const { authUser } = useAuthStore()
  const { appApiErrorMsgs } = useAppErrors()

  const config = useRuntimeConfig()

  const sort = useState('sort', () => {
    return { field: '', order: 1 }
  })
  const filter = useState('filter', () => '')
  const searchText = useState('searchText', () => '')
  const page = useState('page', () => 1)
  const perPage = useState('perPage', () => 10)

  const selectedItems = useState<object[]>('selectedItems', () => [])
  const selectedItemsIds = useState<string[]>('selectedItemsIds', () => [])

  const appFetch = async (payload: { route: string; method: string; params?: object; body?: object }) => {
    if (
      payload?.method !== 'GET' &&
      payload?.method !== 'POST' &&
      payload?.method !== 'PUT' &&
      payload?.method !== 'DELETE'
    ) {
      appApiErrorMsgs.value.push(`${payload?.method} is not a valid request method`)
      return false
    }

    let requestObject = {}

    const getRequestObject = {
      baseURL: config.public.apiUrl,
      method: payload?.method,
      headers: { ...useRequestHeaders(['cookie']), sessionId: authUser.value.sessionId },
      params: {
        ...payload?.params,
        // sort: sort.value.field ? { [sort.value.field]: sort.value.order } : null,
        page: page.value,
        perPage: perPage.value,
      },
    }
    if (payload.method === 'GET') {
      requestObject = { ...getRequestObject }
    } else {
      requestObject = { ...getRequestObject, body: { ...payload?.body, sessionId: authUser.value.sessionId } }
    }

    const { data, error } = await useFetch(payload?.route, requestObject)
    if (error.value) {
      console.log('HTTP ERROR', error.value.data)
      appApiErrorMsgs.value.push(...error.value?.data?.data?.messages)
      return false
    } else {
      // console.log("HTTP DATA", data.value)
      return data.value
    }
  }

  const updateSortField = (event: string, selecteOptions: Array<ISelectOption>) => {
    if (!event) return
    const selectedValue = selecteOptions.find((option: ISelectOption) => option.text === event)
    sort.value.field = selectedValue?.value ?? ''
  }

  // const updateFilterField = (event: string, selecteOptions: Array<ISelectOption>) => {
  //   console.log(event)
  //   if (!event) return
  //   const selectedValue = selecteOptions.find((option: ISelectOption) => option.text === event)
  //   filter.value = selectedValue?.value ?? ''
  // }

  // const updateFilterAction = (event: string, selecteOptions: Array<ISelectOption>) => {
  //   if (!event) return
  //   const selectedValue = selecteOptions.find((option: ISelectOption) => option.text === event)
  //   filter.value.action = selectedValue?.value ?? ''
  // }

  // const updatePerpage = (newVal: number) => {
  //   if (isNaN(newVal)) return
  //   if (Math.round(newVal) < 1) return
  //   perPage.value = +newVal
  // }

  const updateSearchText = debounce(async (event: string) => {
    searchText.value = event
  }, 500)

  const updateSelectedItems = (sourceItem: object) => {
    console.log(sourceItem)
    const index = selectedItems.value.findIndex(
      (item: object) => '_id' in item && '_id' in sourceItem && item?._id === sourceItem?._id
    )
    if (index === -1) selectedItems.value.push(sourceItem)
    else selectedItems.value.splice(index, 1)
  }

  const updatePerPage = debounce(async (newVal: number) => {
    if (isNaN(newVal)) return
    if (Math.round(newVal) < 1) return
    perPage.value = +newVal
  }, 500)

  // watch(
  //   () => filter.value,
  //   (val) => {
  //     if (val) {
  //       console.log('QQQQQQQ', val)
  //     }
  //   }
  // )

  return {
    searchText,
    filter,
    page,
    perPage,
    sort,
    selectedItemsIds,
    selectedItems,
    appFetch,
    updateSearchText,
    updatePerPage,
    updateSortField,
    updateSelectedItems,
    // updateFilterField,
    // updateFilterAction,
    // updatePerpage,
  }
}
