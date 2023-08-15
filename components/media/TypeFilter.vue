<script setup lang="ts">
const props = defineProps({
  mediaType: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['updateSelecteMediaType'])

const localMediaType = ref(props.mediaType)

// })

watch(localMediaType, () => {
  emit('updateSelecteMediaType', localMediaType.value)
})
</script>

<template>
  <div class="media-type-filter">
    <form @submit.prevent="" autocomplete="off">
      <div class="inner">
        <FormsBaseSelect
          id="media-type"
          label="Select media type"
          v-model="localMediaType"
          :selectOptions="[
            { value: '', text: 'All media types' },
            { value: 'image', text: 'Images' },
            { value: 'pdf', text: 'PDF' },
            { value: 'csv', text: 'CSV' },
          ]"
          nullOption="Select option"
        />
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.media-type-filter {
  // border: 1px solid red;
  min-width: var(--size-8xl);
}
// .media-type-select {
//   display: flex;
//   // flex-direction: row;
//   align-items: center;
//   gap: var(--size-5xl);
// }
</style>
