<script setup lang="ts">
const viewportWidth = useViewportWidth()

const headerBreakpoint = 600

const menuLinks = [
  { name: 'index', title: 'Home' },
  { name: 'products', title: 'Products' },
  { name: 'learn', title: 'Learn' },
  { name: 'index', title: 'Technology' },
  { name: 'faqs', title: 'FAQS' },
  { name: 'index', title: 'About' },
  { name: 'contact', title: 'Contact Us' },
  // { name: 'auth-signup', title: 'Signup' },
  // { name: 'auth-signin', title: 'Signin' },
  { name: 'admin', title: 'Admin' },
]

const customerSubMenuExpanded = ref(false)
const cartModalRef = ref()
const signupBtnRef = ref()
const signinBtnRef = ref()
</script>

<template>
  <header :class="{ resize: +viewportWidth < headerBreakpoint }">
    <div class="container | flow-xs">
      <div class="top">
        <div class="left">
          <SmallScreenMenu :menuLinks="menuLinks" v-if="+viewportWidth < headerBreakpoint" />
          <Branding logoShade="light" />
        </div>
        <NavTop />
      </div>
      <!-- <div class="header__bottom" v-if="+viewportWidth > headerBreakpoint"> -->
      <NavMain :menuLinks="menuLinks" v-if="+viewportWidth > headerBreakpoint" />
      <!-- </div> -->
    </div>
  </header>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';

header {
  background-color: var(--color-neutral-10);
  position: relative;

  .top {
    display: flex;
    justify-content: space-between;

    .left {
      display: flex;
      align-items: center;
      gap: var(--size-2xl);
    }
  }

  .branding {
    // width: var(--size-6xl-7xl);

    &:focus-within {
      outline: 3px solid var(--color-primary-50);
      outline-offset: 0.3ch;
    }

    img {
      // object-fit: contain;
    }
  }

  &.resize {
    .top {
      flex-direction: column;
      align-items: stretch;
      gap: var(--space-xs);
      .left {
        justify-content: space-between;
      }

      // .secondary-nav {
      //   display: grid;
      //   place-content: center;
      // }
    }

    // .header__bottom {
    //   display: none;
    // }
  }

  // &.icon-only {
  //   .secondary-nav {
  //     svg {
  //       width: var(--size-l);
  //       height: var(--size-l);
  //     }
  //   }
  // }

  // &-menu {
  //   // text-decoration: none;
  //   // font-size: var(--font-size--1);
  //   // font-weight: var(--font-bold);
  //   // letter-spacing: var(--tracking-3);
  //   // text-transform: uppercase;
  //   padding-inline: var(--size-2xs);
  //   padding-block: var(--size-3xs);
  //   // border: 1px solid red;

  //   // border-block-end: 1px solid transparent;
  //   // background-color: var(--color-primary-60);
  //   // border-radius: var(--size-4xs);

  //   &:hover,
  //   &:focus {
  //     color: var(--color-primary-70);
  //     border-block-end: 1px solid var(--color-primary-70);
  //     // background-color: var(--color-primary-50);
  //   }
  // }

  // .header__bottom {
  //   nav {
  //     ul {
  //       display: flex;
  //       color: var(--bg);
  //       gap: var(--size-xs);
  //       justify-content: flex-end;

  //       li {
  //         border: 1px solid red;
  //         color: var(--color-neutral-90);

  //         a {
  //           border: 1px solid green;
  //         }
  //       }
  //     }
  //   }
  // }
}
</style>
