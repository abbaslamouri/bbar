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
import { string } from 'zod'

// console.log(useRouter().getRoutes())

// // const relevantSheet = 'ge-8000-12000.csv'
// // const relevantSheet = 'test.csv'

// const colors = ['#d70c52', '#690690', '#096096', '#346121']

// const originalDatasets = ref([])
// //  ref<{ label: string; data: { x: string | number; y: number }[] }[]>([])
// const datasets = ref([])
// //  ref<{ label: string; data: { x: string | number; y: number }[] }[]>([])
// const tableData = ref({})
// const rangeMin = ref()
// const rangeMax = ref()
// const range = ref([2, 20])
// const DataRange = ref([2, 20])

// const dataSize = 9000

// const getAverage = (nums) => {
//   if (!nums.length) return
//   return nums.reduce((a, b) => a + b) / nums.length
// }

// const setTableData = () => {
//   const rowData = []
//   for (const prop in datasets.value) {
//     rowData[prop] = datasets.value[prop].data.map((d) => d.y)
//     tableData.value[prop] = {
//       label: datasets.value[prop].label,
//       min: Math.min(...rowData[prop]),
//       avg: getAverage([...rowData[prop]]),
//       max: Math.max(...rowData[prop]),
//     }
//   }

//   console.log('DDDD', rowData)
// }

// const { data: csvData } = await useAsyncData('ge-8000-12000', () => queryContent('ge-8000-12000').find())

// const rawData = csvData.value?.[0]?.body
// console.log('Raw', rawData)

// const ratio = Math.ceil(rawData.length / dataSize)
// console.log(ratio)

// const modifiedData = [...rawData.filter((value: object, index: number) => index % ratio == 0)]

// console.log('Modified Raw', modifiedData)

// const parsedData = {} as { [key: string]: { x: number; y: number }[] }

// for (const prop of Object.keys(modifiedData[0])) {
//   if (prop !== 'WAVELENGTH') parsedData[prop] = []
// }
// console.log('P', parsedData)

// for (const item of modifiedData) {
//   const keys = Object.keys(item) as string[]
//   const values = Object.values(item) as number[]
//   for (const prop in keys) {
//     if (keys[prop] !== 'WAVELENGTH') {
//       parsedData[keys[prop]].push({
//         x: values[0],
//         y: +values[prop],
//       })
//     }
//   }
// }
// console.log('PARSEDDATA', parsedData)

// // console.log('RM', rangeMin.value, rangeMax.value)

// // console.log('P', parsedData)

// // const labels = parsedData.WAVELENGTH
// // let datasets = []

// const parsedDataKeys = Object.keys(parsedData)
// const parsedDataValues = Object.values(parsedData)
// for (const prop in parsedDataKeys) {
//   originalDatasets.value.push({
//     label: parsedDataKeys[prop],
//     data: [...parsedDataValues[prop]],
//     borderColor: colors[prop],
//     pointStyle: false,
//   })
// }
// datasets.value = [...originalDatasets.value]

// // // const SimplifiedDataSets = []
// // for (const prop in datasets.value) {
// //   // const datalength = console.log('LENGTH', csvData.value?.[0]?.body.length)
// //   // console.log('LENGTH', csvData.value?.[0]?.body.length)
// //   // const data = [...datasets.value[prop].data]
// //   // datasets.value[prop].data = [...data.filter((value, index, Arr) => index % 9 == 0)]
// // }

// // datasets.value = SimplifiedDataSets
// console.log('DataSets', datasets.value)

// // Find xaxis min and max
// const rowData = []
// for (const prop in datasets.value) {
//   rowData[prop] = datasets.value[prop].data.map((d) => +d.x)
//   range.value[0] = Math.min(...rowData[prop])
//   range.value[1] = Math.max(...rowData[prop])

//   DataRange.value[0] = Math.min(...rowData[prop])
//   DataRange.value[1] = Math.max(...rowData[prop])
// }

// console.log(rowData)
// setTableData()

// // chartData.value = datasets.value

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// const chartData = computed(() => {
//   return {
//     datasets: datasets.value,
//   }
// })
// const chartOptions = computed(() => {
//   return {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       x: {
//         gridLines: {
//           display: false,
//         },
//         ticks: {
//           // autoSkip: true,
//           maxTicksLimit: 10,
//           // display: false,
//           // position: 'right',
//         },
//         min: 2400,
//       },
//     },
//   }
// })

// const updateDatasets = debounce(() => {
//   // if (type === 'rangeMin') rangeMin.value = +inputValue
//   // if (type === 'rangeMax') rangeMax.value = +inputValue
//   console.log(range.value[0], range.value[1], range.value[0] > range.value[1])
//   if (range.value[0] >= range.value[1]) return
//   console.log(datasets.value)
//   // return
//   // const newDataSets = []
//   const newDatasets = []
//   for (const prop in originalDatasets.value) {
//     newDatasets.push({
//       label: originalDatasets.value[prop].label,
//       data: [
//         ...originalDatasets.value[prop].data.filter((item) => +item.x >= range.value[0] && item.x <= range.value[1]),
//       ],
//     })
//   }

//   datasets.value = newDatasets
//   console.log(datasets.value)
//   // searchText.value = inputValue
//   // fetchMedia()
//   setTableData()
// }, 500)

// // watch(
// //   () => datasets.value,
// //   (newVal, oldValue) => {
// //     // if (newVal) cartModalRef.value.showModal()
// //     // else cartModalRef.value.close()
// //     // console.log(cartModalRef.value.getAttribute('open'))
// //     // setTimeout(() => {
// //     //   if (newVal) cartModalRef.value.showModal()
// //     // }, 5000)
// //     console.log(newVal)
// //     // console.log(oldValue)

// //     // else cartModalRef.value.close()
// //   },
// //   { deep: true }
// // )

// // range[0] = $event"

// const handleMinRangeChange = (event) => {
//   console.log(event.target.value)
//   range.value[0] = event.target.value
//   // updateDatasets()
// }

// const handleMaxRangeChange = (event) => {
//   console.log(event.target.value)
//   range.value[1] = event.target.value
//   // updateDatasets()
// }

// watch(
//   range,
//   () => {
//     updateDatasets()
//   },
//   { deep: true }
// )
</script>

<template>
  <div>
    <nuxt-link :to="{ name: 'admin-stack', params: { stack: 'ge-3000-5000' } }">Ge 3-5</nuxt-link>
    <br />
    <nuxt-link :to="{ name: 'admin-stack', params: { stack: 'ge-8000-12000' } }">Ge 8-12</nuxt-link>
    <!-- <v-container>
      {{ tableData }}
      <v-row>
        <v-col>
          <div class="chart-wrapper">
            <Line id="my-chart-id" :data="chartData" :options="chartOptions" />
          </div>
          <v-range-slider
            v-model="range"
            color="primary"
            hide-details
            :max="DataRange[1]"
            :min="DataRange[0]"
            :step="0.1"
            class="align-center"
          >
            <template v-slot:prepend>
              <v-text-field
                :model-value="range[0]"
                hide-details
                single-line
                type="number"
                variant="outlined"
                density="compact"
                style="width: 100px"
                :max="DataRange[1]"
                :min="DataRange[0]"
                :step="0.1"
                @change="handleMinRangeChange"
              ></v-text-field>
            </template>
            <template v-slot:append>
              <v-text-field
                :model-value="range[1]"
                hide-details
                single-line
                type="number"
                variant="outlined"
                style="width: 100px"
                :max="DataRange[1]"
                :min="DataRange[0]"
                :step="0.1"
                density="compact"
                @change="handleMaxRangeChange"
              ></v-text-field>
            </template>
          </v-range-slider>
        </v-col>
        <v-col>
          <v-table fixed-header height="300px">
            <thead>
              <tr>
                <th class="text-left">label</th>
                <th class="text-left">Minimum</th>
                <th class="text-center">Average</th>
                <th class="text-left">Maximum</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in tableData" :key="i">
                <td>{{ item.label }}</td>
                <td>{{ Math.round(item.min * 100) / 100 }}</td>
                <td>{{ Math.round(item.avg * 100) / 100 }}</td>
                <td>{{ Math.round(item.max * 100) / 100 }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-container> -->

    <!-- </template> -->
    <!-- <label for=""
      >Range Min
      <input
        type="range"
        min="0"
        max="20000"
        class="slider"
        id="myRange"
        v-model="rangeMin"
        @input="updateDatasets($event.target.value, 'rangeMin')"
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
        @input="updateDatasets($event.target.value, 'rangeMax')"
      />
      <p>Max{{ rangeMax }}</p>
    </label> -->

    <!-- <LineChart ref="line" /> -->
  </div>
</template>

<style scoped>
.chart-wrapper {
  width: 600px;
  height: 200px;
}
</style>
