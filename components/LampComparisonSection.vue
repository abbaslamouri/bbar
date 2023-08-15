<script setup lang="ts">
const viewportWidth = useViewportWidth()
</script>

<template>
  <article class="lamp-comparison" :class="{ resize1: +viewportWidth < 800, resize2: +viewportWidth < 600 }">
    <div class="container flow-3xl">
      <div class="heading flow-2xs">
        <h2>You need LIGHT</h2>
        <p>This simple invention provides more light than a 250 watt 3-way bulb while saving you over $400</p>
      </div>
      <div class="lamps">
        <div class="lamp-type cfl">
          <div class="image">
            <!-- <div class="overlay">adadsasdads</div> -->
            <img src="/assets/cfl-lamp.webp" alt="" />
          </div>
          <div>
            <p>60 watt equivalent CFL (14 W)</p>
            <p>Most light is delivered out and up</p>
          </div>
        </div>
        <div class="lamp-type kis">
          <div class="image">
            <img src="/assets/kis-lamp.webp" alt="" />
          </div>
          <div>
            <p>morelamplight (32 W)</p>
            <p>Maximum light is delivered down and out</p>
          </div>
        </div>
        <div class="lamp-type led">
          <div class="image">
            <!-- <div class="overlay"></div> -->
            <img src="/assets/led-lamp.webp" alt="" />
          </div>
          <div>
            <p>60 watt equivalent LED (10 W)</p>
            <p>Most light is delivered out and up</p>
          </div>
        </div>
      </div>
      <div class="savings flow-s">
        <div class="inner">
          <div class="lamp kis">
            <h3>32 Watt morelamplight</h3>
            <div class="image">
              <img src="/assets/kis-module-250x250.webp" alt="" />
            </div>
            <ul class="flow-3xs" role="list">
              <li><Icon class="" name="mdi:check" /><span>Delivers a higher level of light</span></li>
              <li>
                <Icon class="" name="mdi:check" />
                <span>Energy cost over 15,000 hours only $52.80</span>
              </li>
              <li>
                <Icon class="" name="mdi:check" />
                <span>Environmentally friendly</span>
              </li>
            </ul>
            <p class="net-savings">Net Savings $400.70*</p>
          </div>
          <div class="lamp incandescent">
            <h3>250 Watt 3 Way Bulb</h3>
            <div class="image">
              <img src="/assets/3-way-incandescent-lamp.webp" alt="" />
            </div>
            <ul class="flow-3xs" role="list">
              <li><span>Bulb Cost $3.29 Each</span></li>
              <li>
                <span>Lasts 1200 hours</span>
              </li>
              <li>
                <span>Bulbs Cost over 15,000 hours: $41</span>
              </li>
              <li>
                <span>Energy Cost over 15,000 Hours: $412.50</span>
              </li>
              <li>
                <span>Total Cost of Light: $453.50</span>
              </li>
            </ul>
          </div>
        </div>
        <p class="extra-small">* based on 11¢/KWh</p>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.lamp-comparison {
  padding-block: var(--size-3xl);
  // color: var(--color-neutral-40);

  .container {
    .heading {
      display: grid;
      place-items: center;
      h2,
      p {
        text-align: center;
      }
    }
    .lamps {
      display: flex;
      align-items: center;
      gap: var(--size-l);

      .lamp-type {
        background-color: var(--bg-grey);
        padding: var(--size-m);
        box-shadow: var(--shadow-3);
        border-radius: var(--size-3xs);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--size-m);
        flex: 1;

        p {
          font-size: var(--font-size--1);
          text-align: center;

          &:first-child {
            font-weight: bold;
          }
        }

        &.kis {
          flex: 1.1;
          // order: 3;
        }
      }
    }

    .savings {
      // border: 1px solid green;
      // width: 100%;

      .inner {
        display: flex;
        gap: var(--size-l);
        // border: 1px solid green;
        justify-content: space-between;

        .lamp {
          border-radius: var(--size-4xs);
          padding: var(--size-l);
          box-shadow: var(--shadow-3);
          flex: 1;

          h3 {
            text-align: center;
          }

          .image {
            display: grid;
            place-content: center;
          }

          ul {
            // justify-content: flex-start;
            li {
              display: flex;
              align-items: center;
              gap: var(--space-xxs);
              // color: var(--color-neutral-40);
              font-size: var(--font-size--1);
            }
          }
          &.incandescent {
            // flex: 1;
            background-color: var(--card-bg);
          }

          &.kis {
            flex: 1.3;
            background-color: var(--bg-featured);
            // background-image: linear-gradient(to bottom, #f1f994, var(--color-primary-80));

            .net-savings {
              margin-block-start: var(--size-l);
              margin-inline-start: var(--size-m);
              color: var(--on-bg);
            }
          }
        }
      }
    }
  }

  &.resize2 {
    .container {
      .lamps {
        flex-direction: column;

        .lamp-type {
          &.kis {
            order: 1;
            // flex: 1.1;
          }
          &.cfl {
            order: 3;
            // flex: 1.1;
          }
          &.led {
            order: 2;
            // flex: 1.1;
          }
        }
      }
    }
  }

  &.resize1 {
    .container {
      .savings {
        .inner {
          flex-direction: column;
        }
      }
    }
  }
}
</style>
