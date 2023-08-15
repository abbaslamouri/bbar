<script lang="ts" setup>
const viewportWidth = useViewportWidth()

// const accordionExpanded = ref(false)
const cartModalRef = ref()
const searchModalRef = ref()
const dropdownMenuRef = ref()
const dropdownTriggerRef = ref()
const signinBtnRef = ref()
const signupBtnRef = ref()
const faqRefs = ref<Array<HTMLLIElement>>([])

const faqs = [
  {
    question: 'Is morelamplight energy efficient?',
    answer:
      'YES. A 60 watt light bulb produces 800 lumens. produces 3200 lumens for only 32 watts… 7 TIMES THE EFFICIENCY',
  },
  {
    question: 'If I dim your product, does it use less energy?',
    answer:
      'Yes, it is roughly proportionate to the level of dimming, so at 30% of illumination (900 lumens), energy is reduced to 10 watts.',
  },
  {
    question: 'Why don’t other companies rate their bulbs for lamps in footcandles?',
    answer:
      'First, they do not design bulbs specifically for LAMPS! Their bulbs–incandescent, fluorescent or LED – burn with bases down. So their light is mostly directed AWAY from the surface beneath your lamp. We invite comparison with any light source with respect to footcandles in the task area. Even a 250 watt incandescent bulb yields 30% less task light than our 32 watt system.',
  },
  {
    question: 'Is the wattage 32 watts or 30 watts?',
    answer:
      'On high, it is 32 watts; but most people dim their lamps on occasion. On average, people use less than 30 watts, but we round energy consumption to 30 for easy comparison to other bulbs.',
  },
  {
    question: 'Can I use your system on a 3 way lamp?',
    answer:
      'Yes, the bulb will operate in the second or third levels of the switch. No matter what type of switch you have one way or 3 way–we suggest you leave the original switch on and then operate your lamp with the hand held dimmer.',
  },
  {
    question: 'How much do replacement bulbs cost?',
    answer:
      'The Reader bulbs are now priced at $4.95. The Booster bulb is $6.95. Both bulb types are guaranteed for 3 years but should last 5 years or longer under normal use.',
  },
  {
    question: 'What if I have a problem with my lamp in the installation of morelamplight?',
    answer:
      'Please contact us via email or by calling 1-888-211-6305 Call us with any other questions or comments. We appreciate your feedback.',
  },
]

const showAnswer = (index: number) => {
  const listItem = faqRefs.value[index]
  const button = faqRefs.value[index].querySelector('button')
  const icons = faqRefs.value[index].querySelectorAll('.icon')
  for (const icon of icons) {
    console.log('IIII', icon)
    if (icon.classList.contains('hidden')) icon.classList.remove('hidden')
    else icon.classList.add('hidden')
  }
  if (listItem.classList.contains('expanded')) {
    listItem.classList.remove('expanded')
    button?.setAttribute('aria-expanded', 'false')
    button?.setAttribute('aria-label', 'Open panel')
  } else {
    listItem.classList.add('expanded')
    button?.setAttribute('aria-expanded', 'true')
    button?.setAttribute('aria-label', 'Close panel')
  }
}
</script>

<template>
  <div class="fags | flow-3xl" :class="{ 'step-1': +viewportWidth < 800 }">
    <div class="container | flow-l">
      <h1>Frequently Asked Questions</h1>
      <div class="accordion">
        <ul class="panel" role="list">
          <li class="flow-s" v-for="(faq, index) in faqs" :ref="(el) => (faqRefs[index] = el as HTMLLIElement)">
            <button
              class="trigger"
              aria-expanded="false"
              aria-label="Open panel"
              aria-controls="accordion-content"
              ref="dropdownTriggerRef"
              @click="showAnswer(index)"
            >
              <span class="question">{{ faq.question }}</span>
              <span class="icon">+</span>
              <span class="icon hidden">-</span>
            </button>
            <div class="content" id="accordion-content" role="list">
              <p class="">
                {{ faq.answer }}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.accordion {
  ul {
    display: flex;
    flex-direction: column;
    gap: var(--size-l);
    // border: 1px solid red;

    li {
      // display: inline-block;
      min-width: 100%;
      // display: flex;
      // flex-direction: column;
      // align-items: stretch;
      // border: 1px solid red;
      box-shadow: var(--shadow-3);
      background-color: var(--card-bg);
      padding: var(--size-l);

      button {
        min-width: 100%;
        display: flex;
        justify-content: space-between;

        font-size: var(--font-size-1);
        cursor: pointer;

        .icon {
          color: var(--bg);
          background-color: var(--on-bg);
          width: var(--size-xl);
          height: var(--size-xl);

          border-radius: var(--size-4xs);
          font-size: var(--font-size-1);

          &.hidden {
            display: none;
            transition: display 500ms ease-in;
          }
        }
      }
      .content {
        // border: 1px solid red;
        display: grid;
        // grid-template-columns: 1fr;
        grid-template-rows: 0fr;
        transition: grid-template-rows 500ms ease-in;

        & > p {
          overflow: hidden;
          min-width: 100%;
        }
      }

      &.expanded {
        .content {
          grid-template-rows: 1fr;
        }
      }
    }
  }
}

// .fags {
//   // nav.top-nav {
//   //   padding-inline-end: var(--size-3xl);
//   ul {
//     display: grid;
//     grid-auto-flow: column;
//     gap: var(--space-xxs);;

//     li {
//       .btn {
//         border: 1px solid var(--text-color);
//         font-weight: normal;
//         padding: var(--size-3xs) var(--size-s);

//         svg {
//           fill: currentColor;
//         }

//         &:hover {
//           background-color: var(--text-color);
//           color: var(--bg-color);
//           // background-color: var(--color-primary-90);
//           // color: transparent;
//         }
//       }

//       &.dropdown {
//         position: relative;

//         .dropdown__trigger {
//           cursor: pointer;

//           &:after {
//             content: '';
//             border: 0.35rem solid transparent;
//             border-top-color: currentColor;
//             opacity: 0.6;
//             margin-left: 0.25em;
//             transform: translateY(0.15em);
//           }
//         }

//         .dropdown__menu {
//           grid-auto-flow: row;
//           gap: 0;
//           position: absolute;
//           transform-origin: top center;
//           border: 1px solid var(--text-color);
//           margin-block-start: -1px;
//           transform: rotateX(-90deg);
//           opacity: 0.3;
//           visibility: hidden;
//           min-width: 12rem;
//           width: 100%;
//           transition: all 300ms ease-out;
//           li .btn {
//             width: 100%;
//             border: none;
//             justify-content: flex-start;
//             padding-block: var(--size-3xs);
//           }
//         }

//         &.expanded {
//           .dropdown__menu {
//             opacity: 1;
//             visibility: visible;
//             transform: rotateX(0);
//             background-color: var(--bg-color);
//           }
//         }
//       }
//     }
//   }
// }
// // }
</style>
