<script lang="ts" setup>
// const { $toast } = useNuxtApp()

const props = defineProps({
  toast: {
    type: Object,
    required: true,
  },
})
const { toasts } = useToast()

const leadingIcon = ref('')

const duration = computed(() => `${props.toast.duration * 1000}ms`)

// computed(() => {})

onMounted(() => {
  switch (props.toast.type) {
    case 'info':
      leadingIcon.value = 'ri:information-fill'
      break

    case 'warning':
      leadingIcon.value = 'ri:error-warning-fill'
      break

    case 'error':
      leadingIcon.value = 'ri:error-warning-fill'
      break

    case 'success':
      leadingIcon.value = 'ri:checkbox-circle-fill'
      break

    default:
      leadingIcon.value = 'ri:information-fill'
      break
  }
  setTimeout(() => {
    if (toasts.value.length === 1) {
      toasts.value = []
    } else {
      const index = toasts.value.findIndex((t: any) => t.index === props.toast.index)
      console.log('TTTTTTTT', index)
      if (index !== -1) toasts.value.splice(index, 1)
    }
  }, props.toast.duration * 1000 ?? 50000)
})

const removeToast = () => {
  const index = toasts.value.findIndex((t: any) => t.index === props.toast.index)
  if (index !== -1) toasts.value.splice(index, 1)
}
</script>

<template>
  <div class="" :data-type="toast.type" @click.prevent="removeToast">
    <!-- {{ duration }} -->
    <!-- {{ toast }} -->
    <!-- <div class="toast-messages"> -->
    <!-- <ul class="flow-l"> -->
    <!-- <template v-for="(toast, index) in toasts" :key="`mmsg-${index}`"> -->
    <!-- <li> -->
    <Icon class="icon leading" :name="`${leadingIcon}`" aria-hidden="true" focusable="false" />
    <div class="content">{{ toast.message }}</div>
    <Icon class="icon trailing" name="ri:close-line" aria-hidden="true" focusable="false" />
    <!-- </li> -->
    <!-- </template> -->
    <!-- </ul> -->
    <!-- </div> -->
  </div>
</template>

<style lang="scss" scoped>
.toast {
  animation: toastIt v-bind(duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) forwards;
}

@keyframes toastIt {
  0%,
  100% {
    transform: translateX(20rem);
    opacity: 0;
  }

  5%,
  95% {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
