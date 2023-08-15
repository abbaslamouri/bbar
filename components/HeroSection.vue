<script setup lang="ts"></script>

<template>
  <article class="hero">
    <div class="container flow-5xl">
      <div class="hero__content | flow-4xl">
        <div class="xx">
          <p class="panorama"><span>KIS</span>(Keep It Simple) The Lamp Made for Light</p>
          <div class="flow-2xs">
            <h1 class="light">Patented Light Source Technology</h1>
            <p class="subheading">We transform ordinary lamps into extraordinary ones</p>
          </div>
        </div>
        <button class="btn btn-filled">Explore our Products</button>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.hero {
  position: relative;
  padding-block: var(--size-2xl);

  &::before {
    content: '';
    inset: 0;
    position: absolute;
    background: url('/assets/morelamplight-hero-1.webp');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    filter: brightness(40%);
  }

  h1 {
    // font-size: var(--font-size-5);
    // letter-spacing: var(--tracking--4);
    max-width: 14ch;
    line-height: 0.95;
    color: var(--color-neutral-90);

    // border: 1px solid green;
  }
  .subheading {
    color: var(--color-neutral-80);
  }

  .container {
    position: relative;
  }
}
</style>
