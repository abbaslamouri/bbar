<script setup lang="ts">
const props = defineProps({
  burgerBtnState: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    required: true,
  },
  burgerBarBgColor: {
    type: String,
    default: 'green',
  },
})

const emit = defineEmits(['burgerBtnStateChanged'])
</script>

<template>
  <button
    class="burger"
    :class="{ active: burgerBtnState }"
    type="button"
    aria-haspopup="true"
    :aria-label="burgerBtnState ? 'Close admin sidebar' : 'Open admin sidebar'"
    @click="emit('burgerBtnStateChanged')"
  >
    <span class="burger-bar"></span>
    <span class="visually-hidden">label</span>
  </button>
</template>

<style lang="scss" scoped>
.burger {
  --burger-bar-gap: 10px;
  --burger-bar-width: 36px;
  --burger-bar-height: 3px;
  --burger-bar-bg: var(--color-neutral-80);
  position: relative;

  &:focus-visible {
    margin-inline-start: var(--size-2xs);
  }

  height: var(--burger-bar-width);
  width: var(--burger-bar-width);
  cursor: pointer;

  .burger-bar {
    display: block;
    width: 100%;
    height: var(--burger-bar-height);
    background-color: v-bind(burgerBarBgColor);
    transition: transform 250ms ease-in-out;
    border-radius: 999999px;

    &::before,
    &::after {
      content: '';
      position: absolute;
      display: block;
      width: 100%;
      height: var(--burger-bar-height);
      background-color: v-bind(burgerBarBgColor);
      border-radius: 999999px;
      transition: transform 250ms ease-in-out;
    }

    &::before {
      top: 50%;
      transform: translateY(calc(-1 * var(--burger-bar-gap) - 50%));
    }

    &::after {
      bottom: 50%;
      transform: translateY(calc(var(--burger-bar-gap) + 50%));
    }
  }

  &.active {
    .burger-bar {
      background-color: transparent;
      &::before {
        top: 50%;
        transform: translateY(-50%) rotate(135deg);
      }

      &::after {
        bottom: 50%;
        transform: translateY(50%) rotate(45deg);
      }
    }
  }
}
</style>
