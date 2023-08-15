<script setup lang="ts">
import { PublicRuntimeConfig } from 'nuxt/schema'
import { IMedia } from '~/server/utils/schemas/media'

interface xx {
  s3BaseUrl: string
}

const props = defineProps({
  media: {
    type: Array,
    required: true,
  },
  params: {
    type: Object,
    required: true,
  },
  // page: {
  //   type: Number,
  //   default: 1,
  // },
  // perPage: {
  //   type: Number,
  //   default: 1,
  // },
  totalCount: {
    type: Number,
    default: 1,
  },
  selectedFiles: {
    type: Array,
    required: true,
  },
  bulkSelect: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['handleClick', 'updatePage'])

const config = useRuntimeConfig()

const pageCount = computed(() => Math.ceil(props.totalCount / props.params.perPage))

// const loadMoreRef = ref()

onMounted(() => {
  const options = { root: null, threshold: 0, rootMargin: '0px 0px 0px 0px' }
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        console.log('Intersection', entry.isIntersecting)
        // emit('loadMore')
        // page.value = page.value + 1
        // await fetchProducts()
      }
    })
  }, options)
  // if (loadMoreRef.value) observer.observe(loadMoreRef.value)
})
</script>

<template>
  <div class="media-list">
    <div class="no-items" v-if="!media?.[0]">There is no media to display</div>
    <div class="list" v-else>
      <ul role="list">
        <li
          :class="{selected: bulkSelect && (selectedFiles as Array<IMedia>).find((m:IMedia) => m.slug===file.slug)}"
          v-for="(file, i) in (media as Array<IMedia>)"
          :key="file._id"
          @click.prevent="$emit('handleClick', file)"
        >
          <div class="inner">
            <div v-if="file.uploading">
              <Icon class="spinner" name="svg-spinners:270-ring" aria-hidden="true" focusable="false" />
            </div>
            <div class="image" v-else-if="file.mediaType.includes('image')">
              <img
                :src="`${config.public?.s3BaseUrl}/${file?.slug}`"
                :alt="`${file.altText}`"
                v-if="file?.slug && `${config.public?.s3BaseUrl}/${file?.slug}`"
              />
              <img src="/assets/placeholder.png" alt="Product file Placeholder" v-else />
            </div>
            <div class="pdf" v-else-if="file.mediaType.includes('pdf')">
              <Icon name="teenyicons:pdf-outline" aria-hidden="true" focusable="false" />
              <!-- <p class="tooltip">{{ file.originalName }}</p> -->
            </div>
            <div class="csv" v-else-if="file.mediaType.includes('csv')">
              <Icon name="teenyicons:csv-outline" aria-hidden="true" focusable="false" />
              <!-- <p class="tooltip">{{ file.originalName }}</p> -->
            </div>
            <div v-if="!file.uploading">
              <Icon class="check action" name="ri:check-line" aria-hidden="true" focusable="false" />
              <Icon class="substract action" name="ri:subtract-line" aria-hidden="true" focusable="false" />
            </div>

            <p class="tooltip">{{ file.originalName }}</p>
          </div>
        </li>
      </ul>

      <!-- <div ref="loadMoreRef" v-if="page * perPage < totalCount">
        <Icon class="" name="svg-spinners:270-ring" aria-hidden="true" focusable="false" />
      </div> -->
    </div>
    <LazyPagination
      :params="params"
      :pageCount="pageCount"
      @updatePage="$emit('updatePage', $event)"
      v-if="pageCount > 1"
    />
  </div>
</template>

<style lang="scss" scoped>
.media-list {
  // border: 1px solid red;
  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--size-xl);
  // min-height: 100%;
  // max-width: 30rem;
  .no-items {
    display: flex;
    justify-content: center;
    font-size: var(--font-size-2);
  }

  .list {
    flex: 1;
    // border: 20px solid green;
    ul {
      display: flex;
      // flex-direction: column;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--size-xl);

      li {
        .inner {
          width: var(--size-8xl);
          height: var(--size-8xl);
          padding: var(--size-s);
          position: relative;
          cursor: pointer;
          box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.1);
          background-color: var(--card-bg);
          display: flex;
          justify-content: center;
          align-items: center;
          // border: 1px solid red;

          .image {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
              object-fit: contain;
              width: 100%;
              width: 100%;
            }
          }

          .pdf,
          .csv {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            svg {
              width: var(--size-4xl);
              height: var(--size-4xl);
            }
          }

          .icon {
            &.action {
              position: absolute;
              top: 0;
              left: 100%;
              transform: translate(-60%, -30%);
              background-color: var(--color-neutral-99);
              width: var(--size-2xl);
              height: var(--size-3xl);
              border: 1px solid var(--color-primary-40);
              visibility: hidden;
              opacity: 0;
            }
            &.spinner {
              width: var(--size-3xl);
              height: var(--size-3x);

              // border: 1px solid red;
            }
          }

          p {
            &.tooltip {
              position: absolute;
              top: calc(-1 * var(--size-l));
              left: 50%;
              transform: translate(-50%, -50%);
              width: max-content;
              padding-inline: var(--size-xs);
              padding-block: var(--space-xxs);
              border-radius: var(--size-3xs);
              background-color: var(--on-bg);
              font-size: var(--font-size--1);
              color: var(--bg);
              visibility: hidden;
              opacity: 0;
              white-space: nowrap;

              &::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                width: 1rem;
                height: 1rem;

                border: 0.5rem solid transparent;
                border-top: 0.5rem solid var(--on-bg);
              }
            }
          }
        }
        &.selected {
          .inner {
            outline: 3px solid var(--color-primary-40);

            .icon {
              &.action {
                visibility: hidden;
                opacity: 0;

                &.check {
                  visibility: visible;
                  opacity: 1;
                }
              }
            }

            &:hover {
              .icon {
                &.action {
                  &.check {
                    visibility: hidden;
                    opacity: 0;
                  }

                  &.substract {
                    visibility: visible;
                    opacity: 1;
                  }
                }
              }
            }
          }
        }

        &:hover {
          .inner {
            transform: scale(1.05);
            transition: transform 250ms ease-in-out;

            p {
              &.tooltip {
                visibility: visible;
                opacity: 1;
              }
            }
          }
        }
      }
    }
  }
}
</style>
