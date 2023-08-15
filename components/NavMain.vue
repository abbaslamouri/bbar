<script setup lang="ts">
const props = defineProps({
  menuLinks: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <nav aria-label="main-nav">
    <ul role="list">
      <li v-for="menuLink in menuLinks" :key="menuLink.name">
        <NuxtLink class="btn btn-text" :to="{ name: menuLink.name }">{{ menuLink.title }}</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';

nav {
  ul {
    display: flex;
    // align-items: center;
    justify-content: flex-end;
    gap: var(--size-m);

    li {
      .btn {
        color: var(--bg);
        text-transform: uppercase;
      }
    }
  }
}

// header {
//   background-color: var(--color-neutral-10);
//   // color: var(--color-neutral-90);
//   position: relative;

//   .header__top {
//     // display: flex;
//     // justify-content: space-between;
//     // // align-items: center;

//     // .small-screen-menu--branding {
//     //   display: flex;
//     //   align-items: center;
//     //   gap: var(--size-2xl);

//     //   .branding {
//     //     width: var(--size-6xl-7xl);

//     //     &:focus-within {
//     //       outline: 3px solid var(--color-primary-50);
//     //       outline-offset: 0.3ch;
//     //     }

//     //     img {
//     //       object-fit: contain;
//     //     }
//     //   }
//     // }

//     // nav.secondary-nav {
//     //   // padding-inline-end: var(--size-3xl);
//     //   border: 1px solid red;
//     //   ul {
//     //     display: grid;
//     //     grid-auto-flow: column;
//     //     gap: var(--space-xxs);;

//     //     li {
//     //       .btn {
//     //         color: var(--bg-highlight);
//     //         border: 1px solid var(--bg-highlight);
//     //         // font-weight: normal;
//     //         // padding: var(--size-3xs) var(--size-s);

//     //         svg {
//     //           fill: currentColor;
//     //         }

//     //         &:hover {
//     //           background-color: var(--on-bg);
//     //           color: var(--bg) !important;
//     //           color: red !important;
//     //           // background-color: var(--color-primary-90);
//     //           // color: transparent;
//     //         }
//     //       }

//     //       &.dropdown {
//     //         position: relative;

//     //         .dropdown__trigger {
//     //           cursor: pointer;

//     //           &:after {
//     //             content: '';
//     //             border: 0.35rem solid transparent;
//     //             border-top-color: currentColor;
//     //             opacity: 0.6;
//     //             margin-left: 0.25em;
//     //             transform: translateY(0.15em);
//     //           }
//     //         }

//     //         ul.dropdown__menu {
//     //           grid-auto-flow: row;
//     //           gap: 0;
//     //           position: absolute;
//     //           transform-origin: top center;
//     //           border: 1px solid var(--text-color);
//     //           margin-block-start: -1px;
//     //           transform: rotateX(-90deg);
//     //           opacity: 0.3;
//     //           visibility: hidden;
//     //           min-width: 12rem;
//     //           width: 100%;
//     //           transition: all 300ms ease-out;
//     //           li .btn {
//     //             width: 100%;
//     //             border: none;
//     //             justify-content: flex-start;
//     //             padding-block: var(--size-3xs);
//     //           }
//     //         }

//     //         &:hover,
//     //         &:focus-within {
//     //           ul.dropdown__menu {
//     //             opacity: 1;
//     //             visibility: visible;
//     //             transform: rotateX(0);
//     //             background-color: var(--bg-color);
//     //           }
//     //         }
//     //       }
//     //     }
//     //   }
//     // }

//     // .xx-nav {
//     //   ul {
//     //     display: flex;
//     //     align-items: center;
//     //     justify-content: center;
//     //     flex-wrap: wrap;
//     //     gap: var(--space-xs);
//     //   }
//     // }
//   }

//   &-menu {
//     // text-decoration: none;
//     // font-size: var(--font-size--1);
//     // font-weight: var(--font-bold);
//     // letter-spacing: var(--tracking-3);
//     // text-transform: uppercase;
//     padding-inline: var(--size-2xs);
//     padding-block: var(--size-3xs);
//     // border: 1px solid red;

//     // border-block-end: 1px solid transparent;
//     // background-color: var(--color-primary-60);
//     // border-radius: var(--size-4xs);

//     &:hover,
//     &:focus {
//       color: var(--color-primary-70);
//       border-block-end: 1px solid var(--color-primary-70);
//       // background-color: var(--color-primary-50);
//     }
//   }

//   .header__bottom {
//     nav {
//       ul {
//         display: flex;
//         color: var(--bg);
//         gap: var(--size-xs);
//         justify-content: flex-end;

//         li {
//           border: 1px solid red;
//           color: var(--color-neutral-90);

//           a {
//             border: 1px solid green;
//           }
//         }
//       }
//     }
//   }

//   &.icon-only {
//     .secondary-nav {
//       svg {
//         width: var(--size-l);
//         height: var(--size-l);
//       }
//     }
//   }

//   &.resize {
//     .header__top {
//       flex-direction: column;
//       align-items: stretch;
//       gap: var(--space-xs);
//       .small-screen-menu--branding {
//         justify-content: space-between;
//       }

//       .secondary-nav {
//         display: grid;
//         place-content: center;
//       }
//     }

//     .header__bottom {
//       display: none;
//     }
//   }
// }
</style>
