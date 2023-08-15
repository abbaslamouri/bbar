// import { useLogger, addTemplate, createResolver, defineNuxtModule } from 'nuxt/kit'
// import { defu } from 'defu'
// import { MongoClient, ServerApiVersion } from 'mongodb'
// import productSchema from '../../server/mongoDbSchemas/product'
// import userSchema from '../../server/mongoDbSchemas/user'

// const PACKAGE_NAME = 'mongoDb'
// const defaults = {
//   isEnabled: true,
// }

// export default defineNuxtModule({
//   meta: {
//     name: `${PACKAGE_NAME}`,
//   },
//   defaults,
//   hooks: {},

//   async setup(moduleOptions, nuxt) {
//     // 1. Initializelogger
//     const logger = useLogger(PACKAGE_NAME)

//     // 1. Check if module should be enabled at all
//     if (!moduleOptions.isEnabled) {
//       logger.info(`Skipping ${PACKAGE_NAME} setup, as module is disabled`)
//       return
//     }
//     logger.info(`${PACKAGE_NAME} module setup starting...`)

//     // 2. Set up runtime configuration
//     const options = defu(moduleOptions, defaults)
//     nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || { public: {} }
//     nuxt.options.runtimeConfig.mongoDb = defu(nuxt.options.runtimeConfig.mongoDb, options)

//     // 3. Locate runtime directory
//     const { resolve } = createResolver(import.meta.url)

//     // 5. Create virtual imports for server-side
//     nuxt.hook('nitro:config', (nitroConfig) => {
//       nitroConfig.alias = nitroConfig.alias || {}
//       // Inline module runtime in Nitro bundle
//       nitroConfig.externals = defu(typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {}, {
//         inline: [resolve('./runtime')],
//       })
//       nitroConfig.alias['#mongoDb'] = resolve('./runtime/server/services')
//     })
//     addTemplate({
//       filename: 'types/mongoDb.d.ts',
//       getContents: () =>
//         [
//           "declare module  '#mongoDb' {",
//           `const mongoDbClient: typeof import('${resolve('./runtime/server/services')}').mongoDbClient`,
//           // `const createUser: typeof import('${resolve('./runtime/server/services')}').createUser`,
//           // `const findUserByEmail: typeof import('${resolve('./runtime/server/services')}').findUserByEmail`,
//           // `const findUserByIdAndUpdate: typeof import('${resolve('./runtime/server/services')}').findUserByIdAndUpdate`,
//           // `  const findUserById: typeof import('${resolve('./runtime/server/services')}').findUserById`,
//           // `  const createToken: typeof import('${resolve('./runtime/server/services')}').createToken`,
//           // `  const createCsrfCookie: typeof import('${resolve('./runtime/server/services')}').createCsrfCookie`,
//           // `  const verifyCsrfKey: typeof import('${resolve('./runtime/server/services')}').verifyCsrfKey`,
//           // `  const createUserSession: typeof import('${resolve('./runtime/server/services')}').createUserSession`,
//           // `  const updateUserSession: typeof import('${resolve('./runtime/server/services')}').updateUserSession`,
//           // `  const getUserSession: typeof import('${resolve('./runtime/server/services')}').getUserSession`,
//           // `  const removeUserSession: typeof import('${resolve('./runtime/server/services')}').removeUserSession`,
//           // `  const createSessionKey: typeof import('${resolve('./runtime/server/services')}').createSessionKey`,
//           // `  const verifySessionKey: typeof import('${resolve('./runtime/server/services')}').verifySessionKey`,
//           // `  const checkPassword: typeof import('${resolve('./runtime/server/services')}').checkPassword`,
//           // `  const fetcheUserSession: typeof import('${resolve('./runtime/server/services')}').fetcheUserSession`,
//           // `  const protect: typeof import('${resolve('./runtime/server/services')}').protect`,
//           // `  const getUserSession: typeof import('${resolve('./runtime/server/services')}').getUserSession`,
//           '}',
//         ].join('\n'),
//     })
//     nuxt.hook('prepare:types', (options) => {
//       options.references.push({ path: resolve(nuxt.options.buildDir, 'types/mongoDb.d.ts') })
//     })

//     const mongoDbClient = new MongoClient(process.env.NUXT_MONGO_DB_URL as string, {
//       serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//       },
//     })
//     await mongoDbClient.connect()
//     console.log(`Database connection succesfull`)

//     const collections = await mongoDbClient.db().listCollections().toArray()
//     await mongoDbClient.db('admin').command({ ping: 1 })
//     console.log('Pinged your deployment. You successfully connected to MongoDB!')

//     // create products collection if it does not exists
//     if (!collections.find((p) => p.name === 'products')) {
//       await mongoDbClient.db().createCollection('products', productSchema)
//       await mongoDbClient.db().collection('products').createIndex({ name: 1 }, { unique: true })
//       console.log(`Products database creation succesfull`)
//     }

//     // Create users collection if it does not exist
//     if (!collections.find((c) => c.name === 'users')) {
//       await mongoDbClient.db().createCollection('users', userSchema)
//       await mongoDbClient.db().collection('users').createIndex({ email: 1 }, { unique: true })
//       console.log(`Users database creation succesfull`)
//     }

//     // // 5. Register desired auth API endpoints
//     // addServerHandler({
//     //   route: `/api/v1/auth/signup`,
//     //   handler: resolve(`./runtime/server/api/v1/auth/signup.post`),
//     // })
//     // logger.info(`auth API "signup.post" endpoint registered at api/v1/auth/signup.post`)

//     // addServerHandler({
//     //   route: `/api/v1/auth/verify`,
//     //   handler: resolve(`./runtime/server/api/v1/auth/verify.post`),
//     // })
//     // logger.info(`auth API "verify.post" endpoint registered at api/v1/auth/verify.post`)

//     // // 5. Register desired auth components
//     // addComponent({
//     //   name: 'SignUp', // name of the component to be used in vue templates
//     //   filePath: resolve('runtime/components/SignUp.vue'),
//     // })
//     // addComponent({
//     //   name: 'Verify', // name of the component to be used in vue templates
//     //   filePath: resolve('runtime/components/Verify.vue'),
//     // })

//     logger.success(`${PACKAGE_NAME} module setup complete`)
//   },
// })
