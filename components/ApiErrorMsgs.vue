<script lang="ts" setup>
const { appApiErrorMsgs } = useAppErrors()
</script>

<template>
  <div class="" v-show="appApiErrorMsgs">
    <ul role="list">
      <li v-for="errorMsg in appApiErrorMsgs">
        <p>{{ errorMsg }}</p>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scopped></style>
