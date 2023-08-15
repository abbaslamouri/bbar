<script lang="ts" setup>
const props = defineProps({
  page: {
    type: Number,
    default: 1,
  },
  perPage: {
    type: Number,
    default: 1,
  },
  totalCount: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['updatePage'])

const totalCount = Number(inject('totalCount'))

const pageCount = computed(() => (props.perPage ? Math.ceil(totalCount / props.perPage) : 1))
</script>

<template>
  <div class="pagination | flow-s">
    <div>
      <ul role="list">
        <li v-for="n in pageCount" :key="n">
          <button
            class="btn"
            :class="{ 'btn-filled': page === n, 'btn-outlined': page !== n }"
            @click="emit('updatePage', n)"
          >
            {{ n }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pagination {
  ul {
    display: flex;
    gap: var(--space-xs);
  }
}
</style>
