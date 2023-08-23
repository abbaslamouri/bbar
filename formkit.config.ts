// import { fr } from '@formkit/i18n'
import { defineFormKitConfig } from '@formkit/vue'
// main.js or formkit.config.ts
import { createProPlugin, inputs, rating, toggle, autocomplete, slider } from '@formkit/pro'
import { genesisIcons } from '@formkit/icons'
import { generateClasses } from '@formkit/themes'
import '@formkit/themes/genesis'
import '@formkit/pro/genesis'

export default defineFormKitConfig(() => {
  const config = useRuntimeConfig()

  const proPlugin = createProPlugin(
    'fk-67c69de1c63',
    // config.formkitProKey,
    // inputs
    {
      rating,
      toggle,
      autocomplete,
      slider,
    }
    // ... and any other Pro Inputs
  )

  const styles = {
    global: {
      label: '',
      listitem: 'bg-primary-3 hover:bg-error-3',
      inner: 'focus-within:outline',
      input: '',
    },
    box: {},
    button: {
      input: 'bg-primary-3 text-neutral-2',
    },
    dropdown: {},
    text: {
      input: '',
    },
  }

  // {

  //   &:focus-within {
  //   outline: 3px solid var(--color-primary-3);
  // }
  // locales: { fr },
  // locale: 'fr',
  return {
    // theme: 'genesis',
    icons: {
      ...genesisIcons,
    },
    plugins: [proPlugin],

    config: {
      classes: generateClasses(styles),
    },
  }
})

// main.js or formkit.config.ts
// const config = defaultConfig({

// })
