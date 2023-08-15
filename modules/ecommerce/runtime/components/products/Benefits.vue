<script lang="ts" setup>
const viewportWidth = useViewportWidth()
</script>

<template>
  <div class="benefits" :class="{ 'columns-2': viewportWidth < 1000, 'columns-1': viewportWidth < 500 }">
    <div class="container">
      <ul role="list">
        <li>
          <Icon class="icon" name="mdi:truck-delivery-outline" aria-hidden="true" focusable="false" />
          <p>Free shipping</p>
        </li>
        <li>
          <Icon class="icon" name="mdi:arrow-u-left-bottom" aria-hidden="true" focusable="false" />
          <p>60-day Money Back Guarantee</p>
        </li>
        <li>
          <Icon class="icon" name="mdi:shield-check-outline" aria-hidden="true" focusable="false" />
          <p>2-year Warranty</p>
        </li>
        <li>
          <Icon class="icon" name="mdi:basket-outline" aria-hidden="true" focusable="false" />
          <p>100% Secure Checkout</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.benefits {
  .container {
    display: grid;
    place-content: center;
    ul {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--size-l);

      li {
        display: grid;
        place-items: center;
        gap: var(--space-xxs);
        // border: 1px solid red;
        svg {
          background-color: var(--bg-highlight);
          padding: var(--size-s);
          width: 4rem;
          height: 4rem;
          border-radius: var(--size-3xs);
        }
        p {
          font-size: var(--font-size--1);
        }
      }
    }
  }

  &.columns-2 {
    .container {
      ul {
        grid-template-columns: repeat(2, 1fr);
        // gap: var(--size-l);
      }
    }
  }

  &.columns-1 {
    .container {
      ul {
        grid-template-columns: 1fr;
        // gap: var(--size-l);
      }
    }
  }
}
</style>
