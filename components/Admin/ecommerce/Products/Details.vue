<script setup lang="ts">
const props = defineProps({
  formData: {
    type: Object,
    default: '',
  },
})

const emit = defineEmits(['updateFormData'])

const { appFormErrors } = useAppErrors()

const localFormData = ref({
  name: props.formData.name,
  displayName: props.formData.displayName,
  sku: props.formData.sku,
  featured: props.formData.featured,
  description: props.formData.description,
  excerpt: props.formData.excerpt,
})

watch(localFormData.value, () => {
  emit('updateFormData', localFormData.value)
})
</script>

<template>
  <div class="section | flow-l" id="details">
    <h2>Details</h2>
    <div class="columns-2">
      <div>
        <FormsBaseInput
          type="text"
          id="name"
          label="Name"
          placeholder="Name"
          v-model="localFormData.name"
          required
          :data-invalid="!!appFormErrors.find((e) => e.fieldName == 'name')"
          :errorMsg="appFormErrors.find((e) => e.fieldName == 'name')?.fieldErrorMsg"
        />
      </div>
      <div>
        <FormsBaseInput
          type="text"
          label="Display name"
          placeholder="Display name"
          v-model="localFormData.displayName"
          required
        />
      </div>
    </div>
    <div class="columns-2">
      <div>
        <FormsBaseInput type="text" label="SKU" placeholder="SKU" v-model="localFormData.sku" />
      </div>
      <div>
        <FormsBaseCheckbox label="Featured" v-model="localFormData.featured" />
      </div>
    </div>
    <div>
      <FormsBaseTextarea label="Description" placeholder="Description" rows="5" v-model="localFormData.description" />
    </div>
    <div>
      <FormsBaseTextarea label="Excerpt" placeholder="Excerpt" rows="2" v-model="localFormData.excerpt" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
