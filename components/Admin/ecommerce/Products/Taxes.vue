<script setup lang="ts">
const props = defineProps({
  formData: {
    type: Object,
    default: '',
  },
})

const emit = defineEmits(['updateFormData'])

const localFormData = ref({
  taxStatus: props.formData.taxStatus,
  taxClass: props.formData.taxClass,
})

watch(localFormData.value, () => {
  emit('updateFormData', localFormData.value)
})
</script>

<template>
  <div class="section | flow-l" id="taxes">
    <h2>Taxes</h2>
    <div class="columns-2">
      <div>
        <FormsBaseInput
          type="text"
          label="Tax Status"
          placeholder="Tax Status"
          v-model="localFormData.taxStatus"
          required
        />
      </div>
      <div>
        <FormsBaseInput
          type="text"
          label="Tax Class"
          placeholder="Tax Class"
          v-model="localFormData.taxClass"
          required
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
