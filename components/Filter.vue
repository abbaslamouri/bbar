<script setup lang="ts">
import { ISelectOption } from '~/server/utils/schemas/app'
const { filter } = useHttp()

const filterSelectOptions = inject('filterSelectOptions') as Array<ISelectOption>

// const filterActions = [
//   { value: '$regex', text: 'RegEx' },
//   { value: '$eq', text: 'Equal' },
//   { value: '$gte', text: 'Greater than' },
//   { value: '$lte', text: 'Less than' },
// ]

// const localFilter = ref({
//   field:
//     (filterSelectOptions as Array<ISelectOption>).find((option: ISelectOption) => option.value == filter.value.field)
//       ?.text ?? '',
//   action:
//     (filterActions as Array<ISelectOption>).find((option: ISelectOption) => option.value == filter.value.action)
//       ?.text ?? '',
//   text: filter.value.text,
// })

// console.log('LLLL', filterSelectOptions)
</script>

<template>
  <div class="filter">
    <v-select
      v-model="filter"
      label="Filter by"
      :items=" (filterSelectOptions as Array<ISelectOption>).map((option: ISelectOption) => option.text)"
      density="compact"
      variant="solo"
    ></v-select>
  </div>
</template>

<style lang="scss" scoped>
.filter {
  min-width: var(--size-9xl);
}
</style>
