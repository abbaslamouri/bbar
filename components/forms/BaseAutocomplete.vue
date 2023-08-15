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
    default: '',
  },
  selectOptions: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const emit = defineEmits(['updateSearchText', 'update:modelValue'])

const uuid = uniqueId().getId()
const inputRef = ref()
const searchText = ref('')
const selectedOption = ref('')
const isLoading = ref(false)
const isOpen = ref(false)
const arrowCounter = ref(-1)
const activedescendant = ref('')
const autocompleteRef = ref()

const setResult = (option: string) => {
  searchText.value = ''
  isOpen.value = false
  arrowCounter.value = -1
  inputRef.value.blur()
  emit('update:modelValue', option)
  selectedOption.value = ''
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const onArrowDown = (event: Event) => {
  if (isOpen.value) {
    if (arrowCounter.value < props.selectOptions.length - 1) {
      arrowCounter.value = arrowCounter.value + 1
      activedescendant.value = arrowCounter.value.toString()
      selectedOption.value = (props.selectOptions as Array<SelectOptions>)[arrowCounter.value].value
      const element = (event.target as HTMLElement)
        ?.closest('.autocomplete')
        ?.querySelector(`#result-item-${arrowCounter.value}`)
      console.log(element)
      element?.scrollIntoView()
    }
  }
}
const onArrowUp = (event: Event) => {
  if (isOpen.value) {
    if (arrowCounter.value >= 0) {
      arrowCounter.value = arrowCounter.value - 1
      if (arrowCounter.value < 0) {
        activedescendant.value = ''
        selectedOption.value = ''
      } else {
        activedescendant.value = arrowCounter.value.toString()
        selectedOption.value = (props.selectOptions as Array<SelectOptions>)[arrowCounter.value].value
        const element = (event.target as HTMLElement)
          ?.closest('.autocomplete')
          ?.querySelector(`#result-item-${arrowCounter.value}`)
        console.log(element)
        element?.scrollIntoView()
      }
    }
  }
}
const onEnter = () => {
  if (selectedOption.value) {
    setResult(selectedOption.value)
  } else {
    isLoading.value = true

    updateList()
  }
}

const toggleListVisibility = () => {
  if (isOpen.value) {
    isOpen.value = false
    inputRef.value.blur()
  } else inputRef.value.focus()
}

const handleClickOutside = (event: Event) => {
  if (!autocompleteRef.value.contains(event.target)) {
    isOpen.value = false
    arrowCounter.value = -1
  }
}

const updateList = debounce(async () => {
  const regex = new RegExp('^[a-zA-Z0-9 ]*$')
  if (!regex.test(searchText.value)) searchText.value = ''
  emit('updateSearchText', searchText.value)
  isLoading.value = false
}, 500)

watch(searchText, (newVal, oldVal) => {
  isLoading.value = true
  updateList()
})
</script>

<template>
  <div class="field-group autocomplete | flow-2xs" ref="autocompleteRef">
    <div class="top">
      <label :for="`autocomplete-${uuid}`" v-if="label">
        {{ label }}
        <span v-if="$attrs.required !== undefined">(required)</span>
      </label>
      <div class="input-icons">
        <div class="inner">
          <input
            type="text"
            :id="`autocomplete-${uuid}`"
            v-model="searchText"
            aria-describedby="autocomplete-instructions"
            aria-owns="autocomplete-results"
            :aria-expanded="isOpen"
            autocomplete="off"
            role="combobox"
            aria-haspopup="listbox"
            ref="inputRef"
            @focus="isOpen = true"
            @keyup.enter="onEnter"
            @keydown.esc="isOpen = false"
            @keyup.down="onArrowDown"
            @keyup.up="onArrowUp"
          />
          <button type="button" class="toggle" tabindex="-1" @click="toggleListVisibility">
            <Icon class="icon" name="ri:arrow-down-s-line" aria-hidden="true" focusable="false" />
            <span class="visually-hidden">Toggle search list</span>
          </button>
        </div>
        <button type="button" class="search" @click="updateList">
          <Icon name="ri:search-line" aria-hidden="true" focusable="false" />
          <span class="visually-hidden">Search</span>
        </button>
      </div>
    </div>
    <ul
      class="autocomplete-results | flow-2xs"
      id="autocomplete-results"
      role="listbox"
      :tabindex="isOpen ? -1 : 0"
      v-show="isOpen"
    >
      <li class="loading" v-if="isLoading">Loading results...</li>
      <template v-else>
        <li
          class="autocomplete-result"
          :class="{ active: selectedOption === option.value }"
          :id="`result-item-${index}`"
          v-for="(option, index) in (selectOptions as Array<SelectOptions>)"
          :key="`option-${index}`"
          role="option"
          tabindex="0"
          :aria-selected="index === arrowCounter"
          @click="setResult(option.value)"
        >
          <span
            v-html="
              `<b>${option.text.replace(searchText, `<span style='font-weight: normal;'>${searchText}</span>`)}</b>`
            "
          ></span>
        </li>
      </template>
    </ul>
    <div class="visually-hidden" id="autocomplete-instructions" aria-live="assertive">
      <span v-if="!selectOptions.length">
        When autocomplete options are avaialable, use up and down arrows to review and enter to select.
      </span>
      <span v-else>
        {{ selectOptions.length }} options available. Use ip and down arrrows to review and enter to select.
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.autocomplete {
  position: relative;
  width: 100%;
  // border: 1px solid red;

  .top {
    // border: 1px solid red;
    .input-icons {
      display: flex;
      border: 1px solid var(--color-medium);
      border: 1px solid green;

      button {
        width: var(--size-2xl);
        border: none;

        padding: var(--space-xxs);
        cursor: pointer;

        svg {
          height: 100%;
          width: 100%;
        }

        &.search {
          color: var(--color-white);
          background-color: var(--color-light);
        }
      }
      .inner {
        flex: 1;
        display: flex;

        input {
          flex: 1;
          border: none;
          padding-block: var(--space-xxs);
          padding-inline: var(--size-s);
        }
      }
    }
  }

  .toggle {
    cursor: pointer;
  }

  ul {
    width: 100%;
    box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.1);
    box-shadow: var(--shadow-3);
    background-color: var(--color-white);
    border-radius: var(--size-4xs);
    z-index: 99999;
    max-height: var(--size-7xl);
    overflow: auto;
    position: absolute;
    top: calc(100% + var(--size-xs));
    display: flex;
    flex-direction: column;

    &.above {
      top: calc(-1 * var(--size-7xl) - var(--size-xs));
    }

    li {
      padding-block: var(--size-2s);
      padding-inline: var(--size-xs);
      cursor: pointer;

      label {
        display: flex;
        gap: var(--size-xs);
        cursor: pointer;
      }

      &:hover {
        background-color: var(--bg-featured);
      }

      &.active {
        background-color: var(--color-primary-50);
      }
    }
  }
}
</style>
