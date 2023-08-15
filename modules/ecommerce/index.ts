import {
  defineNuxtModule,
  useLogger,
  createResolver,
  addImportsDir,
  addPlugin,
  addComponent,
  addServerHandler,
  addImports,
  addTemplate,
} from '@nuxt/kit'

import { defu } from 'defu'
import { randomBytes } from 'crypto'

const PACKAGE_NAME = 'ecommerce'
const defaults = {
  isEnabled: true,
  cookieName: 'cart_token',
  cookieOpts: {
    path: '/',
    httpOnly: true,
    sameSite: true,
    secure: false,
    maxAge: 24 * 60 * 50,
  },
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
    nuxt.options.runtimeConfig.ecommerce = defu(nuxt.options.runtimeConfig.ecommerce, options)
    nuxt.options.runtimeConfig.public.ecommerce = defu(nuxt.options.runtimeConfig.public.ecommerce, {})

    // 3. Locate runtime directory
    const { resolve } = createResolver(import.meta.url)

    // 4. Setup middleware,
    addServerHandler({ handler: resolve('runtime/server/middleware') })
    // 4. Setup middleware,
    // addServerHandler({ handler: resolve('runtime/server/middleware') })
    // addServerHandler({ handler: resolve('runtime/server/middleware/session') })

    // 5. Add plugin
    // addPlugin(resolve('runtime/plugin'))

    // 5. Create virtual imports for server-side
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}
      nitroConfig.externals = defu(typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {}, {
        inline: [resolve('./runtime')],
      })
      nitroConfig.alias['#ecommerce'] = resolve('./runtime/server/services')
    })
    addTemplate({
      filename: 'types/ecommerce.d.ts',
      getContents: () =>
        [
          "declare module  '#ecommerce' {",
          `const updateCartSession: typeof import('${resolve('./runtime/server/services')}').updateCartSession`,
          `const fetchCartSession: typeof import('${resolve('./runtime/server/services')}').fetchCartSession`,
          // `const fetchProducts: typeof import('${resolve('./runtime/server/services')}').fetchProducts`,
          '}',
        ].join('\n'),
    })
    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: resolve(nuxt.options.buildDir, 'types/ecommerce.d.ts') })
    })

    // 5. Register desired auth API endpoints
    // addServerHandler({
    //   route: `/api/v1/ecommerce`,
    //   handler: resolve(`./runtime/server/api/v1/ecommerce/index.get`),
    // })
    // addServerHandler({
    //   route: `/api/v1/ecommerce/fetchById`,
    //   handler: resolve(`./runtime/server/api/v1/ecommerce/fetchById.get`),
    // })
    // addServerHandler({
    //   route: `/api/v1/ecommerce/deleteById`,
    //   handler: resolve(`./runtime/server/api/v1/ecommerce/deleteById.delete`),
    // })
    // addServerHandler({
    //   route: `/api/v1/ecommerce/search`,
    //   handler: resolve(`./runtime/server/api/v1/ecommerce/search.get`),
    // })

    // // Products
    // addServerHandler({
    //   route: `/api/v1/ecommerce/products/migrate`,
    //   handler: resolve(`./runtime/server/api/v1/ecommerce/products/migrate.post`),
    // })
    // addServerHandler({
    //   route: `/api/v1/ecommerce/products`,
    //   handler: resolve(`./runtime/server/api/v1/ecommerce/products/index.put`),
    // })
    // addServerHandler({
    //   route: `/api/v1/ecommerce/products/index`,
    //   handler: resolve(`./runtime/server/api/v1/ecommerce/products/index.get`),
    // })
    // addServerHandler({
    //   route: `/api/v1/ecommerce/products`,
    //   handler: resolve(`./runtime/server/api/v1/ecommerce/products/index.post`),
    // })

    // categories
    // addServerHandler({
    //   route: `/api/v1/ecommerce/categories`,
    //   handler: resolve(`./runtime/server/api/v1/ecommerce/categories/index.post`),
    // })

    // addServerHandler({
    //   route: `/api/v1/ecommerce/categories`,
    //   handler: resolve(`./runtime/server/api/v1/ecommerce/categories/index.put`),
    // })
    // addServerHandler({
    //   route: `/api/v1/ecommerce/categories`,
    //   handler: resolve(`./runtime/server/api/v1/ecommerce/categories/index.get`),
    // })

    // Cart
    // addServerHandler({
    //   route: `/api/v1/ecommerce/cart/index`,
    //   handler: resolve(`./runtime/server/api/v1/ecommerce/cart/index.post`),
    // })
    // addServerHandler({
    //   route: `/api/v1/ecommerce/stripe/intent`,
    //   handler: resolve(`./runtime/server/api/v1/ecommerce/stripe/intent.post`),
    // })

    logger.info(
      `ecommerce API's "categories/index.get", "products/migrate", "products/index.get", "products/index.post" endpoint registered at api/v1/ecommerce/`
    )

    // Admin
    // addComponent({
    //   name: 'AdminImageGallery',
    //   filePath: resolve('runtime/components/admin/ImageGallery.vue'),
    // })
    // addComponent({
    //   name: 'AdminActions',
    //   filePath: resolve('runtime/components/admin/Actions.vue'),
    // })

    // Products
    // addComponent({
    //   name: 'ProductsMigrate',
    //   filePath: resolve('runtime/components/admin/products/Migrate.vue'),
    // })
    // addComponent({
    //   name: 'ProductsList',
    //   filePath: resolve('runtime/components/products/List.vue'),
    // })
    // addComponent({
    //   name: 'ProductBenefits',
    //   filePath: resolve('runtime/components/products/Benefits.vue'),
    // })
    // addComponent({
    //   name: 'ProductAccessories',
    //   filePath: resolve('runtime/components/products/Accessories.vue'),
    // })
    // addComponent({
    //   name: 'ProductModule',
    //   filePath: resolve('runtime/components/products/Module.vue'),
    // })
    // addComponent({
    //   name: 'ProductLamps',
    //   filePath: resolve('runtime/components/products/Lamps.vue'),
    // })
    // addComponent({
    //   name: 'AdminProductsList',
    //   filePath: resolve('runtime/components/admin/products/List.vue'),
    // })
    // addComponent({
    //   name: 'AdminProductEdit',
    //   filePath: resolve('runtime/components/admin/products/Edit.vue'),
    // })
    // addComponent({
    //   name: 'AdminProductDetails',
    //   filePath: resolve('runtime/components/admin/products/Details.vue'),
    // })
    // addComponent({
    //   name: 'AdminProductPrice',
    //   filePath: resolve('runtime/components/admin/products/Price.vue'),
    // })
    // addComponent({
    //   name: 'AdminProductShipping',
    //   filePath: resolve('runtime/components/admin/products/Shipping.vue'),
    // })
    // addComponent({
    //   name: 'AdminProductTaxes',
    //   filePath: resolve('runtime/components/admin/products/Taxes.vue'),
    // })
    // addComponent({
    //   name: 'AdminProductRelated',
    //   filePath: resolve('runtime/components/admin/products/Related.vue'),
    // })
    // addComponent({
    //   name: 'AdminProductCategories',
    //   filePath: resolve('runtime/components/admin/products/ProductCategories.vue'),
    // })

    // addComponent({
    //   name: 'AdminProductCrossUpSells',
    //   filePath: resolve('runtime/components/admin/products/CrossUpSells.vue'),
    // })
    // addComponent({
    //   name: 'AdminProductUpSells',
    //   filePath: resolve('runtime/components/admin/products/UpSells.vue'),
    // })

    // Categories
    // addComponent({
    //   name: 'AdminCategoriesList',
    //   filePath: resolve('runtime/components/admin/categories/List.vue'),
    // })
    // addComponent({
    //   name: 'AdminCategoryEdit',
    //   filePath: resolve('runtime/components/admin/categories/Edit.vue'),
    // })
    // addComponent({
    //   name: 'AdminCategoryDetails',
    //   filePath: resolve('runtime/components/admin/categories/Details.vue'),
    // })
    // addComponent({
    //   name: 'AdminCategoryImageGallery',
    //   filePath: resolve('runtime/components/admin/categories/ImageGallery.vue'),
    // })

    // Cart
    // addComponent({
    //   name: 'Cart',
    //   filePath: resolve('runtime/components/cart/Cart.vue'),
    // })

    // addComponent({
    //   name: 'CartTotal',
    //   filePath: resolve('runtime/components/cart/Total.vue'),
    // })
    // addComponent({
    //   name: 'EcommerceItemCard',
    //   filePath: resolve('runtime/components/cart/EcommerceItemCard.vue'),
    // })
    // addComponent({
    //   name: 'EcommerceCartItems',
    //   filePath: resolve('runtime/components/cart/Items.vue'),
    // })
    // addComponent({
    //   name: 'CartPrice',
    //   filePath: resolve('runtime/components/cart/Price.vue'),
    // })
    // addComponent({
    //   name: 'EcommerceEmptyCart',
    //   filePath: resolve('runtime/components/cart/Empty.vue'),
    // })

    // Checkout
    // addComponent({
    //   name: 'Checkout',
    //   filePath: resolve('runtime/components/checkout/Checkout.vue'),
    // })
    // addComponent({
    //   name: 'Steps',
    //   filePath: resolve('runtime/components/checkout/Steps.vue'),
    // })
    // addComponent({
    //   name: 'Payment',
    //   filePath: resolve('runtime/components/checkout/Payment.vue'),
    // })

    // 4. Add composables
    addImportsDir(resolve('runtime/composables'))

    addPlugin(resolve('./runtime/plugin'))

    logger.success(`${PACKAGE_NAME} module setup complete`)
  },
})
