<script setup lang="ts">
import { IMedia } from '~/server/utils/schemas/media'

const props = defineProps({
  gallery: {
    type: Array,
    required: true,
  },
})
const emit = defineEmits(['updateGallery', 'removeImage'])

const config = useRuntimeConfig()

const localImageGallery = ref(props.gallery)
const showMediaSelector = ref(false)
const mediaModalRef = ref()
const draggableElements = ref<Array<HTMLElement>>([])
const pickIndex = ref()

const toggleMediaSelector = () => {
  showMediaSelector.value = true
  mediaModalRef.value.showModal()
}

const setMediaGallery = (media: Array<IMedia>) => {
  for (const image of media) {
    const index = (localImageGallery.value as Array<IMedia>).findIndex((m: IMedia) => m._id === image._id)
    if (index === -1) localImageGallery.value.push(image)
  }
  mediaModalRef.value.close()
}

const dragStart = (index: number) => {
  pickIndex.value = index
  console.log(index)
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
  const index = (localImageGallery.value as Array<IMedia>).findIndex((m: IMedia) => m._id === image._id)
  if (index !== -1) {
    localImageGallery.value.splice(index, 1)
    draggableElements.value.splice(index, 1)

    // for (let j = index; j < draggableElements.value.length; j++) {
    //   draggableElements.value[index] = draggableElements.value[index + 1]
    // }
    // draggableElements.value = draggableElements.value.filter((item: any) => {
    //   console.log(item)
    //   return item != null
    // })
    // draggableElements.value[draggableElements.value.length + 1] = draggableElements.value[index]
    console.log(draggableElements.value)
  }
  // emit('removeImage', image._id)
}

const mediaModalClosed = (event: any) => {
  // console.log('Cart Modal Closed', event)
}

const mediaModalCancelled = (event: any) => {
  // console.log('Cart Modal Cancelled', event)
}

watch(localImageGallery.value, () => {
  console.log('LLLLLLLL')
  emit('updateGallery', localImageGallery.value)
})
</script>

<template>
  <div>
    <div class="section gallery | flow-l" id="image-gallery">
      <h2>Image gallery</h2>
      <div class="flow-l">
        <button type="button" class="btn btn-filled" @click="toggleMediaSelector">Add images</button>
        <div>
          <ul class="" role="list">
            <template v-for="(image, index) in (localImageGallery as Array<IMedia>)" :key="image._id">
              <li
                class=""
                @mouseenter="draggableElements?.[index]?.classList.add('hovered')"
                @mouseleave="draggableElements?.[index]?.classList.remove('hovered')"
                @dragleave="draggableElements?.[index]?.classList.remove('over')"
                @dragover.prevent="draggableElements?.[index]?.classList.add('over')"
                @drop="drop($event, index)"
                :ref="(el:any) => (draggableElements[index] = el)"
              >
                <div class="visually-hidden">
                  {{ !!draggableElements[index] }}
                </div>
                <p class="badge" draggable="false">{{ index + 1 }}</p>
                <p class="tooltip">{{ image.name }}</p>
                <div
                  class="thumb"
                  draggable="true"
                  @dragstart="dragStart(index)"
                  @dragend="draggableElements?.[index]?.classList.remove('dragging')"
                >
                  <img
                    :src="`${config.public.s3BaseUrl}/${image.slug}`"
                    :alt="`${image.name} Image`"
                    draggable="false"
                  />
                </div>

                <div class="actions">
                  <button class="delete" @click.prevent="removeImage(image)">
                    <span class="visually-hidden">Delete</span>
                    <Icon class="icon" name="ri:delete-bin-3-line" aria-hidden="true" focusable="false" />
                  </button>
                  <button class="move" draggable="false">
                    <span class="visually-hidden">Move</span>
                    <Icon class="icon" name="ri:drag-move-2-fill" aria-hidden="true" focusable="false" />
                  </button>
                </div>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>

    <dialog class="media-dialog" ref="mediaModalRef" @close="mediaModalClosed" @cancel="mediaModalCancelled">
      <LazyMediaSelector
        :gallery="gallery"
        v-if="showMediaSelector"
        @mediaSelected="setMediaGallery"
        @cancel="mediaModalRef.close()"
      />
    </dialog>
  </div>
</template>

<style lang="scss" scoped>
.gallery {
  // .image-title {
  //   height: var(--size-5xl);
  // }

  ul {
    display: grid;
    gap: var(--size-xl);
    grid-template-columns: repeat(5, minmax(0, 1fr));

    // border: 1px solid green;

    li {
      // width: var(--size-8xl);
      // height: var(--size-8xl);
      aspect-ratio: 1;
      position: relative;
      border: 1px solid var(--on-bg-dim);
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;

      // border: 1px solid red;

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
        width: 100%;
        height: 100%;

        // border: 1px solid green;

        img {
          // aspect-ratio: 1;
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
