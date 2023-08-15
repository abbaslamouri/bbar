<script setup lang="ts">
const emit = defineEmits(['uploadMedia'])

const dragged = ref(false)

const handleFilesSelected = (files: FileList) => {
  dragged.value = false
  emit('uploadMedia', files)
}
</script>

<template>
  <div class="media-upload | flow-l">
    <div
      class="dropzone"
      :class="{ 'dragged-over': dragged }"
      @dragover.prevent="dragged = true"
      @dragleave.prevent="dragged = false"
      @drop.prevent="handleFilesSelected($event?.dataTransfer?.files as FileList)"
    >
      <Icon class="icon" name="mdi:cloud-upload-outline" aria-hidden="true" focusable="false" />
      <p>Drop files to upload</p>
    </div>
    <label>
      <span>Select files</span>
      <input
        type="file"
        accept="image/png, image/jpg, image/jpeg, image/webp, text/csv, application/pdf"
        :multiple="true"
        ref="fileRef"
        @change="handleFilesSelected(($event.target as HTMLInputElement)?.files as FileList)"
      />
    </label>
    <p>WEBP, PNG & JPG ACCEPTED (Maximum upload file size: 2 MB)</p>
  </div>
</template>

<style lang="scss" scoped>
.media-upload {
  background-color: var(--color-neutral-99);
  // box-shadow: var(--shadow-3);
  padding: var(--size-l);

  .dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--size-xs);
    height: var(--size-9xl);
    border-radius: 5px;
    text-transform: capitalize;
    border: 3px dashed var(--color-neutral-50);

    .icon {
      width: 4rem;
      height: 4rem;
    }

    &.dragged-over {
      outline: 3px solid var(--bg-highlight);
      outline-offset: 0.3ch;
    }
  }

  label {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    position: relative;

    span {
      background-color: var(--bg-featured);
      padding-inline: var(--size-s);
      padding-block: var(--size-xs);
      border-radius: var(--size-3xs);
      margin-inline: auto;
      grid-row: 1 / 2;
      grid-column: 1 / 2;
      font-weight: 600;
      border: 1px solid var(--color-primary-20);
      text-transform: capitalize;
    }

    input {
      grid-row: 1 / 2;
      grid-column: 1 / 2;
      cursor: pointer;
      opacity: 0;
      position: absolute;
      inset: 0;
      font-size: 1px;
    }
  }

  p {
    font-weight: 600;
    text-align: center;
  }
}

// .dropzone-enter-active,
// .dropzone-leave-active {
//   transition: all 250ms ease-in-out;
// }

// .dropzone-enter-from,
// .dropzone-leave-to {
//   opacity: 0;
// }

// .dropzone-enter-to,
// .dropzone-leave-from {
//   opacity: 1;
// }
</style>
