<script lang="ts" setup>
import uniqueId from '~/server/utils/uniqueId'
import type { PropType } from 'vue'

interface SelectOptions {
  text: string
  value: string
}
const props = defineProps({
  modelValue: {
    type: Array,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  selectOptions: {
    type: Array as PropType<Array<SelectOptions>>,
    required: true,
  },
  nullOption: {
    type: String,
    default: 'Select Option',
  },
})

const uuid = uniqueId().getId()

const menuPosition = ref('')

const active = ref(false)
const optionElements = ref<Array<HTMLElement>>([])
const triggerRef = ref()

const localItems = ref([])

const emit = defineEmits(['update:modelValue'])

const handleClick = (event: Event) => {
  const position = (event.target as HTMLElement).getBoundingClientRect().y
  active.value = !active.value
  if (window.innerHeight - position < 300) menuPosition.value = 'above'
  else menuPosition.value = ''
}

watch(localItems, () => {
  emit('update:modelValue', localItems.value)
})
</script>

<template>
  <div class="listbox | flow-s">
    <button
      class="listbox__toggle"
      :class="{ active }"
      type="button"
      aria-haspopup="true"
      @click="handleClick"
      ref="triggerRef"
    >
      {{ nullOption }}
    </button>
    <ul
      class="listbox__menu | flow-2xs"
      :class="{ above: menuPosition === 'above' }"
      role="listbox"
      :aria-expanded="active ? true : false"
    >
      <li
        v-for="(option, index) in selectOptions"
        :key="`option-${index}`"
        role="option"
        tabindex="0"
        :ref="(el:any) => (optionElements[index] = el)"
      >
        <label :for="`listbox-${uuid}-${index}`">
          <input type="checkbox" :id="`listbox-${uuid}-${index}`" :value="option.value" v-model="localItems" />
          <span> {{ option.text }}</span>
        </label>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.listbox {
  position: relative;
  &__toggle {
    width: 100%;
    box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.1);
    background-color: var(--card-bg);
    padding-block: var(--size-s);
    padding-inline: var(--size-xs);
    border-radius: var(--size-4xs);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-xs);

    &::after {
      content: '';
      display: inline-block;
      border: var(--size-xs) solid transparent;
      border-block-start-color: inherit;
      transform: translateY(var(--size-2xs));
      opacity: 0.5;
    }

    &.active {
      &::after {
        border-block-start-color: transparent;
        border-block-end-color: inherit;
        transform: translateY(calc(-1 * var(--size-2xs)));
      }
    }
  }

  &__menu {
    width: 100%;
    box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.1);
    background-color: var(--card-bg);
    padding-block: var(--size-s);
    padding-inline: var(--size-xs);
    border-radius: var(--size-4xs);
    z-index: 99999;

    max-height: var(--size-7xl);
    overflow: auto;
    position: absolute;
    top: calc(100% + var(--size-xs));
    visibility: hidden;
    display: flex;
    flex-direction: column;

    &.above {
      top: calc(-1 * var(--size-7xl) - var(--size-xs));
    }

    li {
      padding-block: var(--size-3xs);

      label {
        // border: 1px solid red;
        display: flex;
        gap: var(--size-xs);
        cursor: pointer;
      }

      &:hover {
        background-color: var(--bg-featured);
      }
    }

    &[aria-expanded='true'] {
      visibility: visible;
    }
  }
}
</style>
