<script lang="ts" setup>
const { searchText, updateSearchText } = useHttp()
const collapse = ref(false)
const localSearchText = ref(searchText.value)

watch(localSearchText, () => {
  updateSearchText(localSearchText.value)
})
</script>

<template>
  <div class="filter | flow-s">
    <v-form>
      <v-text-field
        type="text"
        v-model="localSearchText"
        placeholder="Another input"
        label=" "
        prepend-inner-icon="mdi-magnify"
        density="compact"
        variant="solo"
        clearable
        @click:clear="localSearchText = ''"
      ></v-text-field>
    </v-form>

    <!-- <div class="query-text" v-if="searchText" @click.prevent="localSearchText = ''">
      <button type="button">
        <Icon name="ri:close-line" aria-hidden="true" focusable="false" />
      </button>
      <span>{{ searchText }}</span>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
// .filter {
//   width: 100%;

//   form {
//     .inner {
//       display: flex;
//       align-items: center;
//     }

//     .form-input {
//       flex: 1;
//       min-width: var(--size-9xl);
//     }

//     button {
//       border: 1px solid var(--color-neutral-80);
//       padding-block: var(--size-l);
//       transform: translateY(-2px);
//       background-color: var(--color-neutral-90);
//     }
//   }

//   .query-text {
//     display: flex;

//     font-size: var(--font-size--11);

//     button {
//       background-color: var(--color-neutral-50);
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       padding-inline: var(--size-s);
//       padding-block: var(--space-xxs);
//       cursor: pointer;

//       svg {
//         color: var(--color-neutral-90);
//       }
//     }
//     span {
//       background-color: var(--color-neutral-80);
//       padding: var(--size-s);
//       padding-block: var(--space-xxs);
//     }
//   }
// }
</style>
