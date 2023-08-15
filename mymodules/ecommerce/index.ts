import { useLogger, createResolver, defineNuxtModule, addServerHandler } from 'nuxt/kit'
import { defu } from 'defu'

const PACKAGE_NAME = 'ecommerce'
const defaults = {
  isEnabled: true,
}

export default defineNuxtModule({
  meta: {
    name: `@YRL/${PACKAGE_NAME}`,
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
    nuxt.options.runtimeConfig.ecommerce = defu(nuxt.options.runtimeConfig.ecommerce, options)

    // 3. Locate runtime directory
    const { resolve } = createResolver(import.meta.url)

    // 5. Register desired auth API endpoints

    addServerHandler({
      route: `api/v1/products/migrate`,
      handler: resolve(`./runtime/server/api/v1/products/migrate.post`),
    })
    logger.info(`Ecommerce API "migrate.post" endpoint registered at api/v1/products/migrate`)
  },
})
