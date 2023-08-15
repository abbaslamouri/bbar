<script setup lang="ts">
// import { useToast } from 'vue-toastification'

const props = defineProps({
  formData: {
    type: Object,
    default: '',
  },
})

const emit = defineEmits(['updateFormData'])

const { appFormErrors } = useAppErrors()

// const dateToHtml = (date: Date) => {
//   console.log('DDDDDATETTTTT', date)
//   var month = ('0' + (date.getMonth() + 1)).slice(-2)
//   var day = ('0' + date.getDate()).slice(-2)
//   var year = date.getFullYear()

//   var htmlDate = year + '-' + month + '-' + day

//   return htmlDate
//   // return date
// }

const localFormData = ref({
  price: props.formData.price,
  salePrice: props.formData.salePrice,
  salePriceStartDate: props.formData.salePriceStartDate,
  salePriceEndDate: props.formData.salePriceEndDate,
})

watch(localFormData.value, () => {
  // console.log(localFormData.value)
  console.log(new Date(localFormData.value.salePriceEndDate).getMilliseconds())
  // if (new Date(localFormData.value.salePriceEndDate) < new Date(localFormData.value.salePriceStartDate))
  // useToast().warning(
  //   'The sale price will not be displayed if the sale end date is not greater than the start date ',
  //   {
  //     timeout: 10000,
  //   }
  // )
  emit('updateFormData', localFormData.value)
})

// const setFieldDate = (event: string, name: string) => {
//   console.log(event, name)
//   // ($event.target as HTMLInputElement)?.value

//   localFormData.value.salePriceEndDate = event
// }
</script>

<template>
  <div class="section | flow-l" id="price">
    <h2>Price</h2>
    <!-- {{ localFormData }} -->
    <div class="columns-2">
      <div>
        <FormsBaseInput
          type="text"
          label="Price"
          placeholder="Price"
          v-model="localFormData.price"
          :data-invalid="!!appFormErrors.find((e) => e.fieldName == 'price')"
          :errorMsg="appFormErrors.find((e) => e.fieldName == 'price')?.fieldErrorMsg"
          required
        />
      </div>
      <div>
        <FormsBaseInput
          type="text"
          label="Sale Price"
          placeholder="Sale Price"
          v-model="localFormData.salePrice"
          required
        />
      </div>
    </div>
    <div class="columns-2">
      <FormsBaseInput type="date" label="Sale Start Date" v-model="localFormData.salePriceStartDate" />

      <FormsBaseInput type="date" label="Sale End Date" v-model="localFormData.salePriceEndDate" />
      <!-- <div> -->
      <!-- <div class="field-group | flow-2xs">
        <div class="inner">
          <div class="input">
            <label for="sale-start-date"> Sale Start Date </label>
            <input
              type="date"
              :value="localFormData.salePriceStartDate"
              id="sale-start-date"
              @input="localFormData.salePriceStartDate = ($event.target as HTMLInputElement)?.value"
            />
          </div>
        </div>
      </div> -->
      <!-- <div class="input-wrapper | flow-2xs">
        <div class="inner">
          <div class="input">
            <label for="sale-start-date"> Sale End Date </label>
            <input
              type="date"
              :value="localFormData.salePriceEndDate"
              id="sale-end-date"
              @input="localFormData.salePriceEndDate = ($event.target as HTMLInputElement)?.value"
            />
          </div>
        </div>
      </div> -->
      <!-- <input type="date" :value="dateToHtml(new Date())" /> -->
      <!-- <FormsBaseDate type="date" label="Sale Start Date" placeholder="Sale Price" :value="dateToHtml(new Date())" /> -->
      <!-- </div> -->
      <!-- <div>
        <FormsBaseDate type="date" label="Sale End Date" placeholder="Sale Price" :value="dateToHtml(new Date())" />
      </div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
