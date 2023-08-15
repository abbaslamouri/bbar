<script setup lang="ts">
const props = defineProps({
  selectedFiles: {
    type: Array,
    required: true,
  },
  bulkSelect: {
    type: Boolean,
    default: false,
  },
  // searchText: {
  //   type: String,
  //   default: '',
  // },
  mediaType: {
    type: String,
    default: '',
  },
  // perPage: {
  //   type: Number,
  //   required: true,
  // },
  // sort: {
  //   type: Object,
  //   required: true,
  // },
})

const emit = defineEmits([
  'handleBulkSelect',
  'handleDelete',
  'toggleSelectAll',
  'updateSelecteMediaType',
  'updateSort',
  'updatePerPage',
])

const viewportWidth = useViewportWidth()
const { searchText, page, perPage, sort, appFetch, updatePerPage } = useHttp()

// const localMediaType = ref()
// const localPerPage = ref(props.perPage)
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

// watch(localPerPage, () => {
// page.value = 1
// if (localPerPage.value < 1) localPerPage.value = 1
// updatePerPage(localPerPage.value)
// })
</script>

<template>
  <div
    class="actions | flow-xs"
    :class="{
      'breakpoint-1': viewportWidth <= 1200,
      'breakpoint-2': viewportWidth <= 700,
      'breakpoint-3': viewportWidth <= 500,
    }"
  >
    <div class="top">
      <div class="sort-per-page">
        <!-- <Sort label="Sort by" @updateSortField="$emit('updateSortField', $event)" /> -->
        <PerPage :perPage="perPage" @updatePerPage="emit('updatePerPage', $event)" />
      </div>
      <SearchBar @updateSearch="searchText = $event" />
    </div>
    <div class="top">
      <!-- <MediaTypeFilter @updateSelecteMediaType="$emit('updateSelecteMediaType', $event)" /> -->
      <!-- <Sort /> -->
      <!-- <PerPage /> -->
      <!-- <Filter /> -->
    </div>
    <!-- <div class="bottom">
      <button class="btn btn-outlined" @click.prevent="$emit('handleBulkSelect')" v-if="!bulkSelect">
        Bulk select
      </button>
      <button class="btn btn-filled" v-if="bulkSelect" @click.prevent="$emit('toggleSelectAll')">Select all</button>
      <button class="btn btn-outlined" @click.prevent="$emit('handleBulkSelect')" v-if="bulkSelect">Cancel</button>
      <button class="btn btn-outlined" @click.prevent="$emit('handleDelete')" :disabled="!selectedFiles?.[0]">
        Delete Permanently
      </button>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
// .actions {
//   background-color: var(--color-neutral-99);
//   padding: var(--size-l);
//   box-shadow: var(--shadow-3);

//   .top {
//     display: flex;
//     align-items: center;
//     gap: var(--size-4xl);

//     .media-type-filter-wrapper,
//     .sort-wrapper,
//     .per-page-wrapper,
//     .filter-wrapper {
//       min-width: var(--size-8xl);
//     }

//     // form {
//     //   display: flex;
//     //   flex-direction: row;
//     //   align-items: center;
//     //   gap: var(--size-4xl);

//     //   .media-type-select {
//     //     display: flex;
//     //     flex-direction: row;
//     //     align-items: center;
//     //     gap: var(--space-xs);

//     //     .form-select-wrapper {
//     //       flex: 1;
//     //       min-width: var(--size-8xl);
//     //     }
//     //   }

//     //   .media-sort {
//     //     display: flex;
//     //     flex-direction: row;
//     //     align-items: center;
//     //     gap: var(--space-xs);

//     //     .form-select-wrapper {
//     //       flex: 1;
//     //       min-width: var(--size-8xl);
//     //     }

//     //     button {
//     //       cursor: pointer;
//     //       .icon {
//     //         width: var(--size-xl);
//     //         height: var(--size-xl);
//     //       }
//     //     }
//     //   }
//     // }
//     .filter-wrapper {
//       flex: 1;
//     }
//   }

//   .bottom {
//     // flex: 1;
//     display: flex;
//     align-items: center;
//     gap: var(--size-l);
//   }

//   &.breakpoint-1 {
//     .top {
//       flex-direction: column-reverse;
//       gap: var(--size-l);
//       align-items: stretch;
//       .filter-wrapper {
//       }
//     }
//   }

//   &.breakpoint-2 {
//     .top {
//       form {
//         flex-direction: column;
//         align-items: stretch;
//         gap: var(--size-l);
//       }
//     }
//   }

//   &.breakpoint-3 {
//     .bottom {
//       flex-direction: column;
//       align-items: stretch;
//       gap: var(--size-l);
//     }
//   }
// }
</style>
