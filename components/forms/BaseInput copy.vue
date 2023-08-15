<script lang="ts" setup>
import uniqueId from '~/server/utils/uniqueId'
defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  errorMsg: {
    type: String,
    default: '',
  },
  leadingIcon: {
    type: String,
    default: '',
  },
  trailingIcon: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])

const uuid = uniqueId().getId()

const setValue = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div class="input-wrapper | flow-2xs">
    <div class="inner">
      <div class="icons leading" v-if="leadingIcon">
        <Icon :name="leadingIcon" aria-hidden="true" focusable="false" />
      </div>
      <div class="input" :class="{ 'no-label': !label }">
        <label :v-bind:for="`base-input-${uuid}`" v-if="label">
          {{ label }}
          <span v-if="$attrs.required !== undefined"> *</span>
        </label>
        <input v-bind="$attrs" :id="`base-input-${uuid}`" :value="modelValue" @input="setValue" autocomplete="off" />
      </div>
      <div class="icons trailing" v-if="trailingIcon">
        <Icon :name="trailingIcon" aria-hidden="true" focusable="false" />
      </div>
    </div>
    <p class="errorMsg">{{ errorMsg }}</p>
  </div>
</template>

<style lang="scss" scoped></style>
