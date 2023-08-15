<script lang="ts" setup>
const viewportWidth = useViewportWidth()

const installationSteps = [
  {
    image: 'lamp-socket.webp',
    content: 'Unplug your lamp. Remove your lampshade, harp and light bulb',
    altText: 'Lamp Harp',
  },
  {
    image: 'module-240X300.webp',
    content: 'Install the (4) Reader bulbs into the sockets',
    altText: 'Module',
  },
  {
    image: 'module-in-socket-240x300.webp',
    content: 'Screw module into your lamp socket',
    altText: 'Module Inside Socket',
  },
  {
    image: 'module-with-harp.webp',
    content: 'Insert Lamp harp (included)',
    altText: 'Module with Harp',
  },
  {
    image: 'module-top-view.webp',
    content: 'Slots in module align with harp.',
    altText: 'Module Top View',
  },
  {
    image: 'A15-A19-comparison.webp',
    content: 'Reader bulbs are 30% smaller for optical control',
    altText: 'A15 To A19 Lamp Comparison',
  },
  {
    image: 'dimmer-extension-unplugged.webp',
    content: 'Plug your lamp into outlet on the back of the dimmer plug. Dimmer cord length is 6 feet.',
    altText: 'Dimmer Extension Unplugged',
  },
  {
    image: 'dimmer-extension-plugged.webp',
    content: 'Plug the dimmer with your lamp’s plug installed into your outlet',
    altText: 'Dimmer Extension Plugged',
  },
  {
    image: 'dimmer-240X300.webp',
    content: 'Slide hand held dimmer for brightness control',
    altText: 'Dimmer',
  },
  {
    image: 'module-with-readers-and-booster.webp',
    content: 'For more focus and brightness on your task, try your LampLight Booster bulb.',
    altText: 'Lamp Harp',
  },
]
</script>

<template>
  <div
    class="learn | flow-3xl"
    :class="{
      'step-1': +viewportWidth < 1000,
      'step-2': +viewportWidth < 800,
      'step-3': +viewportWidth < 700,
      'step-4': +viewportWidth < 400,
    }"
  >
    <div class="how">
      <div class="container | flow-l">
        <div class="heading">
          <h1>How moreLamplight Replaces a light bulb</h1>
        </div>
        <div class="content">
          <div>
            <div class="image">
              <img src="/assets/lamp-harp.webp" alt="Lamp Socket" />
            </div>
            <p>8.5" harp included with order (Harp should be 8.5" or taller</p>
          </div>
          <div>
            <p>Shade size Minimum of 5” wide at top Minimum of 12” wide at bottom</p>
            <div class="image">
              <img src="/assets/small-shade-with-dimensions.webp" alt="Lamp Socket" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="installation">
      <div class="container | flow-l">
        <div class="heading | flow-s">
          <h2>Easy installation</h2>
          <p>
            It is not necessary to attach the dimmer if you will only use your lamp on high. However, you may like the
            convenience of a hand held switch.
          </p>
        </div>
        <div class="content">
          <ul role="list">
            <li v-for="(step, index) in installationSteps" key="step.image">
              <div class="step">{{ ('0' + (index + 1)).slice(-2) }}</div>
              <div class="content | flow-s">
                <div class="image">
                  <img :src="`/assets/${step.image}`" :alt="`${step.altText}`" />
                </div>
                <p>{{ step.content }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.learn {
  .how {
    background-color: var(--bg-grey);
    padding: var(--size-l);
    .heading {
      display: grid;
      place-items: center;
      h1 {
        font-size: var(--font-size-2);
        text-align: center;
      }
    }

    .content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--size-xl);

      border-radius: var(--size-s);
      & > * {
        display: flex;
        align-items: center;
        box-shadow: var(--shadow-3);
        background-color: var(--card-bg);
        padding: var(--size-s);
      }
    }
  }
  .installation {
    padding: var(--size-3xl);

    .heading {
      display: grid;
      place-items: center;

      p {
        text-align: center;
      }
    }
    ul {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--size-l);
      li {
        position: relative;
        box-shadow: var(--shadow-3);
        background-color: var(--card-bg);
        padding: var(--size-s);

        .step {
          position: absolute;
          top: 0;
          left: 0;
          font-size: var(--font-size-4);
          font-weight: var(--font-extrabold);
          opacity: 0.1;
          line-height: 0.9;
        }
        .content {
          display: grid;
          place-items: center;
          .image {
            width: var(--size-6xl);
            height: var(--size-6xl);
            place-self: end;

            img {
              max-width: 100%;
              max-height: 100%;
            }
          }

          p {
            text-align: center;
            font-size: var(--font-size--1);
          }
        }
      }
    }
  }
  &.step-1 {
    .installation {
      ul {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  }

  &.step-2 {
    .how {
      .content {
        grid-template-columns: 1fr;
      }
    }
  }

  &.step-3 {
    .installation {
      ul {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }

  &.step-4 {
    .installation {
      ul {
        grid-template-columns: 1fr;

        li {
          .image {
            place-self: center;
          }
        }
      }
    }
  }
}
</style>
