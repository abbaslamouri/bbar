<script lang="ts" setup>
import uniqueId from '~/server/utils/uniqueId'
// import type { PropType } from 'vue'

interface ISelectOption {
  value: string
  text: string | number
}
const props = defineProps({
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
})

const emit = defineEmits(['update:modelValue'])

const uuid = uniqueId().getId()

// const showList =ref(false)
const menuPosition = ref('')

const active = ref(false)
const optionElements = ref<Array<HTMLElement>>([])
const triggerRef = ref()

// const localItems = ref([])

const selected = computed(
  () =>
    (props.selectOptions as Array<ISelectOption>).find((option) => option.value === props.modelValue)?.text ??
    props.nullOption
)

const handleClick = (event: Event) => {
  const position = (event.target as HTMLElement).getBoundingClientRect().y
  // active.value = !active.value
  if (window.innerHeight - position < 300) menuPosition.value = 'above'
  else menuPosition.value = ''
  console.log('LLLLLLL', active.value)
  active.value = !active.value
}

// watch(localItems, () => {
//   active.value = false
//   emit('update:modelValue', localItems.value)
// })
</script>

<template>
  <div class="select">
    <button class="select__toggle" type="button" aria-haspopup="true" @click="handleClick" ref="triggerRef">
      <span class="label">{{ label }}</span>
      <span class="selected"> {{ selected }}</span>
    </button>
    <ul role="listbox" class="select__menu" :class="{ above: menuPosition === 'above' }" v-show="active">
      <!-- <div class="list-wrapper"> -->
      <li
        v-for="(option, index) in (selectOptions as Array<ISelectOption>)"
        :key="`option-${index}`"
        role="option"
        tabindex="0"
        :ref="(el:any) => (optionElements[index] = el)"
      >
        <button
          @click.prevent="
            () => {
              active = false
              $emit('update:modelValue', option.value)
            }
          "
        >
          <span> {{ option.text }}</span>
        </button>
      </li>
      <!-- </div> -->
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.select {
  position: relative;

  // border: 1px solid red;

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
    gap: var(--size-l);

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
    .label {
      transform: translateY(-0.6rem);
      font-size: var(--font-size--1);
      position: absolute;
      color: var(--color-primary-30);
      text-transform: capitalize;
    }

    .selected {
      transform: translateY(0.6rem);
    }
  }

  ul {
    position: absolute;
    display: block;
    left: 0;
    top: calc(100% + var(--size-2xs));
    // top: 100%;
    width: 100%;
    // border: 1px solid green;

    box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.1);
    background-color: var(--color-neutral-99);

    z-index: 99999;
    max-height: var(--size-12xl);
    overflow: auto;

    // display: grid;
    // grid-template-rows: 0fr;
    // transition: grid-template-rows 200ms ease-in-out;
    // padding-inline-start: var(--size-s);

    // .inner {

    //   // padding-block: var(--size-s);
    //   // padding-inline: var(--size-xs);
    //   // border-radius: var(--size-4xs);

    //   // visibility: hidden;

    //   border: 1px solid red;

    //   // ul {
    //   //   // display: flex;
    //   //   // flex-direction: column;

    //   //   &.above {
    //   //     top: calc(-1 * var(--size-7xl) - var(--size-xs));
    //   //   }

    //   //   li {
    //   //     padding-block: var(--size-3xs);
    //   //     button {
    //   //       // border: 1px solid red;
    //   //       // display: flex;
    //   //       // gap: var(--size-xs);
    //   //       cursor: pointer;
    //   //     }

    //   //   &[aria-expanded='true'] {
    //   //     visibility: visible;
    //   //   }
    //   // }
    // }

    // .list-wrapper {
    // overflow: hidden;
    // visibility: hidden;
    // opacity: 0;

    // top: 100%;
  }

  li {
    button {
      padding-inline: var(--size-s);
      padding-block: var(--space-xxs);
      cursor: pointer;
    }
    &:hover {
      background-color: var(--bg-featured);
    }
  }

  &[aria-expanded='true'] {
    grid-template-rows: 1fr;

    .list-wrapper {
      // visibility: visible;
      // opacity: 1;
    }
  }
  // }
}
</style>
