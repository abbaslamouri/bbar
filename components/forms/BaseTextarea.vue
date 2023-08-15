<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  hint: {
    type: String,
    default: '',
  },
})
defineEmits(['update:modelValue'])
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div class="input textarea">
    <label :v-for="$attrs.id" v-if="label">{{ label }}</label>
    <textarea
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <p class="hint">{{ hint }}</p>
  </div>
</template>

<style lang="scss" scoped>
.input {
  box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.1);
  background-color: var(--card-bg);
  padding-block: var(--size-s);
  padding-inline: var(--size-xs);
  border-radius: var(--size-4xs);
  // font-size: var(--font-size--1);

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  // align-items: center;

  label {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    transition: all 200ms ease;
    // z-index: 1;
  }

  textarea {
    border: none;
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    transition: all 200ms ease;
    background-color: transparent;

    &::placeholder {
      opacity: 0;
    }

    &:focus {
      outline: none;
    }
  }

  .icon {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    justify-self: end;
  }

  &:has(textarea:focus) {
    outline: 2px solid var(--color-primary-70);
    outline-offset: 0.3ch;
    label {
      transform: translateY(-0.6rem);
      font-size: var(--font-size--1);
    }

    textarea {
      transform: translateY(0.6rem);
    }
  }

  &:has(textarea:not(:placeholder-shown)) {
    // outline: 2px solid var(--color-primary-70);
    // outline-offset: 0.3ch;
    label {
      transform: translateY(-0.6rem);
      font-size: var(--font-size--1);
    }

    textarea {
      transform: translateY(0.6rem);
    }
  }
}
</style>
