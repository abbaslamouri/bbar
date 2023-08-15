<script setup lang="ts">
const emit = defineEmits(['mediaUploaded'])

const fileRef = ref()
const dragged = ref(false)

const config = useRuntimeConfig()

const fd = new FormData()

const uploadMedia = async (files) => {
  Array.from(files).map((file, index) => {
    fd.append('file', file)
  })
  console.log(fd)
  const { data, pending, error, refresh } = await useFetch(`media/`, {
    baseURL: config.public.apiUrl,
    method: 'POST',
    body: fd,
  })
  console.log(data.value)
  emit('mediaUploaded', data.value)
}

const handleDroppedFiles = (event: DragEvent) => {
  uploadMedia(event.dataTransfer?.files)
}

const handleSelectedFiles = async (event: Event) => {
  uploadMedia((event.target as HTMLInputElement)?.files)
}
</script>

<template>
  <form enctype="multipart/form-data">
    <label
      class="dropzone"
      :class="{ 'dragged-over': dragged }"
      @dragover.prevent="dragged = true"
      @dragleave.prevent="dragged = false"
      @drop.prevent="handleDroppedFiles"
    >
      <Icon class="dropzone__icon" name="mdi:cloud-upload-outline" aria-hidden="true" focusable="false" />
      <!-- <p class="heading" href="#" @click="fileRef?.click()">Or click here to choose your files</p> -->
      <span class="dropzone__text">Or click here to choose your files</span>

      <input
        class="dropzone__input"
        type="file"
        accept="image/png, image/webp"
        :multiple="true"
        @change="handleSelectedFiles"
      />

      <!-- <button class="btn btn-filled" @click="$emit('fileUploadBtnClicked')">
        <span>Cancel</span>
      </button> -->
    </label>
  </form>
</template>

<style lang="scss" scoped>
.dropzone {
  position: relative;
  // display: grid;
  // place-content: center;
  color: var(--on-bg-dim);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);

  height: 8rem;
  border: 1px solid var(--on-bg-dim);
  border-radius: var(--size-2xs);

  &:focus-within {
    outline: 3px solid var(--bg-highlight);
    outline-offset: 0.3ch;
  }

  &__text {
    // color: var(--on-bg);
    font-weight: var(--font-bold);
    // font-size: 1.8rem;
  }

  &__icon {
    width: 4rem;
    height: 4rem;
  }

  &__input {
    position: absolute;
    inset: 0;
    cursor: pointer;
    opacity: 0;
    font-size: 1px;

    // border: 1px solid red;
  }
}
</style>
