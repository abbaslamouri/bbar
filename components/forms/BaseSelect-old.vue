<script lang="ts" setup>
import { type PropType } from 'vue'

interface ISelectOption {
  value: string
  text: string | number
}

defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  selectOptions: {
    type: Array,
    required: true,
  },
  nullOption: {
    type: String,
    default: 'Select Option',
  },
  hint: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="input-wrapper | flow-2xs">
    <div class="inner">
      <label :v-for="$attrs.id" v-if="label">{{ label }} </label>
      <div class="input select">
        <select v-bind="$attrs" @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)">
          <option value="">{{ nullOption }}</option>
          <option
            v-for="selectOption  in (selectOptions  as Array<ISelectOption>)"
            :value="selectOption.value"
            :selected="selectOption.value === modelValue"
          >
            {{ selectOption.text }}
          </option>
        </select>
      </div>
      <!-- <div class="hint">{{ hint }}</div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
