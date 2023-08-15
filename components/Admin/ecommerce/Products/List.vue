<script setup lang="ts">
import { IProduct } from '~/server/utils/schemas/product'
import { useDisplay } from 'vuetify'

const props = defineProps({
  tableCaption: {
    type: String,
    default: '',
  },
  totalCount: {
    type: Number,
    default: 0,
  },

  products: {
    type: Object,
    required: true,
  },
  bulkSelect: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['deleteItem'])

const { searchText, filter, page, perPage, sort, selectedItemsIds, updateSelectedItems, appFetch } = useHttp()

const config = useRuntimeConfig()

const { width, thresholds } = useDisplay()
// const stackedBp = vuetifyDisplay.sm

// const th = vuetifyDisplay?.thresholds

// const selectedItems = inject('selectedItems') as Ref<IProduct[]>

// console.log((selectedItems.value as Array<IProduct>))
// const localSelectedItems = ref([...selectedItems.value])
// const actionsRefs = ref<boolean[]>([])

const pageCount = computed(() => (perPage.value ? Math.ceil(props.totalCount / perPage.value) : 1))

// onMounted(() => {
//   for (const prop in props.products) {
//     actionsRefs.value.push(false)
//   }
// })

// const resetActions = (index: number) => {
//   const currentState = actionsRefs.value[index] || false
//   for (const prop in actionsRefs.value) {
//     actionsRefs.value[prop] = false
//   }
//   actionsRefs.value[index] = currentState ? false : true
// }

// const handleEdit = (index: number) => {
//   // resetActions(index)
//   emit('edit', index)
// }

// const handleDelete = async (index: number) => {
//   // resetActions(index)
//   emit('delete', index)
// }

// watch(
//   localSelectedItems,
//   () => {
//     emit('updateSelectedItems')
//     // page.value = 1
//   },
//   { deep: true }
// )
</script>

<template>
  <div>
    <!-- {{ $vuetify.display.width }} -->

    <!-- {{ localSelectedItems }} -->
    <table role="table" class="admin-list" :class="{ stacked: width < thresholds.md }">
      <caption role="caption" v-if="tableCaption">
        {{
          tableCaption
        }}
      </caption>
      <thead role="rowgroup">
        <tr role="row">
          <th></th>
          <th role="cell">Product</th>
          <th role="cell">Price</th>
          <th role="cell">Sale Price</th>
          <th role="cell">Featured</th>
          <th role="cell">Actions</th>
        </tr>
      </thead>
      <tbody role="rowgroup">
        <tr role="row" v-for="(product, index) in (products as Array<IProduct>)" :key="product._id">
          <td class="align-center">
            <v-checkbox
              v-model="selectedItemsIds"
              color="primary"
              :value="product._id"
              hide-details
              v-if="bulkSelect"
              @update:modelValue="updateSelectedItems(product)"
            ></v-checkbox>
            <!-- <input
              type="checkbox"
              :checked="(selectedItems as Array<IProduct>).find((item)=> item._id===product._id)? true: false"
              @change="$emit('updateSelectedItem', product)"
            /> -->
          </td>
          <td role="cell" class="image-title" data-cell="">
            <div class="thumb">
              <img
                :src="`${config.public.s3BaseUrl}/${product.gallery?.[0]?.slug}`"
                :alt="`${product.name}`"
                v-if="product.gallery?.[0]?.slug && `${config.public.s3BaseUrl}/${product.gallery?.[0]?.slug}`"
              />
              <img src="/assets/placeholder.png" alt="Product Image Placeholder" v-else />
            </div>
            <p class="title">{{ product.name }}</p>
          </td>
          <td class="price" role="cell" data-cell="true" data-name="price">${{ (product.price / 100).toFixed(2) }}</td>
          <td class="price" role="cell" data-cell="true" data-name="sale price">
            ${{ (product?.salePrice! / 100).toFixed(2) }}
          </td>
          <td role="cell" class="featured" data-cell="true" data-name="featured">
            <v-icon icon="mdi-star" color="primary" v-if="product.featured"></v-icon>
            <!-- <Icon :class="{ featuredxxxxxxx: product.featured }" v-if="product.featured" name="ri:star-fill" /> -->
            <!-- <Icon name="ri:star-line" v-else /> -->
            <v-icon icon="mdi-star-outline" color="primary" v-else></v-icon>
          </td>
          <td role="cell">
            <div class="actions">
              <v-btn variant="text" prepend-icon="mdi-pencil-outline">
                <template v-slot:prepend>
                  <v-icon color="success"></v-icon>
                </template>
              </v-btn>
              <v-btn variant="text" prepend-icon="mdi-trash-can-outline" @click="$emit('deleteItem', product)">
                <template v-slot:prepend>
                  <v-icon color="error"></v-icon>
                </template>
              </v-btn>
            </div>

            <!-- <AdminActions
              :showActions="actionsRefs[index]"
              @toggleAction="resetActions(index)"
              @edit="handleEdit(index)"
              @delete="handleDelete(index)"
            /> -->
          </td>
        </tr>
      </tbody>
    </table>

    <div class="text-center" v-if="totalCount > perPage">
      <v-pagination v-model="page" :length="pageCount" :total-visible="5"></v-pagination>
    </div>
  </div>
</template>

<style lang="scss" scoped>
table {
  // border: 10px solid red;
  width: 100%;
  // font-size: var(--font-size--1);

  // box-shadow: var(--shadow-3);
  // background-color: var(--card-bg);
  // padding: var(--space-xs);

  caption {
    font-size: var(--font-size-1);
    text-align: start;
    padding: var(--size-s);
    text-transform: uppercase;
  }

  tr {
    &:nth-child(odd) {
      background-color: var(--color-neutral-95);
    }
  }
  th,
  td {
    padding-block: var(--space-xs);
    // text-align: start;
    // font-size: var(--font-size-0);
    // border: 1px solid red;

    &:first-child {
      text-align: center;
      width: var(--size-4xl);
      // border: 1px solid red;
    }

    &.featured {
      // border: 1px solid red;
      width: var(--size-4xl);
      text-align: center;
      // width: max-content;
    }

    &.price {
      // border: 1px solid red;
      width: var(--size-8xl);
      text-align: center;
    }

    &:last-child {
      text-align: enter;
      width: var(--size-10xl);
      // border: 1px solid red;

      .actions {
        display: flex;
        gap: var(--size-xs);
        // border: 1px solid red;
        justify-content: center;
      }
    }
  }

  th {
    background-color: var(--color-neutral-50);
    color: var(--color-neutral-99);
  }

  td {
    padding-block: var(--size-s);
    // padding-inline: var(--size-l);
    input[type='checkbox'] {
      width: var(--size-l);
      height: var(--size-l);
      cursor: pointer;
      // border: 1px solid red;
    }

    &.image-title {
      display: flex;
      align-items: center;
      gap: var(--space-xs);

      // border: 1px solid green;
      .thumb {
        width: var(--size-4xl);
        height: var(--size-4xl);

        // border: 1px solid red;
        display: flex;
        justify-content: center;
        // display: grid;
        // place-content: center;

        img {
          object-fit: contain;
          height: 100%;
          width: 100%;
          // border: 1px solid green;
          // border: 1px solid red;
        }
      }
    }

    .title {
      font-size: var(--font-size-1);
      font-weight: var(--font-bold);
      color: var(--color-primary-20);
    }

    // padding: var(--space-xs);

    // &.actions {
    //   button {
    //     // border: 1px solid red;
    //   }
    //   svg {
    //     width: 2rem;
    //     height: 2rem;
    //   }
    // }
  }
  &.stacked {
    th {
      display: none;
    }

    tr {
      td {
        display: grid;
        grid-template-columns: 20ch auto;

        text-align: start;
        // border: 3px solid red;
        // gap: var(--size-sm);
        padding-block: var(--size-xs);
        padding-inline: var(--size-l);

        &:first-child {
          padding-block-start: var(--size-3xl);
          input {
            // display: none;
          }
        }
        &:last-child {
          // padding-block-end: var(--size-3xl);
          // text-align: start;

          .actions {
            display: flex;
            gap: var(--size-xs);
            // border: 1px solid red;
            justify-content: flex-start;
          }
        }

        &[data-cell='true'] {
          // border: 1px solid green;
          text-align: start;
          &::before {
            content: attr(data-name);
            font-weight: var(--font-bold);
            text-transform: capitalize;
            font-size: var(--font-size-1);
            text-align: start;
          }
        }

        &.image-title {
          gap: 0;
        }

        .title {
          font-size: var(--font-size-2);
        }
      }
    }
  }
}
</style>
