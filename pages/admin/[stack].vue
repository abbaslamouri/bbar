<script lang="ts" setup>
import debounce from 'lodash.debounce'
import { exportToPDF } from '#imports'
import annotationPlugin from 'chartjs-plugin-annotation'
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
import { getNode } from '@formkit/core'

const route = useRoute()
const { setTableData, interpolateData, parseData, setChartData } = useJSChart()

const originalDatasets = ref([
  {
    label: 'loading',
    data: [
      { x: '2', y: 6 },
      { x: '10', y: 10 },
      { x: '15', y: 20 },
    ],
  },
])
const tableData = ref({})
const rangeMin = ref()
const rangeMax = ref()
const range = ref([2, 20])
const DataRange = ref([2, 20])
const lineChartRef = ref({})

// const dataSize = 2000

const datasets = ref([])

const colors = [
  '#5e4fa2',
  '#3288bd',
  '#9e0142',
  '#66c2a5',
  '#f46d43',
  '#fdae61',
  '#d53e4f',
  '#d70c52',
  '#690690',
  '#096096',
  '#346121',
  '#e6f598',
]

const pdfSection = ref<HTMLElement | null>(null)

// const plugin = {
//   id: 'customCanvasBackgroundColor',
//   beforeDraw: (chart, args, options) => {
//     const { ctx } = chart
//     ctx.save()
//     ctx.globalCompositeOperation = 'destination-over'
//     ctx.fillStyle = options.color || '#99ffff'
//     ctx.fillRect(0, 0, chart.width, chart.height)
//     ctx.restore()
//   },
// }
const bgColor = {
  id: 'bgColor',
  beforDraw: (chart, options) => {
    const { ctx, width, height } = chart
    ctx.fillStyle = 'green'
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  },
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// onMounted(() => {
//   ChartJS.plugins.register(annotationPlugin)
//   ChartJS.addPlugin(chartjsPluginAnnotation)
//   ChartJS.renderChart(chartData.value, options.value)
// })

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
          maxTicksLimit: 10,
        },
        min: 2400,
      },
    },
    plugins: {
      type: Array,
      default: () => [bgColor],
    },
    // plugins: {
    //   autocolors: false,
    //   annotation: {
    //     annotations: {
    //       box1: {
    //         drawTime: 'afterDraw',
    //         // Indicates the type of annotation
    //         type: 'box',
    //         xMin: 2,
    //         xMax: 7,
    //         yMin: 0,
    //         yMax: 100,
    //         backgroundColor: 'rgba(0,0,0,1)',
    //       },
    //     },
    //   },
    // },
  }
})

const { data: csvData } = await useAsyncData(`${route.params.stack}`, () =>
  queryContent(`${route.params.stack}`).find()
)

const rawData = csvData.value?.[0]?.body
const modifiedData = interpolateData(rawData)
const parsedData = parseData(modifiedData)
// console.log('PARSEDDATA', parsedData)

originalDatasets.value = [...setChartData(parsedData, colors)]
datasets.value = [...setChartData(parsedData, colors)]

// // const SimplifiedDataSets = []
// for (const prop in datasets.value) {
//   // const datalength = console.log('LENGTH', csvData.value?.[0]?.body.length)
//   // console.log('LENGTH', csvData.value?.[0]?.body.length)
//   // const data = [...datasets.value[prop].data]
//   // datasets.value[prop].data = [...data.filter((value, index, Arr) => index % 9 == 0)]
// }

// datasets.value = SimplifiedDataSets
console.log('DataSets', datasets.value)

// Find xaxis min and max
const rowData = []
for (const prop in datasets.value) {
  rowData[prop] = datasets.value[prop].data.map((d) => +d.x)
  range.value[0] = Math.min(...rowData[prop])
  range.value[1] = Math.max(...rowData[prop])

  DataRange.value[0] = Math.min(...rowData[prop])
  DataRange.value[1] = Math.max(...rowData[prop])
}

// console.log(rowData)
tableData.value = setTableData(originalDatasets.value)

// chartData.value = datasets.value

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

// range[0] = $event"

const updateDatasets = () => {
  // if (type === 'rangeMin') rangeMin.value = +inputValue
  // if (type === 'rangeMax') rangeMax.value = +inputValue
  console.log(range.value[0], range.value[1], range.value[0] > range.value[1])
  if (range.value[0] >= range.value[1]) return
  // console.log(datasets.value)
  // return
  // const newDataSets = []
  const newDatasets = []
  for (const prop in originalDatasets.value) {
    newDatasets.push({
      label: originalDatasets.value[prop].label,
      data: [
        ...originalDatasets.value[prop].data.filter((item) => +item.x >= range.value[0] && item.x <= range.value[1]),
      ],
    })
  }

  // return newDatasets
  datasets.value = newDatasets

  tableData.value = setTableData(datasets.value)
  // console.log(datasets.value)
  // searchText.value = inputValue
  // fetchMedia()
  // setTableData()
}

const handleMinRangeChange = (event) => {
  console.log(event.target.value)
  range.value[0] = event.target.value
  // updateDatasets()
}

const handleMaxRangeChange = (event) => {
  console.log(event.target.value)
  range.value[1] = event.target.value
  // updateDatasets()
}

const handleInput = (event: Event) => {
  const node = getNode('chartRange')
  console.log(event, node?.value)
  range.value = node?.value as number[]
}

watch(
  range,
  () => {
    updateDatasets()
  },
  { deep: true }
)
</script>

<template>
  <div class="chart">
    <!-- {{ lineChartRef }} -->

    <!-- <v-container> -->
    <!-- {{ tableData }} -->
    <!-- <v-row>
        <v-col> -->
    <div class="graph" ref="pdfSection">
      <div class="chart-wrapper" v-if="chartData">
        <Line id="my-chart-id" :data="chartData" :options="chartOptions" ref="lineChartRef" />
      </div>
      <div v-else>...loading</div>
      <div>
        <FormKit type="form" #default="{ value }" actions="false">
          <FormKit
            type="slider"
            name="chartRange"
            id="chartRange"
            :value="[DataRange[0], DataRange[1]]"
            label="A slider with multiple inputs"
            show-input
            :min="DataRange[0]"
            step=".1"
            :max="DataRange[1]"
            tooltip="true"
            :min-input-attrs="{ label: 'Range min' }"
            :max-input-attrs="{ label: 'Range max' }"
            mark-labels
            :delay="500"
            @input="handleInput"
          />
          {{ value }}
        </FormKit>
      </div>
    </div>

    <button class="btn btn-filled" @click="exportToPDF('my-pdf-file.pdf', pdfSection)">print card</button>

    <!-- <v-range-slider
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
          </v-range-slider> -->
    <!-- </v-col>
        <v-col> -->
    <table fixed-header height="300px">
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
          <td>{{ Math.round(item.dataMin * 100) / 100 }}</td>
          <td>{{ Math.round(item.dataAvg * 100) / 100 }}</td>
          <td>{{ Math.round(item.dataMax * 100) / 100 }}</td>
        </tr>
      </tbody>
    </table>
    <!-- </v-col>
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
.chart {
  flex: 1;
  border: 1px solid red;

  display: flex;
  .graph {
    flex: 1;
    .chart-wrapper {
      display: flex;

      width: 100%;
      padding: 2rem;
      height: 200px;
      border: 1px solid red;
    }
  }
}
</style>
