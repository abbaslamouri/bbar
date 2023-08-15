import {
  defineNuxtModule,
  useLogger,
  createResolver,
  addPlugin,
  addServerHandler,
  addTemplate,
  addImportsDir,
} from '@nuxt/kit'
import { defu } from 'defu'

import { randomBytes } from 'crypto'

const PACKAGE_NAME = 'csrf'
const defaults = {
  isEnabled: true,
  cookieName: 'csrf_token',
  cookieOpts: {
    path: '/',
    httpOnly: true,
    sameSite: true,
    secure: false,
    // maxAge: 1, //ß24 * 60 * 60,
  },
  encryptSecret: randomBytes(22).toString('base64'),
  xss: {
    whiteList: {
      a: [],
    },
    stripIgnoreTag: true,
    throwError: false, // optional
  },
  encryptAlgorithm: 'aes-256-cbc',
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

    // 1. Check if module should be enabled at all
    if (!moduleOptions.isEnabled) {
      logger.info(`Skipping ${PACKAGE_NAME} setup, as module is disabled`)
      return
    }
    logger.info(`${PACKAGE_NAME} module setup starting...`)

    // 2. Set up runtime configuration
    const options = defu(moduleOptions, defaults)
    nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || { public: {} }
    nuxt.options.runtimeConfig.csrf = defu(nuxt.options.runtimeConfig.csrf, options)

    // const options = defu(moduleOptions, defaults)
    // nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || { public: {} }
    // nuxt.options.runtimeConfig.csrf = defu(nuxt.options.runtimeConfig.csrf, options)
    // nuxt.options.runtimeConfig.public.csrf = defu(nuxt.options.runtimeConfig.public.csrf, {})

    // 3. Locate runtime directory
    const { resolve } = createResolver(import.meta.url)

    // 4. Setup middleware,
    addServerHandler({ handler: resolve('runtime/server/middleware') })

    // 5. Create virtual imports for server-side
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}
      nitroConfig.externals = defu(typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {}, {
        inline: [resolve('./runtime')],
      })
      nitroConfig.alias['#csrf'] = resolve('./runtime/server/services')
    })
    addTemplate({
      filename: 'types/csrf.d.ts',
      getContents: () =>
        [
          "declare module  '#csrf' {",
          `const createCsrfToken: typeof import('${resolve('./runtime/server/services')}').createCsrfToken`,
          `const verifyCsrfToken: typeof import('${resolve('./runtime/server/services')}').verifyCsrfToken`,
          '}',
        ].join('\n'),
    })
    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: resolve(nuxt.options.buildDir, 'types/csrf.d.ts') })
    })

    // 4. Add composables
    addImportsDir(resolve('runtime/composables'))

    // 6. Add plugin for initial load
    addPlugin(resolve('./runtime/plugin'))

    logger.success(`${PACKAGE_NAME} module setup complete`)
  },
})
