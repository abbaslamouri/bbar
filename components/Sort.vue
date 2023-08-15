<script setup lang="ts">
import { ISelectOption } from '~/server/utils/schemas/app'

const { sort, updateSortField } = useHttp()

const sortSelectOptions = inject('sortSelectOptions') as Array<ISelectOption>

const clickAppend = () => {
  console.log('(((((((())))))))')
  sort.value.order = -sort.value.order
}
</script>

<template>
  <div class="sort">
    <!-- <v-container> -->
    <v-row dense>
      <v-col class="sort">
        <v-select
          v-model="sort.field"
          label="Sort field"
          :items=" (sortSelectOptions as Array<ISelectOption>).map((option: ISelectOption) => option.text)"
          density="compact"
          variant="solo"
          :append-icon="sort.order === 1 ? 'mdi-arrow-up-thin' : 'mdi-arrow-down-thin'"
          @update:modelValue="updateSortField($event, sortSelectOptions)"
          @click:append="clickAppend"
        ></v-select>
      </v-col>
      <!-- <v-col>
        <v-btn icon="mdi-arrow-down-thin" size="small" v-if="sort.order == 1" @click.prevent="sort.order = -1"></v-btn>
        <v-btn icon="mdi-arrow-up-thin" size="small" v-if="sort.order == -1" @click.prevent="sort.order = 1"></v-btn>
      </v-col> -->
    </v-row>
    <!-- </v-container> -->
    <!-- <div class="sort-field">
      <v-select
        v-model="sort.field"
        label="Sort field"
        :items=" (sortSelectOptions as Array<ISelectOption>).map((option: ISelectOption) => option.text)"
        density="compact"
        variant="solo"
        @update:modelValue="updateSortField($event, sortSelectOptions)"
      ></v-select>
    </div>
    <div class="sort-order" v-if="Object.keys(sort).length">
      <v-btn icon="mdi-arrow-down-thin" size="small" v-if="sort.order == 1" @click.prevent="sort.order = -1"></v-btn>
      <v-btn icon="mdi-arrow-up-thin" size="small" v-if="sort.order == -1" @click.prevent="sort.order = 1"></v-btn>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.sort {
  // min-width: var(--size-9xl);
  // display: flex;
  // gap: var(--space-xs);

  // &-field {
  //   min-width: var(--size-9xl);
  // }

  // &-order {
  //   transform: translateY(var(--space-xxs));
  // }
}
</style>
