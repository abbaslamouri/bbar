<script setup lang="ts">
// import type { PropType } from 'vue'
import { IMedia } from '~/server/utils/schemas/media'
import { IParams, IAppData } from '~/server/utils/schemas/app'

const props = defineProps({
  gallery: {
    type: Array,
    default: [],
  },
})

const emit = defineEmits(['mediaSelected', 'cancel'])
const { appFetch } = useHttp()

// const { csrfFetch } = useCsrfStore()
const config = useRuntimeConfig()
const media = ref<Array<IMedia>>([])
const selectedMedia = ref<Array<IMedia>>([])

// const params = computed(() => {
//   const params: IParams = {
//     resource: 'media',
//     // match: {
//     //   $and: [{ name: { $regex: searchText.value } }, { $or: [{ mediaType: { $regex: mediaType.value } }] }],
//     // },
//     // page: page.value,
//     // perPage: perPage.value,
//   }

//   // if (sort.value.field && (sort.value.order === -1 || sort.value.order === 1))
//   //   params.sort = { [sort.value.field]: sort.value.order }
//   // else delete params.sort

//   return params
// })

const results = await appFetch({
  route: `media`,
  method: 'GET',
  params: { resource: 'media', match: { mediaType: { $regex: 'image' } } },
})
if (results) media.value = (results as IAppData)?.docs as Array<IMedia>

// const {
//   data: response,
//   error,
//   pending,
//   refresh,
// } = await useFetch(`media`, {
//   baseURL: config.public.apiUrl as string,
//   method: 'GET',
//   headers: { ...useRequestHeaders(['cookie']), sessionId: authUser.value.sessionId },
//   params,
// })
// if (error.value) {
//   // console.log(error.value.data)
//   appApiErrorMsgs.value = error.value?.data?.data?.messages
// } else {
//   // console.log(response.value)
// }

// const { data, error } = await csrfFetch(`media`, 'GET')
// media.value = data.value as Array<IMedia>
// console.log('DATA', media.value)

const updatedSelectedMedia = (image: IMedia) => {
  const index = selectedMedia.value.findIndex((m: IMedia) => m._id === image._id)
  if (index === -1) selectedMedia.value.push(image)
  else selectedMedia.value.splice(index, 1)
}

const emitSelectedMedia = () => {
  emit('mediaSelected', selectedMedia.value)
  selectedMedia.value = []
}

const isSelected = (image: IMedia) => {
  const index = (props.gallery as Array<IMedia>).findIndex((m: IMedia) => m._id === image._id)
  if (index === -1) return false
  else return true
}
</script>

<template>
  <div class="media-list | flow-2xl">
    <ul role="list">
      <li v-for="image in (media as Array<IMedia>)" :key="image._id">
        <button @click.prevent="updatedSelectedMedia(image)" :disabled="isSelected(image) ? true : false">
          <img :src="`${config.public.s3BaseUrl}/${image.slug}`" :alt="`${image.altText} Image`" />
          <Icon
            class="icon"
            name="mdi:check"
            aria-hidden="true"
            focusable="false"
            v-if="selectedMedia.find((m:IMedia)=> m._id===image._id) || isSelected(image)"
          />
        </button>
      </li>
    </ul>
    <div class="actions">
      <button class="btn btn-outlined" @click.prevent="$emit('cancel')">Cancel</button>
      <button class="btn btn-filled" @click.prevent="emitSelectedMedia">Select</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.media-list {
  height: 90vh;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ul {
    overflow-y: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--size-l);
    // border: 5px solid blue;
    padding: var(--size-l);

    li {
      box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.1);
      background-color: var(--card-bg);

      button {
        width: var(--size-9xl);
        height: var(--size-9xl);
        cursor: pointer;
        position: relative;

        &:disabled {
          cursor: not-allowed;

          &::after {
            content: '';
            position: absolute;
            inset: 0;
            background-color: var(--on-bg);
            opacity: 0.6;
          }
        }

        img {
          object-fit: contain;
          max-width: 100%;
          max-height: 100%;
        }
        .icon {
          z-index: 1;
          position: absolute;
          top: 0;
          right: 0;
          width: var(--size-3xl);
          height: var(--size-3xl);
          color: var(--card-bg);
          background-color: var(--bg-highlight);
        }
      }
    }
  }

  .actions {
    align-self: flex-end;
    display: flex;
    gap: var(--size-l);
  }
}
</style>
