<script lang="ts" setup>
import debounce from 'lodash.debounce'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// const relevantSheet = 'ge-8000-12000.csv'
// const relevantSheet = 'test.csv'

const colors = ['#d70c52', '#690690', '#096096', '#346121']

const datasets = ref([])
const rangeMin = ref()
const rangeMax = ref()

// onMounted(async () => {
const { data: csvData } = await useAsyncData('test', () => queryContent('x').find())

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
  console.log('KKKKK', values)

  for (const prop in keys) {
    // rangeMin.value = rangeMin.value < values[0] ? values[0] : rangeMin.value
    // rangeMax.value = rangeMax.value < values[0] ? values[0] : rangeMax.value
    if (keys[prop] !== 'WAVELENGTH') {
      // console.log('P2', parsedData[keys[prop]])
      parsedData[keys[prop]].push({
        x: values[0],
        y: +values[prop],
      })
    }
  }
}

console.log('RM', rangeMin.value, rangeMax.value)

// console.log('P', parsedData)

// const labels = parsedData.WAVELENGTH
// let datasets = []

const parsedDataKeys = Object.keys(parsedData)
const parsedDataValues = Object.values(parsedData)

for (const prop in parsedDataKeys) {
  if (parsedDataKeys[prop] !== 'WAVELENGTH') {
    datasets.value.push({ data: parsedDataValues[prop] })
  }
}

console.log('SETS', datasets.value)

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

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

const updateRange = debounce((inputValue: string, type: string) => {
  console.log(inputValue.target.value)

  console.log(datasets)
  const newDataSets = []

  for (const datasetData of datasets.value) {
    const newArr = []
    for (const item of datasetData.data) {
      console.log(1 * item.x > 1 * inputValue.target.value)
      if (type === 'rangeMin' && 1 * item.x >= 1 * inputValue.target.value) {
        newArr.push(item)
      }

      if (type === 'rangeMax' && 1 * item.x <= 1 * inputValue.target.value) {
        newArr.push(item)
      }
    }
    newDataSets.push({ data: newArr })
  }

  datasets.value = newDataSets

  console.log(datasets.value)
  // searchText.value = inputValue
  // fetchMedia()
}, 500)
</script>

<template>
  <div>
    <div class="chart-wrapper">
      <Line id="my-chart-id" :data="chartData" :options="chartOptions" />
    </div>

    <label for=""
      >Range Min
      <input
        type="range"
        min="0"
        max="20000"
        class="slider"
        id="myRange"
        v-model="rangeMin"
        @input="updateRange($event, 'rangeMin')"
      />
      <p>Min{{ rangeMin }}</p>
    </label>

    <label for="">
      Range Max
      <input
        type="range"
        min="0"
        max="20000"
        class="slider"
        id="myRange"
        v-model="rangeMax"
        @input="updateRange($event, 'rangeMax')"
      />
      <p>Max{{ rangeMax }}</p>
    </label>

    <!-- <LineChart ref="line" /> -->
  </div>
</template>

<style scoped>
.chart-wrapper {
  width: 600px;
  height: 400px;
}
</style>
