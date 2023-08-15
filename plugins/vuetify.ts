import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify, ThemeDefinition } from 'vuetify'

export default defineNuxtPlugin((nuxtApp) => {
  const myCustomLightTheme: ThemeDefinition = {
    // dark: false,
    colors: {
      background: '#FFFFFF',
      surface: '#FFFFFF',
      primary: '#DEBA33',
      // 'primary-darken-1': '#3700B3',
      secondary: '#03DAC6',
      // 'secondary-darken-1': '#018786',
      error: '#B00020',
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FB8C00',
    },
  }

  const vuetify = createVuetify({
    ssr: true,
    // theme: {
    //   defaultTheme: 'myCustomLightTheme',
    //   themes: {
    //     myCustomLightTheme,
    //   },
    // },
  })
  nuxtApp.vueApp.use(vuetify)
})
