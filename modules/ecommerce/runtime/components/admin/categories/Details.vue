<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Object,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const localDetails = ref({ ...props.modelValue })

watch(localDetails.value, () => {
  emit('update:modelValue', localDetails.value)
})
</script>

<template>
  <div class="section | flow-l" id="details">
    <h2>Details</h2>
    <!-- <div class="columns-2"> -->
    <div>
      <FormsBaseInput type="text" label="Name" placeholder="Name" v-model="localDetails.name" required />
    </div>
    <!-- <div>
      <FormsBaseInput
        type="text"
        label="Display name"
        placeholder="Display name"
        v-model="localDetails.displayName"
        required
      />
    </div> -->
    <!-- </div> -->
    <!-- <div class="columns-2">
      <div>
        <FormsBaseInput type="text" label="SKU" placeholder="SKU" v-model="localDetails.sku" />
      </div>
      <div>
        <FormsBaseCheckbox label="Featured" v-model="localDetails.featured" />
      </div>
    </div> -->
    <div>
      <FormsBaseTextarea label="Description" placeholder="Description" rows="5" v-model="localDetails.description" />
    </div>
    <!-- <div>
      <FormsBaseTextarea label="Excerpt" placeholder="Excerpt" rows="2" v-model="localDetails.excerpt" />
    </div> -->
  </div>
</template>

<style lang="scss" scoped></style>
