<script setup lang="ts">
// import { useToast } from 'vue-toastification'
import { ICategory } from '~/server/utils/schemas/category'
import { IParams, IAppData } from '~/server/utils/schemas/app'

const props = defineProps({
  productCategories: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['updateProductCategories'])

const { authUser } = useAuthStore()

const searchText = ref('')
const categoryToAddId = ref('')

// const { searchText, page, perPage, sort, appFetch } = useHttp()

const { appApiErrorMsgs, parseAppApiErrors } = useAppErrors()
const config = useRuntimeConfig()

const localCategories = ref<Array<ICategory>>([...props.productCategories] as Array<ICategory>)

// const categories = ref<Array<ICategory>>([])

//   const results = await appFetch({
//   route: `categories`,
//   method: 'GET',
//   params: {
//     resource: 'categories',
//     lookup: JSON.stringify({
//       media: 'gallery',
//       categories: 'categories',
//     }),
//     limit: 100,
//   },
// })

const params = computed(() => {
  return {
    resource: 'categories',
    match: JSON.stringify({
      name: { $regex: searchText.value, $options: 'i' },
    }),
    lookup: JSON.stringify({
      media: 'gallery',
    }),
  }
})

const {
  data: response,
  error,
  pending,
  refresh,
} = await useFetch(`categories`, {
  baseURL: config.public.apiUrl as string,
  method: 'GET',
  headers: { ...useRequestHeaders(['cookie']), sessionId: authUser.value.sessionId },
  params,
})
if (error.value) {
  appApiErrorMsgs.value = error.value?.data?.data?.messages
} else {
  // console.log(response.value)
}

// const { data, error } = await useFetch(`ecommerce`, {
//   baseURL: config.public.apiUrl,
//   method: 'GET',
//   headers: { ...useRequestHeaders(['cookie']), sessionId: authUser.value.sessionId },
//   params: {
//     resource: 'categories',
//   },
//   // pick: ['_id', 'name'],
// })
// if (error.value) {
//   console.log(error.value.data)
//   // appApiErrorMsgs.value = error.value.data.data.messages
//   // useToast().error(parseAppApiErrors(), { timeout: 10000 })
// } else {
//   // console.log(data.value)
//   categories.value = data.value as Array<ICategory>
// }

const updateproductCategories = () => {
  // const newCategories = []
  // for (const categoryId of localCategoriesIds.value) {
  //   const found = categories.value.find((c: ICategory) => c._id == categoryId)
  //   if (found) newCategories.push(found)
  // }
  // emit('updateProductCategories', newCategories)
}

const removeCategory = (categoryId: string) => {
  // const index = (localCategoriesIds.value as string[]).findIndex((id: string) => id === categoryId)
  // console.log(index)
  // if (index !== -1) localCategoriesIds.value.splice(index, 1)
  // updateproductCategories()
}

const getAutocompleteItems = () => {
  const categories = (response.value as IAppData)?.docs as Array<ICategory>
  // console.log(categories)
  if (!categories) return
  const filtered = categories.map((c: ICategory) => {
    return { text: c.name ?? '', value: c._id ?? '' }
  })
  // console.log(filtered)
  return filtered
}

watch(localCategories, (newOption) => {
  // console.log(newOption)
  // emit('updateProductCategories', newOption)
  // updateproductCategories()
})

watch(categoryToAddId, (newVal) => {
  console.log(newVal)
  const index = ((response.value as IAppData)?.docs as Array<ICategory>).findIndex((c: ICategory) => c._id === newVal)
  console.log(index)
  if (index !== -1) localCategories.value.push(((response.value as IAppData)?.docs as Array<ICategory>)[index])
  emit('updateProductCategories', localCategories.value)
  // updateproductCategories()
  // emit('updateProductCategories', newOption)
  // updateproductCategories()
})
</script>

<template>
  <div class="section categories | flow-l" id="product-categories">
    <h2>Categories</h2>
    <div class="inner">
      <div class="selector">
        <FormsBaseAutocomplete
          v-model="categoryToAddId"
          label="Filter Categories"
          ariaLabelledBy="categoriesLabel"
          :selectOptions="getAutocompleteItems()"
          nullOption="Select category"
          @updateSearchText="searchText = $event"
        />
        <!-- <FormsBaseListbox
          v-model="localCategoriesIds"
          :selectOptions="
          ((response as IAppData)?.docs as Array<ICategory>).map((c:ICategory) => {
              return { text: c.name ?? '', value: c._id ?? ''}
            })
          "
          nullOption="Select category"
        /> -->
      </div>
      <div class="list">
        <ul role="list" v-if="productCategories.length">
          <li v-for="category in (productCategories as Array<ICategory>)" :key="category._id">
            <span>{{ category.name }}</span>
            <button @click.prevent="removeCategory(category._id as string)">
              <Icon class="" name="ri:close-line" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.categories {
  .inner {
    display: flex;
    gap: var(--size-xl);

    .selector {
      min-width: var(--size-9xl);

      // border: 1px solid red;
    }

    .list {
      flex: 1;
      // border: 1px solid red;

      ul {
        display: flex;
        flex-wrap: wrap;
        gap: var(--size-l);
        border: 1px solid var(--color-light);
        padding: var(--size-l);
        li {
          display: flex;
          span {
            background-color: var(--bg-grey);
            padding-inline: var(--size-l);
            padding-block: var(--size-3xs);
            border-radius: var(--size-2xs) 0 0 var(--size-2xs);
          }

          button {
            cursor: pointer;
            background-color: var(--color-primary);
            color: var(--bg);
            padding-inline: var(--size-s);
            padding-block: var(--size-3xs);
            border-radius: 0 var(--size-2xs) var(--size-2xs) 0;
            border: none;
          }
        }
      }
    }
  }
}
</style>
