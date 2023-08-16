<script setup lang="ts">
definePageMeta({
  title: 'users',
  description: 'ACS users',
  layout: 'admin',
  // middleware: ['auth'],
})

const options = ref()
const brushOptions = ref()
const series = ref([])

const colors = ['#d70c52', '#690690', '#096096', '#346121']

const datasets = ref([])
const rangeMin = ref()
const rangeMax = ref()
const categories = ref([])

options.value = {
  chart: {
    id: 'plot',
  },
  xaxis: {
    type: 'numeric',
    tickAmount: 5,
    min: categories.value[0],
    max: categories.value[categories.value.length - 1],
    categories: categories.value,
  },
}

brushOptions.value = {
  chart: {
    id: 'brush',
    brush: {
      target: 'plot',
      enabled: true,
    },
    selection: {
      enabled: true,
      xaxis: {
        min: 1991,
        max: 1998,
      },
    },
  },
  xaxis: {
    type: 'numeric',
    tickAmount: 10,
    categories: categories.value,
  },
}

// series.value = [
//   {
//     name: 'series-1',
//     data: [30, 40, 45, 50, 49, 60, 70, 91],
//   },
//   {
//     name: 'series-2',
//     data: [50, 30, 75, 80, 99, 70, 20, 100],
//   },
// ]

// onMounted(async () => {
const { data: csvData } = await useAsyncData('test', () => queryContent('x').find())

console.log('CCCCC', csvData.value[0].body)

const parsedData = {} as Array<{}>

for (const el of Object.keys(csvData.value?.[0]?.body[0])) {
  // console.log(el)
  parsedData[el] = []
  // row[el] = item[el]
}
// console.log('P1111111111', parsedData)
// }

rangeMin.value = 2000
rangeMax.value = 20000

for (const item of csvData.value?.[0]?.body) {
  // console.log(item)
  //   const row = {}

  const keys = Object.keys(item)
  const values = Object.values(item)
  console.log('KKKKK', keys)
  console.log('VVVVVVV', values)

  for (const prop in keys) {
    // rangeMin.value = rangeMin.value < values[0] ? values[0] : rangeMin.value
    // rangeMax.value = rangeMax.value < values[0] ? values[0] : rangeMax.value
    // if (keys[prop] !== 'WAVELENGTH') {
    // console.log('P2', parsedData[keys[prop]])
    parsedData[keys[prop]].push(+values[prop])
    // }
  }
}

// console.log('RM', rangeMin.value, rangeMax.value)

console.log('P', parsedData)
categories.value = parsedData.WAVELENGTH
console.log('CAT', categories.value, categories.value[0], categories.value[categories.value.length - 1])
delete parsedData.WAVELENGTH

console.log('P1', parsedData)

// const labels = parsedData.WAVELENGTH
// let datasets = []

const parsedDataKeys = Object.keys(parsedData)
const parsedDataValues = Object.values(parsedData)
// const sr = []
for (const prop of parsedDataKeys) {
  console.log(prop)
  series.value.push({ id: prop, data: parsedData[prop] })
  //   if (parsedDataKeys[prop] !== 'WAVELENGTH') {
  //     datasets.value.push({ data: parsedDataValues[prop] })
  //   }
}

console.log('series', series.value)

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const chartData = computed(() => {
  return {
    datasets: datasets.value,
  }
})
const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        gridLines: {
          display: false,
        },
        ticks: {
          // autoSkip: true,
          maxTicksLimit: 10,
          // display: false,
          // position: 'right',
        },
        min: 2400,
      },
    },
  }
})

// const updateRange = debounce((inputValue: string, type: string) => {
//   console.log(inputValue.target.value)

//   console.log(datasets)
//   const newDataSets = []

//   for (const datasetData of datasets.value) {
//     const newArr = []
//     for (const item of datasetData.data) {
//       console.log(1 * item.x > 1 * inputValue.target.value)
//       if (type === 'rangeMin' && 1 * item.x >= 1 * inputValue.target.value) {
//         newArr.push(item)
//       }

//       if (type === 'rangeMax' && 1 * item.x <= 1 * inputValue.target.value) {
//         newArr.push(item)
//       }
//     }
//     newDataSets.push({ data: newArr })
//   }

//   datasets.value = newDataSets

//   console.log(datasets)
//   // searchText.value = inputValue
//   // fetchMedia()
// }, 500)
</script>

<template>
  <div class="">Dashborad</div>
  <!-- {{ categories }} -->
  <ClientOnly>
    <apexchart :key="series" width="500" type="line" :options="options" :series="series"></apexchart>

    <apexchart :key="series" width="500" type="area" :options="brushOptions" :series="series"></apexchart>
  </ClientOnly>
</template>

<style lang="scss" scoped></style>
