<script lang="ts" setup>
const { appFormErrors, appApiErrorMsgs } = useAppErrors()
</script>

<template>
  <div class="app-errors">
    <div class="form-errors | flow-2xs" v-if="appFormErrors.length">
      <p>Please correct the following errors</p>
    </div>
    <div class="api-errors | flow-2xs" v-if="appApiErrorMsgs.length">
      <ul role="list">
        <li v-for="errorMsg in appApiErrorMsgs">
          <!-- <div class="inner"> -->
          <p>{{ errorMsg }}</p>
          <!-- </div> -->
        </li>
      </ul>

      <button class="btn btn-filled" @click.prevent="appApiErrorMsgs = []">clear error message</button>
    </div>
  </div>
</template>

<style lang="scss" scopped>
.app-errors {
  display: flex;
  justify-content: center;
  .api-errors {
    border: 1px solid red;
    min-width: 80%;

    ul {
      // display: flex;
      // flex-direction: row;
    }
  }
}
</style>
