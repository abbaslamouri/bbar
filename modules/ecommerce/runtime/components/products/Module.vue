<script lang="ts" setup>
const viewportWidth = useViewportWidth()
</script>

<template>
  <div class="module" :class="{ 'columns-1': viewportWidth < 500 }">
    <div class="container | flow-l">
      <h2>Already have a lamp you like?</h2>
      <div class="content">
        <div class="text | flow-l">
          <p>Take advantage of our $99 sale on the moreLamplight light source</p>
          <button class="btn btn-filled">Add to cart</button>
        </div>
        <div class="image">
          <img :src="`images/kis-module-250x250.webp`" alt="KIS Module" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.module {
  background-color: var(--bg-grey);

  h2 {
    text-align: center;
  }

  .container {
    // border: 1px solid red;
    display: grid;
    place-content: center;

    .content {
      display: flex;
      align-items: center;
      max-width: 30rem;
      // border: 1px solid red;
      margin-inline: auto;
    }
  }

  &.columns-1 {
    .container {
      .content {
        flex-direction: column-reverse;
        align-items: center;

        .text {
          text-align: center;
          display: grid;
          place-items: center;
        }
      }
    }
  }
}
</style>
