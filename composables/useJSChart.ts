// import { IParams, ISort, IAppData } from '~/server/utils/schemas/app'
import debounce from 'lodash.debounce'
import { ISelectOption } from '~/server/utils/schemas/app'

export const useJSChart = () => {
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

  const getDataAverage = (data: number[]) => {
    if (!data.length) return
    return data.reduce((a, b) => a + b) / data.length
  }

  const setTableData = (datasets: any) => {
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
    console.log(tableData)
    return tableData
  }

  const interpolateData = (data: any) => {
    const ratio = 1
    // console.log('LENGTH', rawData.length)
    // console.log('RATIO', ratio)
    return [...data.filter((value: object, index: number) => index % ratio == 0)]
  }

  const parseData = (data: any) => {
    const parsedData = {} as { [key: string]: { x: number; y: number }[] }

    for (const prop of Object.keys(data[0])) {
      if (prop !== 'WAVELENGTH') parsedData[prop] = []
    }
    // console.log('P', parsedData)

    for (const item of data) {
      const keys = Object.keys(item) as string[]
      const values = Object.values(item) as number[]
      for (const prop in keys) {
        if (keys[prop] !== 'WAVELENGTH') {
          parsedData[keys[prop]].push({
            x: values[0],
            y: +values[prop],
          })
        }
      }
    }

    return parsedData
  }

  const setChartData = (parsedData: any, colors) => {
    const originalDatasets = []
    const parsedDataKeys = Object.keys(parsedData)
    const parsedDataValues = Object.values(parsedData)
    for (const prop in parsedDataKeys) {
      originalDatasets.push({
        label: parsedDataKeys[prop],
        data: [...parsedDataValues[prop]],
        borderColor: colors[prop],
        pointStyle: false,
      })
    }
    return originalDatasets
    // datasets.value = [...originalDatasets]
  }

  // const updateDatasets = debounce((data: any, range: any) => {
  //   // if (type === 'rangeMin') rangeMin.value = +inputValue
  //   // if (type === 'rangeMax') rangeMax.value = +inputValue
  //   console.log(range[0], range[1], range[0] > range[1])
  //   if (range[0] >= range[1]) return
  //   // console.log(datasets.value)
  //   // return
  //   // const newDataSets = []
  //   const newDatasets = []
  //   for (const prop in data) {
  //     newDatasets.push({
  //       label: data[prop].label,
  //       data: [...data[prop].data.filter((item) => +item.x >= range[0] && item.x <= range[1])],
  //     })
  //   }

  //   return newDatasets
  //   // datasets.value = newDatasets
  //   // console.log(datasets.value)
  //   // searchText.value = inputValue
  //   // fetchMedia()
  //   // setTableData()
  // }, 1000)

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
    updateSelectedItems,
    parseData,
    setTableData,
    interpolateData,
    setChartData,
    // updateDatasets
    // updateFilterField,
    // updateFilterAction,
    // updatePerpage,
  }
}
