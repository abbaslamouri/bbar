<script setup lang="ts">
import { IMedia } from '~/server/utils/schemas/media'
import { bytesFromNumber } from '~/server/utils/bytesFromNumber'

definePageMeta({
  title: 'Media',
  description: 'ACS users',
  layout: 'admin',
})

const { appFetch } = useHttp()
const viewportWidth = useViewportWidth()
const route = useRoute()
const config = useRuntimeConfig()
const { $toast } = useNuxtApp()
const loading = ref(true)

const file = ref<IMedia>({} as IMedia)

const results = await appFetch({
  route: `media/${route.params._id}`,
  method: 'GET',
  params: { resource: 'media' },
})

file.value = results as IMedia
loading.value = false

const handleDelete = async () => {
  if (!confirm('Are you sure')) return

  const results = await appFetch({
    route: `media/${route.params._id}`,
    method: 'DELETE',
    params: { resource: 'media', slug: file.value?.slug },
  })
  if (!results) return
  $toast(`${file.value?.originalName} deleted successfully`, { type: 'success' })
  return navigateTo({
    path: '/admin/media',
  })
}

const saveFile = async () => {
  const results = await appFetch({
    route: `media/${route.params._id}`,
    method: 'PUT',
    body: { ...file.value },
    params: { resource: 'media' },
  })
  if (!results) return
  $toast(`File ${file.value?.originalName} updated successfully`, { type: 'success' })
  return navigateTo({
    path: '/admin/media',
  })
}
</script>

<template>
  <div
    class="admin-media-edit"
    :class="{
      'break-point-1': viewportWidth <= 800,
      'break-point-2': viewportWidth <= 500,
    }"
  >
    <div class="container">
      <NuxtLink class="btn btn-text" :to="{ name: 'admin-media' }">
        <Icon class="icon" name="mdi:arrow-left-thin" aria-hidden="true" focusable="false" />Media library
      </NuxtLink>
      <div v-if="loading">
        <Icon class="spinner" name="svg-spinners:270-ring" aria-hidden="true" focusable="false" />
      </div>
      <AppErrors />
      <div class="content" v-if="file">
        <div class="file">
          <div class="image" v-if="file.mediaType.includes('image')">
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
        </div>
        <div class="details | flow-xl">
          <div class="flow-xs">
            <p class="name">
              <strong>{{ file.originalName }}</strong>
            </p>
            <p class="type">{{ file.mediaType }}</p>
            <p class="size">
              {{ bytesFromNumber(file.size) }}
            </p>
            <p class="url">
              {{ `${config.public?.s3BaseUrl}/${file.slug}` }}
            </p>
          </div>
          <form @submit.prevent="saveFile">
            <div class="alt-text">
              <FormsBaseInput
                type="text"
                label="Alternative Text"
                placeholder="Alternative Text"
                id="alt-text"
                v-model="file.altText"
              />
            </div>
            <button class="btn btn-filled">Save Alt text</button>
          </form>
          <button class="btn btn-outlined" @click="handleDelete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-media-edit {
  .content {
    display: flex;
    justify-content: center;
    gap: var(--size-l);
    .file {
      width: var(--size-12xl);
      height: var(--size-12xl);

      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.1);
      background-color: var(--card-bg);

      .image {
        width: 100%;
        height: 100%;
        img {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
      }

      .icon {
        width: var(--size-8xl);
        height: var(--size-8xl);
      }
    }

    .details {
      margin-block-start: var(--size-s);

      .name {
        font-size: var(--font-size-2);
      }
      form {
        display: flex;
        flex-direction: row;
        gap: var(--size-l);

        .alt-text {
          flex: 1;
        }
      }
    }
  }

  &.break-point-1 {
    .content {
      flex-direction: column;
      align-items: center;
    }
  }

  &.break-point-2 {
    .details {
      form {
        flex-direction: column;
        align-items: center;
        align-items: stretch;
      }
    }
  }
  // }
}
</style>
