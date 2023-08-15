<script lang="ts" setup>
import type { PropType } from 'vue'

interface SelectOptions {
  text: string
  value: string
}
const props = defineProps({
  modelValue: {
    type: [Array, String],
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
  errorMsg: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const expanded = ref(false)

const localValue = ref()

const folteredValues = computed(() =>
  props.selectOptions.filter((item: SelectOptions) =>
    item.text?.toLowerCase().includes(localValue.value?.toLowerCase())
  )
)

const setValue = (event: Event) => {
  // emit('update:modelValue', (event.target as HTMLInputElement).value)
}

watch(localValue, () => {
  // emit('update:modelValue', localValue.value)
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div class="input-wrapper">
    <div class="combobox | flow-s">
      <!-- {{ folteredValues }}----{{ localValue }} -->
      <div>
        {{ localValue }}
        <div class="input" :class="{ 'no-label': !label, 'with-error': errorMsg }">
          <label :v-bind:for="$attrs.id" v-if="label">
            {{ label }}
            <!-- <span v-if="$attrs.required !== undefined"> *</span> -->
          </label>
          <input :placeholder="label" v-model="localValue" />
          <div class="icons">
            <Icon class="" name="ri:arrow-up-s-line" />
            <Icon class="" name="ri:arrow-down-s-line" />
          </div>
        </div>
        <p class="errorMsg">{{ errorMsg }}</p>
        <!-- <FormsPasswordInput type="text" :label="label" :placeholder="label" v-model="localValue" required /> -->
      </div>

      <!-- <button class="listbox__toggle" :class="{ active }" type="button" aria-haspopup="true" @click="active = !active">
      {{ nullOption }}
    </button> -->
      <ul class="combobox__menu | flow-2xs" role="combobox" :aria-expanded="expanded ? true : false">
        <li v-for="(item, index) in folteredValues" :key="`option-${index}`" role="option" tabindex="0">
          {{ item.text }}
          <!-- <label :for="`category-${index}`">
          <input type="checkbox" :id="`category-${index}`" :value="option.value" v-model="selectedItems" />
          <span> {{ option.text }}</span>
        </label> -->
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.combobox {
  position: relative;
  // border: 1px solid red;
  // cursor: pointer;

  // display: flex;
  // flex-direction: column;
  // // align-items: flex-start;
  // gap: var(--size-xs);
  // max-width: 100%;
  // border: 1px solid green;
  // &__toggle {
  //   width: 100%;
  //   box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.1);
  //   background-color: var(--card-bg);
  //   padding-block: var(--size-s);
  //   padding-inline: var(--size-xs);
  //   border-radius: var(--size-4xs);
  //   cursor: pointer;
  //   position: relative;
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  //   white-space: nowrap;
  //   max-width: 100%;
  //   display: flex;
  //   align-items: flex-start;
  //   gap: var(--space-xs);

  //   &::after {
  //     content: '';
  //     display: inline-block;
  //     // width: var(--size-s);
  //     // height: var(--size-s);

  //     border: var(--size-xs) solid transparent;
  //     border-block-start-color: inherit;
  //     transform: translateY(var(--size-2xs));
  //     opacity: 0.5;
  //     // transition: transfom 1s ease-in-out;
  //   }

  //   &.expanded {
  //     &::after {
  //       border-block-start-color: transparent;
  //       border-block-end-color: inherit;
  //       transform: translateY(calc(-1 * var(--size-2xs)));
  //     }
  //   }
  // }

  &__menu {
    position: absolute;
    width: 100%;
    z-index: 1;
    border: 1px solid green;
    box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.1);
    background-color: var(--card-bg);
    padding-block: var(--size-s);
    padding-inline: var(--size-xs);
    border-radius: var(--size-4xs);

    max-height: var(--size-8xl);
    overflow: scroll;
    position: absolute;
    top: calc(100% + var(--size-xs));
    // bottom: var(--size-s);
    visibility: hidden;
    display: flex;
    flex-direction: column;
    // gap: var(--space-xxs);;
    // align-items: stretch;

    li {
      padding-block: var(--size-3xs);
      // display: flex;
      // overflow-y: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;

      // background-color: red;

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

  // display: flex;
  // align-items: center;
  // gap: var(--space-xxs);;

  // label {
  //   order: 1;
  //   display: block;
  // }

  // input {
  //   border: 1px solid coral;
  //   width: 1.2rem;
  //   height: 1.2rem;
  //   display: block;
  // }
}
</style>
