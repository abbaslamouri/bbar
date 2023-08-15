<script setup lang="ts">
import { IMedia } from '~/server/utils/schemas/media'

const props = defineProps({
  media: {
    type: Array,
    required: true,
  },
  // params: {
  //   type: Object,
  //   required: true,
  // },
  // bulkSelect: {
  //   type: Boolean,
  //   default: false,
  // },
  totalCount: {
    type: Number,
    default: 0,
  },
  selectedFiles: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['handleClick', 'removeFromSelected'])

const { searchText, page, perPage, sort, appFetch } = useHttp()
const viewportWidth = useViewportWidth()
const config = useRuntimeConfig()

const bulkSelect = inject('bulkSelect')
// const totalCount = Number(inject('totalCount'))
// const media = inject('media')
// const messages = [
//   {
//     from: 'You',
//     message: `Sure, I'll see you later.`,
//     time: '10:42am',
//     color: 'deep-purple-lighten-1',
//   },
//   {
//     from: 'John Doe',
//     message: 'Yeah, sure. Does 1:00pm work?',
//     time: '10:37am',
//     color: 'green',
//   },
//   {
//     from: 'You',
//     message: 'Did you still want to grab lunch today?',
//     time: '9:47am',
//     color: 'deep-purple-lighten-1',
//   },
// ]

const pageCount = computed(() => (perPage.value ? Math.ceil(props.totalCount / perPage.value) : 1))
</script>

<template>
  <div>
    <v-container>
      <v-row justify="center">
        <v-col
          v-for="(file, i) in (media as Array<IMedia>)"
          :key="file._id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          xl="2"
          class="col | d-flex child-flex"
          :class="{selected: bulkSelect && (selectedFiles as Array<IMedia>).find((m:IMedia) => m.slug===file.slug)}"
          @click.prevent="$emit('handleClick', file)"
        >
          <v-img
            :src="`${config.public?.s3BaseUrl}/${file?.slug}`"
            lazy-src="/assets/placeholder.png"
            contain
            aspect-ratio="1"
            class="text-white border"
            v-if="file.mediaType.includes('image')"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
              </v-row>
            </template>
            <v-tooltip activator="parent" location="top">{{ file.originalName }}</v-tooltip>
          </v-img>
          <v-img
            src="/assets/csv-thumbnail.png"
            lazy-src="/assets/placeholder.png"
            contain
            aspect-ratio="1"
            class="text-white border"
            v-else-if="file.mediaType.includes('csv')"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
              </v-row>
            </template>
            <v-tooltip activator="parent" location="top">{{ file.originalName }}</v-tooltip>
          </v-img>
          <v-img
            src="/assets/pdf-thumbnail.png"
            lazy-src="/assets/placeholder.png"
            contain
            aspect-ratio="1"
            class="text-white border"
            v-else-if="file.mediaType.includes('pdf')"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
              </v-row>
            </template>
            <v-tooltip activator="parent" location="top">{{ file.originalName }}</v-tooltip>
          </v-img>

          <!-- <div class="action"> -->
          <v-btn icon="mdi-check" class="action-icon check"> </v-btn>
          <v-btn icon="mdi-minus" class="action-icon minus"> </v-btn>
          <!-- <v-icon color="green-darken-2" icon="mdi-check" class="action-icon check"></v-icon> -->
          <!-- <v-icon color="green-darken-2" icon="mdi-minus" class="action-icon minus"></v-icon> -->
          <!-- </div> -->

          <!-- </template> -->

          <!-- <v-card-text> -->
          <!-- <div class="font-weight-bold ms-1 mb-2">Today</div> -->

          <!-- <v-timeline density="compact" align="start">
              <v-timeline-item
                v-for="message in messages"
                :key="message.time"
                :dot-color="message.color"
                size="x-small"
              >
                <div class="mb-4">
                  <div class="font-weight-normal">
                    <strong>{{ message.from }}</strong> @{{ message.time }}
                  </div>
                  <div>{{ message.message }}</div>
                </div>
              </v-timeline-item>
            </v-timeline> -->
          <!-- </v-card-text> -->
          <!-- </v-card> -->
        </v-col>
      </v-row>
      <div class="text-center" v-if="totalCount > perPage">
        <v-pagination v-model="page" :length="pageCount" :total-visible="5"></v-pagination>
      </div>
    </v-container>
    <!-- <div class="no-items" v-if="!media?.[0]">There is no media to display</div>
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
            </div>
            <div class="csv" v-else-if="file.mediaType.includes('csv')">
              <Icon name="teenyicons:csv-outline" aria-hidden="true" focusable="false" />
            </div>
            <div v-if="!file.uploading">
              <Icon class="check action" name="ri:check-line" aria-hidden="true" focusable="false" />
              <Icon class="substract action" name="ri:subtract-line" aria-hidden="true" focusable="false" />
            </div>
            <p class="tooltip">{{ file.originalName }}</p>
          </div>
        </li>
      </ul>
    </div>
    <LazyPagination
      class="pagination"
      :page="page"
      :perPage="perPage"
      :totalCount="totalCount"
      @updatePage="page = $event"
      v-if="totalCount > perPage"
    /> -->
  </div>
</template>

<style lang="scss" scoped>
.col {
  // border: 1px solid red;
  position: relative;
  cursor: pointer;

  &:hover {
    outline: 3px solid var(--color-primary);
  }

  .action-icon {
    position: absolute;
    top: -1%;
    right: -1%;
    // transform: translate(-60%, -30%);
    background-color: var(--color-neutral-99);
    width: var(--size-3xl);
    height: var(--size-3xl);
    border: 1px solid var(--color-primary-40);
    visibility: hidden;
    opacity: 0;

    // &.check {
    //   visibility: hidden;
    //   opacity: 0;
    // }

    // &.minus {
    //   visibility: hidden;
    //   opacity: 0;
    // }
  }

  &.selected {
    .action-icon {
      &.check {
        visibility: visible;
        opacity: 1;
      }

      &.minus {
        visibility: hidden;
        opacity: 0;
      }
    }

    &:hover {
      .action-icon {
        &.check {
          visibility: hidden;
          opacity: 0;
        }
        &.minus {
          visibility: visible;
          opacity: 1;
        }
      }
    }
  }

  // &:hover {
  //   // outline: 3px solid var(--color-primary);
  //   .action {
  //     &-icon {
  //       &.check {
  //         visibility: hidden;
  //         opacity: 0;
  //       }

  //       &.minus {
  //         visibility: visible;
  //         opacity: 1;
  //       }
  //     }
  //   }
  // }
}

// .media-list {
//   flex: 1;

//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   align-items: center;
//   gap: var(--size-xl);

//   .no-items {
//     display: flex;
//     justify-content: center;
//     font-size: var(--font-size-2);
//   }

//   .list {
//     flex: 1;

//     ul {
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       flex-wrap: wrap;
//       gap: var(--size-xl);

//       li {
//         .inner {
//           width: var(--size-8xl);
//           height: var(--size-8xl);
//           padding: var(--size-s);
//           position: relative;
//           cursor: pointer;
//           box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.1);
//           background-color: var(--card-bg);
//           display: flex;
//           justify-content: center;
//           align-items: center;

//           .image {
//             width: 100%;
//             height: 100%;
//             display: flex;
//             justify-content: center;
//             align-items: center;

//             img {
//               object-fit: contain;
//               width: 100%;
//               width: 100%;
//             }
//           }

//           // .pdf,
//           // .csv {
//           //   height: 100%;
//           //   display: flex;
//           //   flex-direction: column;
//           //   justify-content: center;
//           //   align-items: center;

//           //   svg {
//           //     width: var(--size-4xl);
//           //     height: var(--size-4xl);
//           //   }
//           // }

//           .icon {
//             &.action {
//               position: absolute;
//               top: 0;
//               left: 100%;
//               transform: translate(-60%, -30%);
//               background-color: var(--color-neutral-99);
//               width: var(--size-2xl);
//               height: var(--size-3xl);
//               border: 1px solid var(--color-primary-40);
//               visibility: hidden;
//               opacity: 0;
//             }
//             &.spinner {
//               width: var(--size-3xl);
//               height: var(--size-3x);
//             }
//           }

//           p {
//             &.tooltip {
//               position: absolute;
//               top: calc(-1 * var(--size-l));
//               left: 50%;
//               transform: translate(-50%, -50%);
//               width: max-content;
//               padding-inline: var(--size-xs);
//               padding-block: var(--space-xxs);
//               border-radius: var(--size-3xs);
//               background-color: var(--on-bg);
//               font-size: var(--font-size--1);
//               color: var(--bg);
//               visibility: hidden;
//               opacity: 0;
//               white-space: nowrap;

//               &::after {
//                 content: '';
//                 position: absolute;
//                 top: 100%;
//                 left: 50%;
//                 transform: translateX(-50%);
//                 width: 1rem;
//                 height: 1rem;

//                 border: 0.5rem solid transparent;
//                 border-top: 0.5rem solid var(--on-bg);
//               }
//             }
//           }
//         }
//         &.selected {
//           .inner {
//             outline: 3px solid var(--color-primary-40);

//             .icon {
//               &.action {
//                 visibility: hidden;
//                 opacity: 0;

//                 &.check {
//                   visibility: visible;
//                   opacity: 1;
//                 }
//               }
//             }

//     &:hover {
//       .icon {
//         &.action {
//           &.check {
//             visibility: hidden;
//             opacity: 0;
//           }

//           &.substract {
//             visibility: visible;
//             opacity: 1;
//           }
//         }
//       }
//     }
//   }
// }

//         &:hover {
//           .inner {
//             transform: scale(1.05);
//             transition: transform 250ms ease-in-out;

//             p {
//               &.tooltip {
//                 visibility: visible;
//                 opacity: 1;
//               }
//             }
//           }
//         }
//       }
//     }
//   }

//   &.breakpoint-1 {
//     .list {
//       ul {
//         flex-direction: column;

//         li {
//           .inner {
//             width: var(--size-10xl);
//             height: var(--size-10xl);
//           }
//         }
//       }
//     }
//   }
// }
</style>
