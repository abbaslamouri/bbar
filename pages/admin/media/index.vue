<script setup lang="ts">
import slugify from 'slugify'
import debounce from 'lodash.debounce'
import { IMedia } from '~/server/utils/schemas/media'
import { IParams, IAppData } from '~/server/utils/schemas/app'
// const { $swal } = useNuxtApp()
import { ISelectOption } from '~/server/utils/schemas/app'

definePageMeta({
  title: 'Media',
  description: 'ACS users',
  layout: 'admin',
})

// const defaultPerPage = 10
const { searchText, filter, page, perPage, sort, appFetch } = useHttp()
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
const alertRef = ref()

// const page = ref<number>(1)
// const perPage = ref<number>(defaultPerPage)
// const sort = ref({
//   dateCreated: 1,
//   //   field: '',
//   //   order: -1,
// })

const filterSelectOptions = [
  { value: '', text: 'All media' },
  { value: 'image', text: 'Images' },
  { value: 'csv', text: "CSV's" },
  { value: 'pdf', text: "PDF's" },
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
filter.value = 'image'
perPage.value = 10

const params = computed(() => {
  const params = {
    resource: 'media',
    // match: `name[$regex]=${searchText.value}, price[$lt]=1234`,
    match: {
      name: { $regex: searchText.value, $options: 'i' },
      mediaType: {
        $regex: filterSelectOptions.find((option: ISelectOption) => option.text === filter.value)?.value ?? '',
        $options: 'i',
      },
      //   ...filter.value,
    },
    sort: sort.value.field && sort.value.order ? { [sort.value.field]: sort.value.order } : null,
    page: page.value,
    perPage: perPage.value,
  }

  // const selectedFilterOption = filterSelectOptions.find((option: ISelectOption) => option.text === filter.value)

  // params.match = {
  //   ...params.match,
  //   mediaType: { $regex: (selectedFilterOption as ISelectOption)?.value ?? '', $options: 'i' },
  // }
  // filter.value = selectedValue?.value ?? ''

  // const filterObj =
  //   filter.value.field && filter.value.action && filter.value.text
  //     ? { [filter.value.field]: { [filter.value.action]: filter.value.text } }
  //     : null

  // if (filterObj) params.match = { ...params.match, ...filterObj }
  // if (searchText.value) params.match = { ...params.match, name: { $regex: searchText.value, $options: 'i' } }
  // params.match = JSON.stringify(params.match)

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

// $swal.fire({
//   title: 'Error!',
//   text: 'Do you want to continue',
//   icon: 'error',
//   confirmButtonText: 'Cool',
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
  // totalCount.value = (response.value as IAppData).totalCount
}

// provide('selectedFiles', selectedFiles)
// provide('searchText', searchText)
// provide('page', page)
// provide('perPage', perPage)
// provide('sort', sort)
provide('sortSelectOptions', sortSelectOptions)
provide('filterSelectOptions', filterSelectOptions)
provide('bulkSelect', bulkSelect)
provide('selectedItems', selectedFiles)
provide('media', (response.value as IAppData).docs)
// provide('totalCount', (response.value as IAppData).totalCount)

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
  console.log('heeeeee')
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

const toggleSelectAll = () => {
  if (selectedFiles.value?.length) selectedFiles.value = []
  else selectedFiles.value = (response.value as IAppData).docs as Array<IMedia>
  console.log('AAAAAA', selectedFiles.value)
}

const deleteSelected = async () => {
  if (!(await alertRef.value.alertConfirm('This cannot be undone'))) return
  // if (!confirm('Are you sure')) return
  console.log(selectedFiles.value)
  const errorMsgs: string[] = []

  // console.log('KKKKKK', await alertRef.value.alertConfirm())
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

// const removeFromSelected = (file: IMedia) => {
//   console.log('EEEEE', file)
//   const index = (selectedFiles.value as Array<IMedia>)?.findIndex((m: IMedia) => m._id == file._id)
//   console.log(index)
//   if (index !== -1) (selectedFiles.value as Array<IMedia>).splice(index as number, 1)
//   // else appApiErrorMsgs.value.push(`We were not able to delete ${file.originalName}`)
//   // (selectedFiles.value as Array<IMedia>).splice(1 as number, 1)
//   else (selectedFiles.value as Array<IMedia>).splice(1, 1)
// }

const updateFilterList = (event: string) => {
  console.log('EEEEE', event)
}

const updatePerPage = (event: number) => {
  console.log(event)
  page.value = 1
  perPage.value = event
}

const handleCloseDialog = () => {
  console.log('CCCCCCVVVVVVV')
}

watch(filter, () => {
  console.log('CHNFGG')
  page.value = 1
})
</script>

<template>
  <div class="flow-l">
    {{ filter }}
    <!-- {{ (response as IAppData).totalCount }}
    vvvvv= {{ filterSelectOptions.find((option: ISelectOption) => option.text === filter) }} -->
    <!-- {{ selectedFiles }} -->
    <!-- <v-toolbar color="pink" height="200">
      <v-toolbar-title class="text-h1">Media library</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn border elevation="1" icon="mdi-plus"></v-btn>
    </v-toolbar> -->
    <div class="px-5 pt-5 d-flex align-center justify-space-between">
      <h1 class="text-h5 text-sm-h4">Media library</h1>
      <!-- <v-spacer></v-spacer> -->
      <div>
        <v-btn prepend-icon="mdi-plus" size="x-large" color="primary" @click="openUploader = !openUploader">
          <template v-slot:prepend>
            <v-icon color="success"></v-icon>
          </template>
          Add
        </v-btn>

        <!-- <button class="btn btn-filled" @click="openUploader = !openUploader">
          <Icon class="icon" name="mdi:plus" aria-hidden="true" focusable="false" />Add
        </button> -->
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

    <!-- {{ bulkSelect }} -->

    <!-- <transition name="dropzone"> -->

    <!-- </transition> -->
    <AdminFilters
      @updateFilterList="updateFilterList"
      @toggleBulkSelect="bulkSelect = !bulkSelect"
      @toggleSelectAll="toggleSelectAll"
      @updatePerPage="updatePerPage"
      @deleteSelected="deleteSelected"
    />
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
    <div class="border d-flex justify-center align-center h-75" v-if="pending">
      <v-progress-circular :size="100" :width="7" color="primary" indeterminate></v-progress-circular>
    </div>
    <MediaList
      :media="(response as IAppData).docs"
      :totalCount="(response as IAppData).totalCount"
      :selectedFiles="selectedFiles"
      @handleClick="handleClick"
      v-else
    />

    <!-- <v-alert
      v-model="alert"
      border="start"
      variant="tonal"
      closable
      close-label="Close Alert"
      color="deep-purple-accent-4"
      title="Closable Alert"
    >
      Aenean imperdiet. Quisque id odio. Cras dapibus. Pellentesque ut neque. Cras dapibus. Vivamus consectetuer
      hendrerit lacus. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a
      orci. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci.
      Curabitur blandit mollis lacus. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo.
    </v-alert> -->

    <Alert ref="alertRef" />
  </div>
</template>

<style lang="scss" scoped>
.pending {
  // border: 1px solid red;
}
.admin-media-uploader {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--size-xl);

  .pending {
    border: 1px solid red;
  }
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
