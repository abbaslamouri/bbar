<script lang="ts" setup>
import debounce from 'lodash.debounce'
import { ICategory } from '~/server/schemas/category'

const { csrfFetch } = useCsrfStore()
const viewportWidth = useViewportWidth()
const config = useRuntimeConfig()
// const bp600 = 500

// console.log(useRouter().getRoutes())

const actionsRefs = ref<Array<boolean>>([])

const searchText = ref()
const searchResults = ref<Array<ICategory>>([])
const categories = ref<Array<ICategory>>([])

const { data, error } = await csrfFetch('ecommerce/categories/index', 'GET')
categories.value = data.value as Array<ICategory>
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

watch(
  searchText,
  debounce(async () => {
    const { data, error } = await csrfFetch(
      'search',
      'GET',
      {},
      {},
      { resource: 'categories', field: 'name', searchText }
    )
    console.log(data.value)
    categories.value = data.value as Array<ICategory>
    // searchText.value = ''
  }, 500)
)

watch(searchText, async () => {
  // setTimeout(async () => {
  // searchText.value = ''
  // }, 500)
})
</script>

<template>
  <div class="ecommerce categories list | flow-l">
    <div class="heading">
      <h1>Categories</h1>
      <div class="actions">
        <NuxtLink class="btn btn-filled" :to="{ name: 'admin-categories-_id', params: { _id: '_' } }">
          <Icon class="icon" name="mdi:plus" aria-hidden="true" focusable="false" />Add
        </NuxtLink>
        <button class="btn btn-filled">
          <Icon class="icon" name="ri:filter-2-line" aria-hidden="true" focusable="false" />
        </button>
      </div>
    </div>
    <div class="search">
      <form @submit.prevent="" action="">
        <FormsBaseInput
          type="text"
          label="Search"
          placeholder="Search"
          v-model="searchText"
          leadingIcon="ri:search-line"
          trailingIcon="ri:search-line"
        />
      </form>
      <div class="results">
        <ul role="list">
          <li v-for="(category, index) in searchResults" :key="category._id">
            {{ category.name }}
          </li>
        </ul>
      </div>
    </div>
    <table
      role="table"
      :class="{ stacked: viewportWidth < 600 }"
      v-if="categories && Array.isArray(categories) && categories.length"
    >
      <caption role="caption">
        Product categories
      </caption>
      <thead role="rowgroup">
        <tr role="row">
          <th role="cell">Category</th>
          <th role="cell">Slug</th>
          <th role="cell">Actions</th>
        </tr>
      </thead>
      <tbody role="rowgroup">
        <tr
          role="row"
          v-for="(category, index) in (categories as Array<ICategory>)"
          :key="category._id"
          :actionRefs="(el:any) => (actionsRefs[index] = false)"
        >
          <td role="cell" class="image-title" data-cell="">
            <div class="image">
              <img
                :src="`${config.public.s3BaseUrl}/${category.gallery[0]}`"
                :alt="`${category.name}`"
                v-if="category?.gallery && category?.gallery[0] && `${config.public.s3BaseUrl}/${category.gallery[0]}`"
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
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.categories.list {
  .heading {
    display: flex;
    justify-content: space-between;
    h1 {
      font-size: var(--font-size-2);
    }
  }
  .search {
    position: relative;
    .input {
    }

    .results {
      position: absolute;
      top: calc(100% + var(--size-xs));

      background-color: var(--color-neutral-99);
      border: 1px solid var(--color-neutral-90);
      width: 100%;
      max-height: var(--size-7xl);
      // border: 1px solid red;

      z-index: 99999;

      max-height: var(--size-8xl);
      overflow: auto;
      position: absolute;

      ul {
        li {
          padding: var(--space-xxs);
          cursor: pointer;

          &:hover {
            background-color: var(--color-primary-70);
          }
        }
      }
    }
  }
}
</style>
