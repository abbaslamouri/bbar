<script setup lang="ts">
import slugify from 'slugify'
import debounce from 'lodash.debounce'
import { IMedia } from '~/server/utils/schemas/media'
import { IParams, IAppData } from '~/server/utils/schemas/app'
import { ConnectionPoolReadyEvent } from 'mongodb'
import { Console } from 'console'

definePageMeta({
  title: 'Media',
  description: 'ACS users',
  layout: 'admin',
})

// const defaultPerPage = 10
const { searchText, filter, page, perPage, sort, selectedItems, appFetch } = useHttp()
const { appApiErrorMsgs } = useAppErrors()
const viewportWidth = useViewportWidth()
const { authUser } = useAuthStore()
const config = useRuntimeConfig()
const { $toast } = useNuxtApp()

const selectedFiles = ref<Array<IMedia>>([])
const openUploader = ref(false)
// const searchText = ref('')
const mediaType = ref('')
// const searchText = ref('')
const bulkSelect = ref(false)
// const page = ref<number>(1)
// const perPage = ref<number>(defaultPerPage)
// const sort = ref({
//   dateCreated: 1,
//   //   field: '',
//   //   order: -1,
// })

const filterSelectOptions = [
  { value: 'mediaType', text: 'File Type' },
  { value: 'size', text: 'File size' },
  { value: 'AltText', text: 'Alt text' },
]

// const filterSelectOptions = ['File Type', 'File size', 'Alt text']

const sortSelectOptions = [
  { value: 'dateCreated', text: 'Date Created' },
  { value: 'name', text: 'Name' },
  { value: 'size', text: 'Size' },
]

// const sortSelectOptions = ['Date Created', 'Name', 'Size']

// const page = ref(1)
// const perPage = ref(20)
// const sort = ref({
//   field: '',
//   order: -1,
// })

sort.value = { field: 'dateCreated', order: 1 }

const params = computed(() => {
  const params = {
    resource: 'media',
    // match: `name[$regex]=${searchText.value}, price[$lt]=1234`,
    match: {
      // name: { $regex: searchText.value, $options: 'i' },
      // mediaType: { $regex: mediaType.value, $options: 'i' },
      //   ...filter.value,
    },
    sort: sort.value.field && sort.value.order ? { [sort.value.field]: sort.value.order } : null,
    page: page.value,
    perPage: perPage.value,
  }

  const filterObj =
    filter.value.field && filter.value.action && filter.value.text
      ? { [filter.value.field]: { [filter.value.action]: filter.value.text } }
      : null

  if (filterObj) params.match = { ...params.match, ...filterObj }
  params.match = JSON.stringify(params.match)

  return params
})

// const params = computed(() => {
//   return {
//     resource: 'media',
//     match: [
//       { name: { $regex: searchText.value, $options: 'i' } },
//       { mediaType: { $regex: mediaType.value, $options: 'i' } },
//     ],
//     // sort: sort.value.field ? { [sort.value.field]: sort.value.order } : null,
//     page: page.value,
//     perPage: perPage.value,
//   }
// })

const {
  data: response,
  error,
  pending,
  refresh,
} = await useFetch(`media`, {
  baseURL: config.public.apiUrl as string,
  method: 'GET',
  headers: { ...useRequestHeaders(['cookie']), sessionId: authUser.value.sessionId },
  params,
})
if (error.value) {
  // console.log(error.value.data)
  appApiErrorMsgs.value = error.value?.data?.data?.messages
} else {
  console.log(response.value)
}

// provide('selectedItems', selectedFiles)
// provide('searchText', searchText)
// provide('page', page)
// provide('perPage', perPage)
// provide('sort', sort)
provide('sortSelectOptions', sortSelectOptions)
provide('filterSelectOptions', filterSelectOptions)

const uploadMedia = async (files: FileList) => {
  console.log(Array.from(files))
  openUploader.value = false
  appApiErrorMsgs.value = []
  bulkSelect.value = false
  selectedFiles.value = []
  searchText.value = ''

  page.value = 1
  mediaType.value = ''
  // sort.value.field = ''
  // sort.value.order = -1

  let i = 0
  for (const file of Array.from(files)) {
    const newFile = {
      name: file.name.split('.')[0],
      slug: slugify(file.name, { lower: true }),
      originalName: file.name,
      mediaType: file.type,
      size: file.size,
      altText: '',
      dateCreated: new Date(),
      position: i,
      uploading: true,
    }
    if (Array.isArray((response.value as IAppData).docs))
      (response.value as IAppData).docs?.push({ ...(newFile as IMedia) })
    const results = await appFetch({
      route: `media`,
      method: 'POST',
      body: { ...newFile },
      params: { resource: 'media' },
    })
    if (!results) {
      const index = ((response.value as IAppData).docs as Array<IMedia>)?.findIndex((m: IMedia) => m.position === i)
      if (index && index !== -1) ((response.value as IAppData).docs as Array<IMedia>).splice(index, 1)
    } else {
      await $fetch((results as { insertedId: string; url: string })?.url as string, {
        method: 'PUT',
        headers: {
          'Content-Type': 'nultipart/form-data',
        },
        body: file,
      })
      const index = ((response.value as IAppData).docs as Array<IMedia>)?.findIndex((m: IMedia) => m.position === i)
      if (index && index !== -1) ((response.value as IAppData).docs as Array<IMedia>)[index].uploading = false
    }
    i++
  }

  if (!appApiErrorMsgs.value?.[0]) {
    $toast(`files uploaded successfully`, { type: 'success' })
  }
  refresh()
}

const handleClick = async (image: IMedia) => {
  if (!bulkSelect.value)
    return navigateTo({
      path: `/admin/media/${image._id}`,
    })

  const index = selectedFiles.value?.findIndex((m: IMedia) => m.slug === image.slug)
  if (index === -1) selectedFiles.value.push(image)
  else selectedFiles.value.splice(index, 1)
}

const handleDelete = async () => {
  if (!confirm('Are you sure')) return

  bulkSelect.value = false
  appApiErrorMsgs.value = []

  for (const file of selectedFiles.value) {
    const results = await appFetch({
      route: `media/${file._id}`,
      method: 'DELETE',
      params: { resource: 'media', slug: file.slug },
    })
    if (results) {
      const index = ((response.value as IAppData).docs as Array<IMedia>)?.findIndex((m: IMedia) => m.slug === file.slug)
      if (index !== -1) ((response.value as IAppData).docs as Array<IMedia>).splice(index as number, 1)
      else appApiErrorMsgs.value.push(`We were not able to delete ${file.originalName}`)
    }
  }
  if (!appApiErrorMsgs.value?.[0]) {
    $toast(`files deleted successfully`, { type: 'success' })
    refresh()
  }
}

const handleSelectAll = () => {
  if (selectedFiles.value.length) selectedFiles.value = []
  else selectedFiles.value = [...((response.value as IAppData).docs as Array<IMedia>)]
}

const toggleSelectAll = () => {
  // console.log('AAAAAA', selectedProducts.value)
  if (selectedFiles.value?.length) selectedFiles.value = []
  else selectedFiles.value = (response.value as IAppData).docs as Array<IMedia>
}

const handleDeleteAll = async () => {
  if (!confirm('Are you sure')) return
  console.log(selectedFiles.value)
  const errorMsgs: string[] = []
  // Promise.all(
  //   selectedFiles.value.map(async (product) => {
  //     const deletedCount = await deleteOne(product)
  //     console.log('DC', deletedCount)
  //     if (deletedCount !== 1) {
  //       errorMsgs.push(`Unable to delete product ${product.name}`)
  //     } else {
  //       let index = selectedFiles.value.findIndex((p: IProduct) => p._id === product._id)
  //       if (index !== -1) selectedFiles.value.splice(index, 1)
  //     }
  //   })
  // )
  // if (errorMsgs.length) appApiErrorMsgs.value = errorMsgs
  // else $toast(`Selected products deleted succesfully`, { type: 'success', duration: 5 })
  // console.log('FFFFF', selectedFiles.value)
  // refresh()
}

const updateFilterList = (event: string) => {
  console.log('EEEEE', event)
}

const updatePerPage = (event: number) => {
  console.log(event)
  page.value = 1
  perPage.value = event
}
</script>

<template>
  <div class="flow-l">
    <div class="d-flex align-center justify-space-between">
      <h1 class="text-h5 text-sm-h4">Media library</h1>
      <!-- <v-spacer></v-spacer> -->
      <div class="">
        <button class="btn btn-filled" @click="openUploader = !openUploader">
          <Icon class="icon" name="mdi:plus" aria-hidden="true" focusable="false" />Add
        </button>
      </div>
    </div>

    <v-dialog v-model="openUploader" width="auto">
      <v-card>
        <v-card-text>
          <MediaDropzone
            :openUploader="openUploader"
            @closeUPloadMedia="openUploader = false"
            @uploadMedia="uploadMedia"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="openUploader = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- <transition name="dropzone"> -->

    <!-- </transition> -->
    <!-- <AdminFilters
      @updateFilterList="updateFilterList"
      @toggleSelectAll="toggleSelectAll"
      @updatePerPage="updatePerPage"
      @handleDeleteAll="handleDeleteAll"
    /> -->
    <!-- <MediaFilters
      :bulkSelect="bulkSelect"
      :mediaType="mediaType"
      :perPage="perPage"
      @filterMedia="mediaType = $event"
      @updateSort="sort = $event"
      @toggleSelectAll="handleSelectAll"
      @updatePerPage="perPage = $event"
      @handleBulkSelect="
        () => {
          bulkSelect = !bulkSelect
          selectedFiles = []
        }
      "
      @handleDelete="handleDelete"
    /> -->
    <AppErrors />
    <div class="pending" v-if="pending">...loading</div>
    <MediaList
      :media="(response as IAppData).docs"
      :totalCount="(response as IAppData).totalCount"
      :selectedFiles="selectedFiles"
      :bulkSelect="bulkSelect"
      @handleClick="handleClick"
      @updatePage="page = $event"
      v-else
    />
  </div>
</template>

<style lang="scss" scoped>
.admin-media-uploader {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--size-xl);
  .heading {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h1 {
      font-size: var(--font-size-2);
    }
  }

  &.breakpoint-1 {
    .heading {
      justify-content: flex-start;
      gap: var(--size-3xl);
    }
  }
}
</style>
