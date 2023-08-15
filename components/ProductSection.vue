<script setup lang="ts">
const viewportWidth = useViewportWidth()
</script>

<template>
  <article
    class="product-features"
    :class="{ resize1: +viewportWidth < 800, resize2: +viewportWidth < 600, resize3: +viewportWidth < 400 }"
  >
    <div class="container flow-l">
      <div class="heading flow-xs">
        <h2>The world’s best reading lamp</h2>
        <p>Compare our reading lamp to floor lamps costing 2 or 3 times more WITHOUT a proprietary light source ...</p>
        <p>... most come with only an incandescent bulb socket</p>
      </div>
      <div class="features-grid">
        <div class="lamp" v-if="+viewportWidth > 600">
          <div class="image">
            <img src="/assets/kis-floor-lamp-350x1000.webp" alt="" />
          </div>
        </div>
        <div class="lamp-features">
          <div class="feature swingarm f1">
            <div class="image">
              <img src="/assets/morelamplight-swingarm.webp" alt="" />
            </div>
            <p>Brass plated swing arm extends up to 6 inches</p>
          </div>
          <div class="feature shade f2">
            <div class="image">
              <img src="/assets/kis-floor-lamp-shade.webp" alt="" />
            </div>
            <p>Robust linen shade provides soft translucence and wide spread of illumination</p>
          </div>
          <div class="feature base f3">
            <div class="image">
              <img src="/assets/kis-floor-lamp-base.webp" alt="" />
            </div>
            <p>Extra heavy 9 lb. base</p>
          </div>
          <div class="feature column f4">
            <div class="image">
              <img src="/assets/morelamplight-dual-columns.webp" alt="" />
            </div>
            <p>
              Dual column allows lamp to be elevated in a range of heights from 43” to 58.” This allows you to increase
              the level of illumination while reducing glare in your line of sight.
            </p>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.product-features {
  // --bg-color: var(--color-neutral-99);
  // --text-color: var(--color-neutral-10);

  // @media (prefers-color-scheme: dark) {
  //   --text-color: var(--color-neutral-99);
  //   --bg-color: var(--color-neutral-20);
  // }

  // background-color: var(--bg-color);
  // color: var(--text-color);

  // color: var(--color-neutral-40);
  .container {
    padding-block: var(--size-4xl);
    display: grid;
    place-items: center;

    h2,
    p {
      text-align: center;
    }

    .features-grid {
      display: flex;
      gap: var(--space-xs);
      justify-content: space-between;
      align-items: stretch;

      .lamp {
        display: grid;
        place-items: center;
        background-color: var(--card-bg);
        padding: var(--size-s);
        box-shadow: var(--shadow-4);
        border-radius: var(--size-3xs);
        grid-column: 1 / 9;
      }

      .lamp-features {
        display: grid;
        grid-template-columns: repeat(6, fr);
        gap: var(--space-xs);

        .feature {
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          background-color: var(--card-bg);
          padding: var(--size-s);
          box-shadow: var(--shadow-4);
          border-radius: var(--size-3xs);

          p {
            // color: var(--color-neutral-40);
            font-size: var(--font-size--1);
            text-align: center;
          }

          &.f1 {
            grid-column: 1 / 3;
            grid-row: 1 / 2;
          }
          &.f2 {
            grid-column: 3 / 5;
            grid-row: 1 / 2;
          }
          &.f3 {
            grid-column: 5 / 7;
            grid-row: 1/ 2;
          }
          &.f4 {
            grid-column: 1 / 7;
            grid-row: 2 / 3;
            flex-direction: row;
            width: 100%;
            // display: flex;
            align-items: center;
            gap: var(--size-m);
          }
        }
      }
    }
  }

  &.resize1 {
    .features-grid {
      .lamp-features {
        .feature {
          &.f1 {
            grid-column: 1 / 4;
            grid-row: 1 / 2;
          }
          &.f2 {
            grid-column: 4 / 7;
            grid-row: 1 / 2;
          }
          &.f3 {
            grid-column: 1 / 4;
            grid-row: 2/ 2;
          }
          &.f4 {
            grid-column: 4 / 7;
            grid-row: 2 / 3;
            flex-direction: column;
            align-items: center;
            gap: var(--size-m);
          }
        }
      }
    }
  }

  &.resize2 {
    .features-grid {
      flex-direction: column;
    }
  }

  &.resize3 {
    .features-grid {
      flex-direction: column;

      .lamp-features {
        .feature {
          &.f1 {
            grid-column: 1 / 7;
            grid-row: 1 / 2;
          }
          &.f2 {
            grid-column: 1 / 7;
            grid-row: 2 / 3;
          }
          &.f3 {
            grid-column: 1 / 7;
            grid-row: 3 / 4;
          }
          &.f4 {
            grid-column: 1 / 7;
            grid-row: 4 / 5;
            align-items: center;
            gap: var(--size-m);
          }
        }
      }
    }
  }
}
</style>
