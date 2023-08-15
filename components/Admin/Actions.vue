<script lang="ts" setup>
const props = defineProps({
  showActions: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggleAction', 'edit', 'delete'])
// const localShowActions = ref(props.showActions)
const toggleAction = () => {
  // localShowActions.value = !localShowActions.value
  emit('toggleAction')
}
</script>

<template>
  <div class="admin-actions">
    <button type="button" class="trigger" @click.prevent="toggleAction">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="button__icon">
        <circle cx="5" cy="12" r=".75" stroke="currentColor" stroke-width="1.5"></circle>
        <circle cx="11" cy="12" r=".75" stroke="currentColor" stroke-width="1.5"></circle>
        <circle cx="17" cy="12" r=".75" stroke="currentColor" stroke-width="1.5"></circle></svg
      ><span class="button__content"></span>
    </button>
    <div class="actions" v-if="showActions">
      <button class="edit" @click.prevent="$emit('edit')">Edit</button>
      <button class="delete" @click.prevent="$emit('delete')">Delete</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-actions {
  position: relative;
  // display: flex;
  // align-items: center;
  // flex-flow: row-reverse;
  // gap: var(--size-xs);
  // border: 1px solid orange;

  .trigger {
    cursor: pointer;
    // width: max-content;
    // border: 1px solid red;

    svg {
      width: 2rem;
      height: 2rem;
    }

    &:hover {
      background-color: var(--clr-primary-3);
    }
  }

  .actions {
    position: absolute;
    top: -30%;
    // transform: translateY (50%);
    right: calc(1 * var(--size-3xl));
    box-shadow: var(--shadow-3);
    // border: 1px solid var(--clr-primary-3);
    padding: var(--space-xs);
    border-radius: var(--size-3xs);
    display: flex;
    flex-direction: column;
    gap: var(--size-xs);
    // visibility: hidden;
    // opacity: 0;

    button {
      font-size: var(--font-size-0);
      cursor: pointer;
      padding-inline: var(--size-xs);
      padding-block: var(--size-3xs);

      &.delete {
        color: var(--clr-danger-3);
      }

      &:hover {
        background-color: var(--clr-primary-3);
      }
    }
  }
}
</style>
