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

  const getDataAverage = async (data: number[]) => {
    if (!data.length) return
    return data.reduce((a, b) => a + b) / data.length
  }

  const setTableData = (datasets) => {
    const rowData = []
    const tableData = []
    for (const prop in datasets) {
      rowData[prop] = datasets[prop].data.map((d) => d.y)
      tableData[prop] = {
        label: datasets[prop].label,
        dataMin: Math.min(...rowData[prop]),
        dataAvg: getDataAverage([...rowData[prop]]),
        dataMax: Math.max(...rowData[prop]),
      }
    }

    // console.log('DDDD', rowData)
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
    // appFetch,
    updateSearchText,
    updatePerPage,
    updateSortField,
    updateSelectedItems,
    setTableData,
    // updateFilterField,
    // updateFilterAction,
    // updatePerpage,
  }
}
