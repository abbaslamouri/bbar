// import PasswordInputVue from '~~/components/forms/PasswordInput.vue'

export const emailPattern = '[a-z0-9]+(.[_a-z0-9]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,15})$'

export const passwordPattern = '(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'

export const phonePattern = '^([+]?[s0-9]+)?(d{3}|[(]?[0-9]+[)])?([-]?[s]?[0-9])+$'
// 8 characters minum with at least one letter, one number, one uppercase and one s[ecial character]

// export { emailPattern, passwordPattern }
