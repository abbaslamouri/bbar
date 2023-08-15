<script setup lang="ts">
// import { useToast } from 'vue-toastification'
import { ICategory } from '~/server/utils/schemas/category'

const props = defineProps({
  productCategories: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['updateProductCategories'])

const { authUser } = useAuthStore()
const { appApiErrorMsgs, parseAppApiErrors } = useAppErrors()
const config = useRuntimeConfig()

const localCategoriesIds = ref((props.productCategories as Array<ICategory>).map((c: ICategory) => c._id))

const categories = ref<Array<ICategory>>([])

const { data, error } = await useFetch(`ecommerce`, {
  baseURL: config.public.apiUrl,
  method: 'GET',
  headers: { ...useRequestHeaders(['cookie']), sessionId: authUser.value.sessionId },
  params: {
    resource: 'categories',
  },
  // pick: ['_id', 'name'],
})
if (error.value) {
  console.log(error.value.data)
  // appApiErrorMsgs.value = error.value.data.data.messages
  // useToast().error(parseAppApiErrors(), { timeout: 10000 })
} else {
  // console.log(data.value)
  categories.value = data.value as Array<ICategory>
}

const updateproductCategories = () => {
  const newCategories = []
  for (const categoryId of localCategoriesIds.value) {
    const found = categories.value.find((c: ICategory) => c._id == categoryId)
    if (found) newCategories.push(found)
  }
  emit('updateProductCategories', newCategories)
}

const removeCategory = (categoryId: string) => {
  const index = (localCategoriesIds.value as string[]).findIndex((id: string) => id === categoryId)
  console.log(index)
  if (index !== -1) localCategoriesIds.value.splice(index, 1)
  updateproductCategories()
}

watch(localCategoriesIds, () => {
  updateproductCategories()
})
</script>

<template>
  <div class="section categories | flow-l" id="product-categories">
    <h2>Categories</h2>
    <div class="inner">
      <div class="selector">
        <FormsBaseListbox
          v-model="localCategoriesIds"
          :selectOptions="
            categories.map((c:ICategory) => {
              return { text: c.name ?? '', value: c._id ?? ''}
            })
          "
          nullOption="Select category"
        />
      </div>
      <div class="list">
        <ul role="list">
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
    }

    .list {
      flex: 1;
      // border: 1px solid red;

      ul {
        display: flex;
        gap: var(--size-l);
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
            background-color: var(--on-bg-dim);
            color: var(--bg);
            padding-inline: var(--size-s);
            padding-block: var(--size-3xs);
            border-radius: 0 var(--size-2xs) var(--size-2xs) 0;
          }
        }
      }
    }
  }
}
</style>
