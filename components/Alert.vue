<script setup lang="ts">
const showAlert = ref(false)
const message = ref('')

let resolvePromise: (value: PromiseLike<boolean> | boolean) => void

const handleUserInput = (event: boolean) => {
  if (!resolvePromise) return
  resolvePromise(event)
  showAlert.value = false
}

const alertConfirm = (msg: string) => {
  showAlert.value = true
  message.value = msg
  return new Promise((resolve, reject) => {
    resolvePromise = resolve
  })
}

defineExpose({
  alertConfirm,
})
</script>

<template>
  <v-dialog v-model="showAlert" width="auto" min-width="600">
    <v-card>
      <v-card-title>Are you sure?</v-card-title>
      <v-card-text> {{ message }} </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="flat" @click.native="handleUserInput(true)">OK</v-btn>
        <v-btn color="primary" @click.native="handleUserInput(false)">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
