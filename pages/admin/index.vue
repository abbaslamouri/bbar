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
const originalDatasets = ref([])
// const chartData = ref()
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

// console.log('RM', rangeMin.value, rangeMax.value)

// console.log('P', parsedData)

// const labels = parsedData.WAVELENGTH
// let datasets = []

const parsedDataKeys = Object.keys(parsedData)
const parsedDataValues = Object.values(parsedData)

for (const prop in parsedDataKeys) {
  if (parsedDataKeys[prop] !== 'WAVELENGTH') {
    originalDatasets.value.push({ data: parsedDataValues[prop] })
  }
}

console.log('SETS', originalDatasets.value)

datasets.value = [...originalDatasets.value]
// chartData.value = datasets.value

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
  if (type === 'rangeMin') rangeMin.value = +inputValue
  if (type === 'rangeMax') rangeMax.value = +inputValue
  console.log(rangeMin.value, rangeMax.value, rangeMin.value > rangeMax.value)
  if (rangeMin.value >= rangeMax.value) return
  console.log(datasets.value)
  // return
  // const newDataSets = []
  const newDatasets = []
  for (const prop in originalDatasets.value) {
    newDatasets.push({
      data: [
        ...originalDatasets.value[prop].data.filter((item) => +item.x >= rangeMin.value && item.x <= rangeMax.value),
      ],
    })

    // const newArr = []
    // for (const prop in datasetData.data) {
    //   dataSet
    //   console.log(1 * item.x > 1 * inputValue.target.value)
    //   if (type === 'rangeMin' && 1 * item.x >= 1 * inputValue.target.value) {
    //     newArr.push(item)
    //   }

    //   if (type === 'rangeMax' && 1 * item.x <= 1 * inputValue.target.value) {
    //     newArr.push(item)
    //   }
    // }
    // newDataSets.push({ data: newArr })
  }

  datasets.value = newDatasets

  console.log(datasets.value)
  // searchText.value = inputValue
  // fetchMedia()
}, 500)

// watch(
//   () => datasets.value,
//   (newVal, oldValue) => {
//     // if (newVal) cartModalRef.value.showModal()
//     // else cartModalRef.value.close()
//     // console.log(cartModalRef.value.getAttribute('open'))
//     // setTimeout(() => {
//     //   if (newVal) cartModalRef.value.showModal()
//     // }, 5000)
//     console.log(newVal)
//     // console.log(oldValue)

//     // else cartModalRef.value.close()
//   },
//   { deep: true }
// )
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
        @input="updateRange($event.target.value, 'rangeMin')"
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
        @input="updateRange($event.target.value, 'rangeMax')"
      />
      <p>Max{{ rangeMax }}</p>
    </label>
    {{ datasets[0] }}

    <!-- <LineChart ref="line" /> -->
  </div>
</template>

<style scoped>
.chart-wrapper {
  width: 600px;
  height: 200px;
}
</style>
