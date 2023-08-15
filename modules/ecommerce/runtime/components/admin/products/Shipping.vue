<script setup lang="ts">
const props = defineProps({
  formData: {
    type: Object,
    default: '',
  },
})

const emit = defineEmits(['updateFormData'])

const localFormData = ref({
  shippingWeight: props.formData.shippingWeight,
  shippingClass: props.formData.shippingClass,
  shippingWidth: props.formData.shippingWidth,
  shippingLength: props.formData.shippingLength,
  shippingHeight: props.formData.shippingHeight,
})

watch(localFormData.value, () => {
  emit('updateFormData', localFormData.value)
})
</script>

<template>
  <div class="section | flow-l" id="shipping">
    <h2>Shipping</h2>
    <div class="columns-2">
      <div>
        <FormsBaseInput
          type="text"
          label="Weight"
          placeholder="Weight"
          v-model="localFormData.shippingWeight"
          required
        />
      </div>
      <div>
        <FormsBaseInput
          type="text"
          label="Shipping Class"
          placeholder="Shipping Class"
          v-model="localFormData.shippingClass"
        />
      </div>
    </div>
    <div class="columns-2">
      <div>
        <FormsBaseInput
          type="text"
          label=" Width"
          placeholder=" Width"
          v-model="localFormData.shippingWidth"
          required
        />
      </div>
      <div>
        <FormsBaseInput
          type="text"
          label=" Length"
          placeholder=" Length"
          v-model="localFormData.shippingLength"
          required
        />
      </div>
      <div>
        <FormsBaseInput
          type="text"
          label=" Height"
          placeholder=" Height"
          v-model="localFormData.shippingHeight"
          required
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
