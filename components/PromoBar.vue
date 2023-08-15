<script setup lang="ts">
const viewportWidth = useViewportWidth()
const endDate = new Date('september 30, 2024 12:00:00').getTime()

const remaingTime = ref()
const remaingDays = ref()
const remaingHoues = ref()
const remaingMinutes = ref()
const remaingSeconds = ref()

const timer = setInterval(function () {
  const now = new Date().getTime()
  remaingTime.value = endDate - now
  if (remaingTime.value > 0) {
    remaingDays.value = Math.floor(remaingTime.value / (1000 * 60 * 60 * 24))
    remaingHoues.value = Math.floor((remaingTime.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    remaingMinutes.value = Math.floor((remaingTime.value % (1000 * 60 * 60)) / (1000 * 60))
    remaingSeconds.value = Math.floor((remaingTime.value % (1000 * 60)) / 1000)
  }
  /* Here comes the rest of JavaScript code. */
}, 1000)
</script>

<template>
  <div class="promo" :class="{ resize: +viewportWidth < 1000 }">
    <div class="container" v-if="remaingTime > 0">
      <div class="ad | flow-3xs">
        <p>Mother's day special - up to $50 off</p>
        <p>Plus free shipping and LED dimmer on all lamp purchases</p>
        <p>Use coupon code MOM at cehckout</p>
      </div>
      <div class="date">
        <p class="flow-3xs">
          <span class="date-number">{{ ('0' + remaingDays).slice(-3) }}</span>
          <span>Days</span>
        </p>
        <p class="flow-3xs">
          <span class="date-number">{{ ('0' + remaingHoues).slice(-2) }}</span> <span>Hours</span>
        </p>
        <p class="flow-3xs">
          <span class="date-number">{{ ('0' + remaingMinutes).slice(-2) }}</span> <span>Minutes</span>
        </p>
        <p class="flow-3xs">
          <span class="date-number">{{ ('0' + remaingSeconds).slice(-2) }}</span> <span>Seconds</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.promo {
  background-color: var(--bg-highlight);

  p {
    color: var(--on-bg);
  }

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--size-m);
    .ad {
      // display: grid;
      // place-content: center;
      p {
        font-size: var(--font-size--1);
        font-weight: var(--font-bold);
        letter-spacing: var(--tracking-3);
        text-transform: uppercase;
      }
    }

    .date {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: var(--size-xs);

      p {
        border: 1px solid var(--on-bg);
        padding-block: var(--space-xxs);
        border-radius: var(--size-4xs);
        width: 4.6rem;
        gap: var(--size-3xs);
        font-size: var(--font-size--1);
        font-weight: var(--font-normal);
        text-align: center;
        // color: var(--color-neutral-10);

        span {
          display: block;
          &.date-number {
            // font-size: var(--font-size--1);
            font-weight: var(--font-bold);
          }
        }
      }
    }

    // @media screen and (max-width: $breakpoint-64) {
    // }
  }
  &.resize {
    .container {
      flex-direction: column;

      // display: grid;
      // place-content: center;

      .ad {
        p {
          text-align: center;
        }
      }

      .date {
      }
    }
  }
}

// }
</style>
