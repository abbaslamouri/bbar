<script setup lang="ts">
import { IMedia } from '~/server/schemas/media'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const config = useRuntimeConfig()

const localImageGallery = ref([...props.modelValue.gallery])
const showMediaSelector = ref(false)
const mediaModalRef = ref()
const draggableElements = ref<Array<HTMLElement>>([])
const pickIndex = ref()

const toggleMediaSelector = () => {
  showMediaSelector.value = true
  mediaModalRef.value.showModal()
}

const setMediaGallery = (media: Array<IMedia>) => {
  console.log(media)
  for (const image of media) {
    const index = localImageGallery.value.findIndex((m: IMedia) => m._id === image._id)
    if (index === -1) localImageGallery.value.push(image)
  }
  mediaModalRef.value.close()
}

const dragStart = (index: number) => {
  pickIndex.value = index
  draggableElements.value[index].classList.add('dragging')
}

const drop = async (event: any, index: number) => {
  draggableElements.value[index].classList.remove('over')
  // }
  console.log(localImageGallery.value)
  console.log(pickIndex.value, index)
  const pickedElement = localImageGallery.value[pickIndex.value]
  const droppedElement = localImageGallery.value[index]
  localImageGallery.value[index] = pickedElement
  localImageGallery.value[pickIndex.value] = droppedElement
}

const removeImage = async (image: IMedia) => {
  console.log('DEL', image)
}

const mediaModalClosed = (event: any) => {
  // console.log('Cart Modal Closed', event)
}

const mediaModalCancelled = (event: any) => {
  // console.log('Cart Modal Cancelled', event)
}

watch(localImageGallery.value, () => {
  emit('update:modelValue', { ...props.modelValue, gallery: localImageGallery.value })
})
</script>

<template>
  <div>
    <div class="section gallery | flow-l" id="image-gallery">
      <h2>Image gallery</h2>
      <div class="flow-l">
        <button class="btn btn-filled" @click.prevent="toggleMediaSelector">Add images</button>
        <div>
          <ul class="" role="list">
            <li
              v-for="(image, index) in modelValue.gallery"
              class=""
              :key="image._id"
              @mouseenter="draggableElements[index].classList.add('hovered')"
              @mouseleave="draggableElements[index].classList.remove('hovered')"
              @dragleave="draggableElements[index].classList.remove('over')"
              @dragover.prevent="draggableElements[index].classList.add('over')"
              @drop="drop($event, index)"
              :ref="(el:any) => (draggableElements[index] = el)"
            >
              <p class="badge" draggable="false">{{ index + 1 }}</p>
              <p class="tooltip">{{ modelValue.gallery[index].name }}</p>
              <div
                class="thumb"
                draggable="true"
                @dragstart="dragStart(index)"
                @dragend="draggableElements[index].classList.remove('dragging')"
              >
                <img
                  :src="`${config.public.s3BaseUrl}/${image.slug}`"
                  :alt="`${modelValue.displayName} Image`"
                  draggable="false"
                />
              </div>

              <div class="actions">
                <button class="delete" @click="removeImage(image)">
                  <span class="visually-hidden">Delete</span>
                  <Icon class="icon" name="ri:delete-bin-3-line" aria-hidden="true" focusable="false" />
                </button>
                <button class="move" draggable="false">
                  <span class="visually-hidden">Move</span>
                  <Icon class="icon" name="ri:drag-move-2-fill" aria-hidden="true" focusable="false" />
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <dialog class="media-dialog" ref="mediaModalRef" @close="mediaModalClosed" @cancel="mediaModalCancelled">
      <LazyMediaSelector
        :gallery="modelValue.gallery"
        v-if="showMediaSelector"
        @mediaSelected="setMediaGallery"
        @cancel="mediaModalRef.close()"
      />
    </dialog>
  </div>
</template>

<style lang="scss" scoped>
.gallery {
  .image-title {
    height: var(--size-5xl);
  }
  ul {
    display: grid;
    gap: var(--size-l);
    grid-template-columns: repeat(4, minmax(0, 1fr));

    li {
      min-width: 100%;
      min-height: 100%;
      position: relative;
      border: 1px solid var(--on-bg-dim);
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;

      p {
        &.badge {
          position: absolute;
          top: 0;
          left: 0;
          transform: translate(-50%, -50%);
          width: var(--size-l);
          height: var(--size-l);
          background-color: var(--on-bg-dim);
          border-radius: 100%;
          display: grid;
          place-content: center;
          font-size: var(--font-size--1);
          color: var(--bg);
        }

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

      .thumb {
        display: flex;
        justify-content: center;
        align-items: center;
        // border: 1px solid green;

        img {
          // border: 1px solid red;
        }
      }

      button {
        position: absolute;
        cursor: pointer;
        visibility: hidden;
        opacity: 0;

        svg {
          width: var(--size-l);
          height: var(--size-l);
          color: var(--bg);
        }

        &.delete {
          top: 5%;
          right: 5%;

          svg {
            width: var(--size-l);
            height: var(--size-l);
          }
        }

        &.move {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: -1;
        }
      }

      &:first-of-type {
        grid-column: span 2;
        grid-row: span 2;

        button {
          svg {
            width: var(--size-2xl);
            height: var(--size-2xl);
          }
        }
      }

      &.hovered {
        background-color: var(--on-bg);
        // opacity: 0.7;
        p {
          &.tooltip {
            visibility: visible;
            opacity: 1;
          }
        }

        .thumb {
          img {
            opacity: 0.3;
          }
        }

        button {
          visibility: visible;
          opacity: 1;
        }
      }

      &.dragging {
        .thumb {
          opacity: 0.1;
        }

        button {
          visibility: hidden;
          opacity: 0;
        }
      }
      &.over {
        opacity: 0.3;
        border: 3px dashed var(--on-bg);
      }
    }
  }
}

:modal {
  &::backdrop {
    background-color: rgba(0 0 0 /0.5);
  }
}
</style>
