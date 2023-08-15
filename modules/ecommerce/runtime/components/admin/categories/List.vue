<script lang="ts" setup>
// import { useToast } from 'vue-toastification'
import debounce from 'lodash.debounce'
import { ICategory } from '~/server/utils/schemas/category'

const { appApiErrorMsgs, parseAppApiErrors } = useAppErrors()
const { authUser } = useAuthStore()
const viewportWidth = useViewportWidth()
const config = useRuntimeConfig()

const actionsRefs = ref<Array<boolean>>([])
const showFilterInput = ref(false)
const searchText = ref('')

const params = computed(() => {
  return {
    resource: 'categories',
    field: 'name',
    searchText: searchText.value,
    lookup: {
      from: 'media',
      localField: 'gallery',
      foreignField: '_id',
      as: 'gallery',
    },
  }
})

appApiErrorMsgs.value = []

const {
  data: categories,
  error,
  pending,
  refresh,
} = await useFetch(`ecommerce/search`, {
  baseURL: config.public.apiUrl,
  method: 'GET',
  headers: { ...useRequestHeaders(['cookie']), sessionId: authUser.value.sessionId },
  params,
})
if (error.value) {
  console.log(error.value.data)
  appApiErrorMsgs.value = error.value.data.data.messages
  // useToast().error(parseAppApiErrors(), { timeout: 10000 })
}
// console.log(categories.value)

const resetActions = (index: number) => {
  const currentState = actionsRefs.value[index] || false
  for (const prop in actionsRefs.value) {
    actionsRefs.value[prop] = false
  }
  actionsRefs.value[index] = currentState ? false : true
}

const handleEdit = (index: number) => {
  const category = (categories.value as Array<ICategory>)[index] || {}
  resetActions(index)
  return navigateTo({
    path: `/admin/categories/${category._id}`,
    query: {
      // _id:category._id,
    },
  })
}

const handleDelete = async (index: number) => {
  const category = (categories.value as Array<ICategory>)[index] || {}

  resetActions(index)

  const { data, error, pending } = await useFetch(`ecommerce/deleteById`, {
    baseURL: config.public.apiUrl,
    method: 'DELETE',
    headers: { ...useRequestHeaders(['cookie']), sessionId: authUser.value.sessionId },
    params: { resource: 'categories', _id: category._id },
  })
  if (error.value) {
    console.log(error.value.data)
    appApiErrorMsgs.value = error.value.data.data.messages
    // useToast().error(parseAppApiErrors(), { timeout: 10000 })
    // parseAppApiErrors()
  } else {
    console.log(data.value)
    // if (data.value) useToast().success(`Category ${category.name} deleted successfully `, { timeout: 10000 })
    // else useToast().error(`Unable to delete category ${category.name}`, { timeout: 10000 })
  }
  if (Array.isArray(categories.value) && categories.value.length) categories.value.splice(index, 1)
}

const updateList = debounce((event: string) => {
  searchText.value = event
}, 500)
</script>

<template>
  <div class="ecommerce admin list categories| flow-l">
    <!-- <div class="flow-xl"> -->
    <div class="heading">
      <h1>Categories</h1>
      <div class="actions">
        <button class="btn btn-svg" @click.prevent="showFilterInput = !showFilterInput">
          <Icon class="icon" name="ri:filter-2-line" aria-hidden="true" focusable="false" />
        </button>
        <NuxtLink class="btn btn-filled" :to="{ name: 'admin-categories-_id', params: { _id: '_' } }">
          <Icon class="icon" name="mdi:plus" aria-hidden="true" focusable="false" />Add
        </NuxtLink>
      </div>
    </div>
    <transition name="list-filter">
      <Filter class="filter" :searchText="searchText" v-if="showFilterInput" @updateList="updateList" />
    </transition>
    <div class="pending" v-if="pending">...loading</div>
    <div class="error" v-else-if="error">
      {{ parseAppApiErrors() }}
    </div>
    <table role="table" :class="{ stacked: viewportWidth < 600 }" v-else>
      <caption role="caption"></caption>
      <thead role="rowgroup">
        <tr role="row">
          <th role="cell">Category</th>
          <th role="cell">Slug</th>
          <th role="cell">Actions</th>
        </tr>
      </thead>
      <tbody role="rowgroup" v-if="categories && Array.isArray(categories) && categories.length">
        <tr
          role="row"
          v-for="(category, index) in (categories as Array<ICategory>)"
          :key="category._id"
          :actionRefs="(el:any) => (actionsRefs[index] = false)"
        >
          <td role="cell" class="image-title" data-cell="">
            <div class="image">
              <img
                :src="`${config.public.s3BaseUrl}/${category?.gallery?.[0]?.slug}`"
                :alt="`${category.name}`"
                v-if="category?.gallery?.[0]?.slug && `${config.public.s3BaseUrl}/${category?.gallery?.[0]?.slug}`"
              />
              <img src="/assets/placeholder.png" alt="Product Image Placeholder" v-else />
            </div>
            <p>{{ category.name }}</p>
          </td>
          <td role="cell" data-cell="true" data-name="slug">{{ category.slug }}</td>
          <td role="cell" data-cell="true" data-name="Actions">
            <AdminActions
              :showActions="actionsRefs[index]"
              @toggleAction="resetActions(index)"
              @edit="handleEdit(index)"
              @delete="handleDelete(index)"
            />
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="3" class="no-items">There no categories</td>
        </tr>
      </tbody>
    </table>
    <!-- </div> -->
  </div>
</template>

<style lang="scss" scoped></style>
