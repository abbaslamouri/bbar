<script lang="ts" setup>
import debounce from 'lodash.debounce'
import uniqueId from '~/server/utils/uniqueId'

interface SelectOptions {
  text: string
  value: string
}
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: 'jjjjjjj',
  },
  selectOptions: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div class="field-group select | flow-2xs" :class="{ 'no-label': !label }" ref="selectRef">
    <v-select
      :label="label"
      :items="selectOptions"
      variant="solo"
      @update:modelValue="$emit('update:modelValue', $event)"
    ></v-select>
  </div>
</template>

<style lang="scss" scoped></style>
