<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },

  errorMsg: {
    type: String,
    default: '',
  },
  showHint: {
    type: Boolean,
    default: false,
  },

  leadingIcon: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])
const fieldType = ref('password')
const capsLocked = ref()
const password = ref(props.modelValue)

const handleInput = (event: Event) => {
  password.value = (event.target as HTMLInputElement).value
  emit('update:modelValue', password.value)
}
</script>

<template>
  <div class="flow-s">
    <div class="input-wrapper | flow-2xs">
      <div class="inner">
        <div class="icons leading" v-if="leadingIcon">
          <Icon :name="leadingIcon" aria-hidden="true" focusable="false" />
        </div>
        <div class="input password" :class="{ 'no-label': !label }">
          <label :v-for="$attrs.id"> {{ label }} <span v-if="$attrs.required !== undefined">*</span> </label>
          <input
            v-bind="$attrs"
            :type="fieldType"
            :value="modelValue"
            @input="handleInput"
            @keyup="capsLocked = $event.getModifierState && $event.getModifierState('CapsLock')"
            aria-labelledby="password"
            ref="inputRef"
            autocomplete="off"
            data-pasword="password"
          />
        </div>
        <div class="icons trailing">
          <button class="actions" @click.prevent="fieldType = fieldType === 'text' ? 'password' : 'text'">
            <Icon class="" name="mdi:eye-outline" v-if="fieldType === 'password'" />
            <Icon class="" name="mdi:eye-off-outline" v-if="fieldType === 'text'" />
            <Icon class="" name="mdi:keyboard-caps" v-if="capsLocked" />
          </button>
        </div>
      </div>
      <p class="errorMsg">{{ errorMsg }}</p>
    </div>
    <span v-if="capsLocked">Caps locked</span>
    <div class="hint" v-if="showHint">
      <div class="strength | flow-xs">
        <div class="flow-4xs">
          <p class="strong">
            <strong> Your password must have </strong>
          </p>
          <div>
            <ul role="list">
              <li :class="{ pass: password.length >= 8 }">
                <Icon class="" name="mdi:check" /> A minimu of 8 charcters
              </li>
            </ul>
          </div>
        </div>
        <div class="flow-xs">
          <p class="strong">
            <strong> Also 3 of the following:</strong>
          </p>
          <div>
            <ul role="list">
              <li :class="{ pass: password.match(/[0-9]/g)?.length }">
                <Icon class="" name="mdi:check" /> <strong>0-9</strong> A number
              </li>
              <li :class="{ pass: password.match(/[a-z]/g)?.length }">
                <Icon class="" name="mdi:check" /> <strong>a-z</strong> At least one lowercase letter
              </li>
              <li :class="{ pass: password.match(/[A-Z]/g)?.length }">
                <Icon class="" name="mdi:check" /> <strong>A-Z</strong> At least one uppercase letter
              </li>
              <li :class="{ pass: password.match(/[^a-zA-Z0-9\s]/g)?.length }">
                <Icon class="" name="mdi:check" /> <strong>!%&@#$^*?</strong> At least one special character
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// .hint {
//   li {
//     font-size: var(--font-size--1);
//   }
// }
</style>
