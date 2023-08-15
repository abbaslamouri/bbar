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
  <div
    class="field-group input | flow-4xs"
    :class="{ 'with-label': label, 'with-leading-icon': leadingIcon, 'with-trailing-icon': trailingIcon }"
  >
    <label :v-bind:for="`base-input-${uuid}`" v-if="label">
      {{ label }}
      <span v-if="$attrs.required !== undefined">(required)</span>
    </label>
    <p class="errorMsg" v-if="errorMsg">
      <Icon name="ri:error-warning-line" aria-hidden="true" focusable="false" />
      <span> {{ errorMsg }}Error message</span>
    </p>
    <input v-bind="$attrs" :id="`base-input-${uuid}`" :value="modelValue" @input="setValue" autocomplete="off" />
    <div class="icons leading" v-if="leadingIcon">
      <Icon :name="leadingIcon" aria-hidden="true" focusable="false" />
    </div>
    <div class="icons trailing" v-if="trailingIcon">
      <Icon :name="trailingIcon" aria-hidden="true" focusable="false" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.field-group {
  position: relative;
  display: flex;
  flex-direction: column;

  label {
    font-size: 80%;
  }

  .errorMsg {
    color: var(--color-danger-50);
    display: flex;
    align-items: center;
    gap: var(--space-xxs);
  }

  input {
    font: inherit;
    width: 100%;
    padding-block: var(--space-xxs);
    padding-inline-start: var(--space-xs);
    padding-inline-end: var(--space-xs);
    border: 1px solid var(--color-medium);
    border-radius: var(--size-2xs);
  }

  .icons {
    width: var(--size-2xl);
    height: var(--size-2xl);
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    padding: var(--space-xxs);

    &.leading {
      left: 0;
    }

    &.trailing {
      right: 0;
    }

    svg {
      height: 100%;
      width: 100%;
    }
  }

  &.with-label {
    .icons {
      transform: translateY(-20%);
    }
  }

  &.with-leading-icon {
    input {
      padding-inline-start: var(--space-m);
    }
  }

  &.with-trailing-icon {
    input {
      padding-inline-end: var(--space-m);
    }
  }
}
</style>
