<script setup lang="ts">
const props = defineProps({
  menuLinks: {
    type: Array,
    required: true,
  },
})
const viewportWidth = useViewportWidth()

const burgerVisible = ref(true)
const smallScreenMenuExpanded = ref(false)
</script>

<template>
  <div class="small-screen-menu" :data-expanded="smallScreenMenuExpanded">
    <!-- <BurgerButton :isVisible="burgerVisible" /> -->
    <transition name="burger">
      <button
        class="burger"
        v-if="burgerVisible"
        :aria-expanded="smallScreenMenuExpanded"
        :aria-label="burgerVisible ? 'Close admin sidebar' : 'Open admin sidebar'"
        @click="smallScreenMenuExpanded = !smallScreenMenuExpanded"
      >
        <span class="burger-bar"></span>
        <span class="visually-hidden">Main Menu</span>
      </button>
    </transition>
    <transition name="small-screen">
      <aside class="" v-if="smallScreenMenuExpanded">
        <nav class="main-nav" :class="{ expanded: smallScreenMenuExpanded }" aria-label="small-screen-nav">
          <ul class="" role="list">
            <li class="" v-for="menuLink in menuLinks" :key="menuLink.name">
              <Nuxt-link class="" :to="{ name: 'index' }" @click="burgerVisible = false">
                {{ menuLink.title }}
              </Nuxt-link>
            </li>
          </ul>
        </nav>
      </aside>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';
.small-screen-menu {
  --burger-bar-gap: 10px;
  // --burger-bar-width: 30px;
  --burger-bar-height: 3px;
  --burger-bar-bg: var(--color-neutral-80);

  color: var(--color-neutral-99);

  // display: none;

  // @media (min-width: $breakpoint-36) {
  //   display: none;
  // }
  // border: 1px solid red;
  .burger {
    position: relative;
    z-index: 2;

    &:focus-visible {
      margin-inline-start: var(--size-2xs);
    }

    // display: block;
    // padding: 6px;

    // top: var(--size-s);
    // left: var(--size-l);
    // display: grid;
    // place-items: center;
    height: 2.2rem;
    width: 2.2rem;
    // border: 1px solid var(--color-neutral-99);
    cursor: pointer;

    .burger-bar {
      display: block;
      width: 100%;
      height: var(--burger-bar-height);
      background-color: var(--burger-bar-bg);
      transition: transform 250ms ease-in-out;
      border-radius: 999999px;

      &::before,
      &::after {
        content: '';
        position: absolute;
        display: block;
        width: 100%;
        height: var(--burger-bar-height);
        background-color: var(--burger-bar-bg);
        // background-color: var(--color-neutral-99);
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

    &[aria-expanded='true'] {
      .burger-bar {
        background-color: transparent;
        // transform: rotate(380deg);
        &::before {
          top: 50%;
          transform: translateY(-50%) rotate(135deg);
        }

        &::after {
          bottom: 50%;
          transform: translateY(50%) rotate(45deg);
        }
      }

      & + aside {
        position: absolute;
        top: 0;
        left: 0;
        width: 90svw;
        background-color: var(--color-neutral-10);
        // border: 1px solid red;
        z-index: 1;
        nav {
          // border: 1px solid red;
          padding: var(--size-m);

          padding-block-start: var(--size-5xl);
          padding-block-end: var(--size-l);

          ul {
            display: flex;
            flex-direction: column;
            gap: var(--space-xxs);

            // gap: var(--size-xs);
            justify-content: flex-end;
          }
        }
      }
    }
  }

  @media (max-width: $breakpoint-36) {
    // display: block;
  }
}

.small-screen-enter-active,
.small-screen-leave-active {
  transition: all 250ms ease-in-out;
}

.small-screen-enter-from,
.small-screen-leave-to {
  // opacity: 0;
  transform: translateX(-50rem);
}

.small-screen-enter-to,
.small-screen-leave-from {
  // opacity: 1;
  transform: translateX(0);
}
</style>
