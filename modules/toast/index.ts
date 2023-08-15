import defu from 'defu'

import {
  createResolver,
  defineNuxtModule,
  addServerHandler,
  addImportsDir,
  addTemplate,
  addComponent,
  useLogger,
  addPlugin,
} from 'nuxt/kit'

const PACKAGE_NAME = 'toast'

const defaults = {
  isEnabled: true,
  apiBasePath: 'api/v1/toast',
  mailTransporter: 'sendgrid',
  contactFormEmailRecipients: 'abbaslamouri@yrlus.com, lamouri@genvac.com',
  emailFromName: 'MyLight',
  emailFromEmail: 'support@morelamplight.com',
  emailSentMessage: 'Your message was sent successfully',
  contactFormEmailSubject: 'New message from morelamplight.com',
}

export default defineNuxtModule({
  meta: {
    name: `${PACKAGE_NAME}`,
  },
  defaults,
  hooks: {},

  setup(moduleOptions, nuxt) {
    // 1. Initializelogger
    const logger = useLogger(PACKAGE_NAME)

    // 2. Check if module should be enabled at all
    if (!moduleOptions.isEnabled) {
      logger.info(`Skipping ${PACKAGE_NAME} setup, as module is disabled`)
      return
    }
    logger.info(`${PACKAGE_NAME} module setup starting...`)

    // 3. Set up runtime configuration
    const options = defu(moduleOptions, defaults)
    nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || { public: {} }
    nuxt.options.runtimeConfig.toast = defu(nuxt.options.runtimeConfig.toast, options)
    nuxt.options.runtimeConfig.public.toast = defu(nuxt.options.runtimeConfig.public.toast, {
      emailSentMessage: options.emailSentMessage,
    })

    // 3. Locate runtime directory
    const { resolve } = createResolver(import.meta.url)

    // 5. Register desired auth API endpoints
    logger.info(`${PACKAGE_NAME} API location is \`/${options.apiBasePath}\``)

    // addServerHandler({
    //   handler: resolve(`./runtime/server/${options.apiBasePath}/sendMail.post`),
    //   route: `/${options.apiBasePath}/sendMail`,
    // })

    // 4. Add composables
    addImportsDir(resolve('runtime/composables'))

    // 5. Register desired auth components
    addComponent({
      name: 'Toast',
      filePath: resolve('runtime/components/Toast.vue'),
    })

    addPlugin(resolve('./runtime/plugin'))

    // 5. Create virtual imports for server-side
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}
      nitroConfig.externals = defu(typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {}, {
        inline: [resolve('./runtime')],
      })
      nitroConfig.alias['#toast'] = resolve('./runtime/server/services')
    })
    addTemplate({
      filename: 'types/toast.d.ts',
      getContents: () =>
        [
          "declare module  '#toast' {",
          // `const sendMail: typeof import('${resolve('./runtime/server/services')}').sendMail`,
          '}',
        ].join('\n'),
    })
    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: resolve(nuxt.options.buildDir, 'types/toast.d.ts') })
    })

    logger.success(`${PACKAGE_NAME} module setup complete`)
  },
})
