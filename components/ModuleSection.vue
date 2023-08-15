<script setup lang="ts">
const viewportWidth = useViewportWidth()
</script>

<template>
  <article class="module" :class="{ resize: +viewportWidth < 600 }">
    <div class="container flow-l">
      <h2>The First Light Designed for Lamps</h2>
      <div class="content">
        <div class="image">
          <img src="/assets/kis-module-250x250.webp" alt="" />
        </div>
        <ul class="flow-3xs" role="list">
          <li><Icon class="" name="mdi:check" /><span>Only 32 watts</span></li>
          <li>
            <Icon class="" name="mdi:check" />
            <span>(4) bulbs for precise optical control</span>
          </li>
          <li>
            <Icon class="" name="mdi:check" />
            <span>Additional booster bulb for increased focus on task</span>
          </li>
          <li>
            <Icon class="" name="mdi:check" />
            <span>Up to 10 TIMES the task light</span>
          </li>
          <li>
            <Icon class="" name="mdi:check" />
            <span>3 year guarantee on all parts including bulbs</span>
          </li>
        </ul>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.module {
  // color: var(--color-neutral-10);
  background-color: var(--bg-grey);
  padding-block: var(--size-2xl);
  display: grid;
  place-items: center;

  // border: 1px solid red;

  h2 {
    text-align: center;
    color: var(--on-bg);
  }
  .content {
    display: flex;
    align-items: center;
    gap: var(--size-2xl);

    li {
      display: flex;
      align-items: center;
      gap: var(--space-xxs);
      font-size: var(--font-size-0);
      color: var(--on-bg-dim);
      // color: var(--color-neutral-10);
      // span {
      //   color: var(--color-neutral-70);
      // }
    }
  }

  &.resize {
    .content {
      flex-direction: column;
    }
  }
}
</style>
