<script setup lang="ts">
import { IMedia } from '~/server/utils/schemas/media'
import { ISelectOption } from '~/server/utils/schemas/app'

const props = defineProps({
  // selectedFiles: {
  //   type: Array,
  //   required: true,
  // },
  // bulkSelect: {
  //   type: Boolean,
  //   default: false,
  // },
  // searchText: {
  //   type: String,
  //   default: '',
  // },
  // mediaType: {
  //   type: String,
  //   default: '',
  // },
  // perPage: {
  //   type: Number,
  //   required: true,
  // },
  // sortSelectOptions: {
  //   type: Array,
  //   required: true,
  // },
})

const emit = defineEmits([
  'showBulkSelect',
  'cancelBulkSelect',
  // 'handleselectAll',
  'toggleSelectAll',
  'deleteSelected',
  'handleDeleteAll',
  'updateSelecteMediaType',
  'updateSort',
  'emitSelectedItems',
  'updateSortField',
])

// const selectedFiles = inject('selectedItems')

const viewportWidth = useViewportWidth()
const { searchText, filter, page, perPage, sort, selectedItems, appFetch } = useHttp()

// const { searchText, page, perPage, sort, appFetch, updatePerPage } = useHttp()

const bulkSelect = inject('bulkSelect')
// const selectedItems = inject('selectedItems') as Ref<unknown[]>
const media = inject('media')
const filterSelectOptions = inject('filterSelectOptions') as ISelectOption[]
// const sort = inject('sort')

// const localMediaType = ref()
// const perPage = ref<number>(perPage)

// const sort = ref({
//   field: props.sort.field,
//   order: props.sort.order,
// })

// watch(localMediaType, () => {
//   emit('updateSelecteMediaType', localMediaType.value)
// })

// watch(sort.value, () => {
//   emit('updateSort', sort.value)
// })

// watch(perPage, () => {
//   // page.value = 1
//   if (perPage.value < 1) perPage.value = 1
//   // updatePerPage(perPage.value)
// })
</script>

<template>
  <div class="filters | flow-xs">
    <v-container fluid>
      <!-- <div class="top"> -->
      <v-row dense>
        <v-col cols="12" sm="2" md="2">
          <PerPage />
        </v-col>
        <v-col cols="12" sm="10" md="6">
          <SearchBar />
        </v-col>
        <v-col class="sort" cols="12" sm="6" md="2" v-if="filterSelectOptions?.length">
          <Filter class="first" label="filter by" />
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <Sort label="Sort by" />
        </v-col>
      </v-row>
      <!-- </div> -->
      <!-- {{  (media as Array<IMedia>).length}} ===={{ selectedItems.length }} -->
      <!-- <div class="top">
      <div class="filter-sort-per-page">
        <Filter class="first" label="filter by" />
        <Sort label="Sort by" />
        <PerPage @updatePerPage="emit('updatePerPage', $event)" />
      </div>
      <SearchBar />
    </div> -->
      <!-- <div class="bottom"> -->
      <div class="d-flex flex-wrap gap-sm">
        <!-- <v-col sm="2" class="border" v-if="!bulkSelect"> -->
        <div v-if="!bulkSelect">
          <v-btn color="primary" @click.prevent="$emit('showBulkSelect')" class="flex-1-1">Bulk select</v-btn>
        </div>

        <!-- <button class="btn btn-outlined">Bulk select</button> -->
        <!-- </v-col>
        <v-col> -->
        <div v-if="bulkSelect">
          <v-btn color="primary" @click.prevent="$emit('toggleSelectAll')">
            <span v-if="(media as Array<IMedia>).length !== selectedItems.length">Select all</span>
            <span v-else>Deselect all</span>
          </v-btn>
        </div>

        <!-- <button class="btn btn-filled" v-if="bulkSelect" @click.prevent="$emit('toggleSelectAll')">
            <span v-if="(media as Array<IMedia>).length !== selectedItems.length">Select all</span>
            <span v-else>Deselect all</span>
          </button> -->
        <!-- </v-col>
        <v-col v-if="bulkSelect"> -->
        <div v-if="bulkSelect">
          <v-btn color="primary" @click.prevent="$emit('cancelBulkSelect')">Cancel bulk select</v-btn>
        </div>

        <!-- <button class="btn btn-outlined" @click.prevent="$emit('showBulkSelect')">Cancel bulk select</button> -->
        <!-- </v-col>
        <v-col v-if="selectedItems?.length"> -->
        <div v-if="bulkSelect">
          <v-btn color="primary" @click.prevent="$emit('deleteSelected')">Delete Permanently</v-btn>
        </div>

        <!-- <button class="btn btn-outlined" @click.prevent="$emit('deleteSelected')">Delete Permanently</button> -->
        <!-- </v-col> -->
      </div>
      <!-- </div> -->
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
// .filters {
//   background-color: var(--color-neutral-99);
//   box-shadow: var(--shadow-3);
//   padding: var(--size-l);
//   .top {
//     // border: 1px solid green; // display: flex;
//     // align-items: flex-start;
//     // gap: var(--size-3xl);

//     .filter-sort-per-page {
//       flex: 1;
//       display: flex;
//       gap: var(--size-3xl);
//       // border: 3px solid red;
//       // width: 100%;

//       .first {
//         // flex: 1;
//       }
//     }
//   }

//   .bottom {
//     // flex: 1;
//     display: flex;
//     align-items: center;
//     gap: var(--size-l);
//   }
// }
// .actions {
//   background-color: var(--color-neutral-99);
//   padding: var(--size-l);
//   box-shadow: var(--shadow-3);

//   &.breakpoint-1 {
//     .top {
//       // flex-direction: column-reverse;
//       // gap: var(--size-l);
//       // align-items: stretch;
//       .filter-wrapper {
//       }
//     }
//   }

//   &.breakpoint-2 {
//     .top {
//       form {
//         // flex-direction: column;
//         // align-items: stretch;
//         // gap: var(--size-l);
//       }
//     }
//   }

//   &.breakpoint-3 {
//     .bottom {
//       // flex-direction: column;
//       // align-items: stretch;
//       // gap: var(--size-l);
//     }
//   }
// }
</style>
