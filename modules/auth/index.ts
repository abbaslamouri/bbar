import {
  useLogger,
  addTemplate,
  createResolver,
  addComponent,
  defineNuxtModule,
  addServerHandler,
  addImportsDir,
  addPlugin,
} from 'nuxt/kit'
import { defu } from 'defu'
import { randomBytes } from 'crypto'

const PACKAGE_NAME = 'auth'
const defaults = {
  isEnabled: true,
  session: {
    password: 'BVGgasutDF9MM1EGAMhK06tTJCoGUw==',
    name: 'user_session',
    maxAge: 24 * 60 * 60,
  },
  cookieName: 'auth_token',
  encryptAlgorithm: 'aes-256-cbc',
  cookieOpts: {
    path: '/',
    httpOnly: true,
    sameSite: true,
    secure: false,
    maxAge: 24 * 60 * 60,
  },
  encryptSecret: 'HTLdy4JBHH15DmoZtXJ0TYG88DmDYg==', // randomBytes(22).toString('base64'),
  jwtSecret: 'Fx/40HaSSFa/GgpIzS5NQqXGn43xJw==', // randomBytes(22).toString('base64'),
  jwtMaxAge: 24 * 60 * 60,
  sessionPassword: randomBytes(32).toString('hex'),
  passwordResetToken: randomBytes(32).toString('hex'),
  passwordResetExpires: 5 * 24 * 60 * 50 * 1000,
  xss: {
    whiteList: {
      a: [],
    },
    stripIgnoreTag: true,
    throwError: false, // optional
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
    nuxt.options.runtimeConfig.auth = defu(nuxt.options.runtimeConfig.auth, options)

    // logger.info(`RANDOM ${randomBytes(22).toString('base64')}`)

    // 3. Locate runtime directory
    const { resolve } = createResolver(import.meta.url)

    // 4. Setup middleware,
    addServerHandler({ handler: resolve('runtime/server/middleware') })

    // 5. Create virtual imports for server-side
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}
      // Inline module runtime in Nitro bundle
      nitroConfig.externals = defu(typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {}, {
        inline: [resolve('./runtime')],
      })
      nitroConfig.alias['#auth'] = resolve('./runtime/server/services')
    })
    addTemplate({
      filename: 'types/auth.d.ts',
      getContents: () =>
        [
          "declare module  '#auth' {",
          `const getSinedJwtToken: typeof import('${resolve('./runtime/server/services')}').getSinedJwtToken`,
          `const hashPassword: typeof import('${resolve('./runtime/server/services')}').hashPassword`,
          `const storage: typeof import('${resolve('./runtime/server/services')}').storage`,
          `const findUserByEmail: typeof import('${resolve('./runtime/server/services')}').findUserByEmail`,
          `const findUserByIdAndUpdate: typeof import('${resolve('./runtime/server/services')}').findUserByIdAndUpdate`,
          `const findUserById: typeof import('${resolve('./runtime/server/services')}').findUserById`,
          `const hashToken: typeof import('${resolve('./runtime/server/services')}').hashToken`,
          // `const sendRegistrationToken: typeof import('${resolve('./runtime/server/services')}').sendRegistrationToken`,
          // `const sendForgotPasswordToken: typeof import('${resolve(
          //   './runtime/server/services'
          // )}').sendForgotPasswordToken`,
          `const isAuthorized: typeof import('${resolve('./runtime/server/services')}').isAuthorized`,
          `const encryptToken: typeof import('${resolve('./runtime/server/services')}').encryptToken`,
          `const decryptToken: typeof import('${resolve('./runtime/server/services')}').decryptToken`,
          // `  const createCsrfCookie: typeof import('${resolve('./runtime/server/services')}').createCsrfCookie`,
          // `  const verifyCsrfKey: typeof import('${resolve('./runtime/server/services')}').verifyCsrfKey`,
          `const createUserSession: typeof import('${resolve('./runtime/server/services')}').createUserSession`,
          // `  const updateUserSession: typeof import('${resolve('./runtime/server/services')}').updateUserSession`,
          `const fetchUserSession: typeof import('${resolve('./runtime/server/services')}').fetchUserSession`,
          `const removeUserSession: typeof import('${resolve('./runtime/server/services')}').removeUserSession`,
          // `  const createSessionKey: typeof import('${resolve('./runtime/server/services')}').createSessionKey`,
          // `  const verifySessionKey: typeof import('${resolve('./runtime/server/services')}').verifySessionKey`,
          // `  const checkPassword: typeof import('${resolve('./runtime/server/services')}').checkPassword`,
          // `  const fetcheUserSession: typeof import('${resolve('./runtime/server/services')}').fetcheUserSession`,
          // `  const protect: typeof import('${resolve('./runtime/server/services')}').protect`,
          // `  const getUserSession: typeof import('${resolve('./runtime/server/services')}').getUserSession`,
          '}',
        ].join('\n'),
    })
    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: resolve(nuxt.options.buildDir, 'types/auth.d.ts') })
    })

    // 5. Register desired auth API endpoints
    addServerHandler({
      route: `/api/v1/auth/signup`,
      handler: resolve(`./runtime/server/api/v1/auth/signup.post`),
    })
    addServerHandler({
      route: `/api/v1/auth/signup-password`,
      handler: resolve(`./runtime/server/api/v1/auth/signup-password.post`),
    })
    addServerHandler({
      route: `/api/v1/auth/signup-token`,
      handler: resolve(`./runtime/server/api/v1/auth/signup-token.post`),
    })
    // logger.info(`auth API "signup.post" endpoint registered at api/v1/auth/signup.post`)
    addServerHandler({
      route: `/api/v1/auth/verify-email`,
      handler: resolve(`./runtime/server/api/v1/auth/verify-email.post`),
    })
    // logger.info(`auth API "verify.post" endpoint registered at api/v1/auth/verify.post`)
    addServerHandler({
      route: `/api/v1/auth/signin`,
      handler: resolve(`./runtime/server/api/v1/auth/signin.post`),
    })
    // logger.info(`auth API "signin.post" endpoint registered at api/v1/auth/signin.post`)
    addServerHandler({
      route: `/api/v1/auth/signout`,
      handler: resolve(`./runtime/server/api/v1/auth/signout.post`),
    })
    // logger.info(`auth API "signout.post" endpoint registered at api/v1/auth/signout.post`)
    addServerHandler({
      route: `/api/v1/auth/forgot-password`,
      handler: resolve(`./runtime/server/api/v1/auth/forgot-password.post`),
    })
    // logger.info(`auth API "forgot-password.post" endpoint registered at api/v1/auth/forgot-password.post`)
    addServerHandler({
      route: `/api/v1/auth/reset-password`,
      handler: resolve(`./runtime/server/api/v1/auth/reset-password.post`),
    })

    addServerHandler({
      route: `/api/v1/session`,
      handler: resolve(`./runtime/server/api/v1/session/index.get`),
    })

    logger.info(
      `auth API's "signup", "signup-token", "verify", "signin",  "signout", "reset-password" endpoint registered at api/v1/auth/`
    )

    // 5. Register desired auth components
    // addComponent({
    //   name: 'Auth',
    //   filePath: resolve('runtime/components/Auth.vue'),
    // })
    addComponent({
      name: 'SignUp',
      filePath: resolve('runtime/components/SignUp.vue'),
    })
    addComponent({
      name: 'SignUpPassword',
      filePath: resolve('runtime/components/SignUpPassword.vue'),
    })
    addComponent({
      name: 'SignIn',
      filePath: resolve('runtime/components/SignIn.vue'),
    })
    addComponent({
      name: 'VerifyEmail',
      filePath: resolve('runtime/components/VerifyEmail.vue'),
    })
    addComponent({
      name: 'RefreshToken',
      filePath: resolve('runtime/components/RefreshToken.vue'),
    })
    addComponent({
      name: 'ForgotPassword',
      filePath: resolve('runtime/components/ForgotPassword.vue'),
    })
    addComponent({
      name: 'ResetPassword',
      filePath: resolve('runtime/components/ResetPassword.vue'),
    })
    // addComponent({
    //   name: 'SignupRequestSent',
    //   filePath: resolve('runtime/components/SignupRequestSent.vue'),
    // })
    // addComponent({
    //   name: 'PasswordRecoverySent',
    //   filePath: resolve('runtime/components/PasswordRecoverySent.vue'),
    // })
    // addComponent({
    //   name: 'Verify',
    //   filePath: resolve('runtime/components/Verify.vue'),
    // })
    // addComponent({
    //   name: 'SignIn',
    //   filePath: resolve('runtime/components/SignIn.vue'),
    // })
    // addComponent({
    //   name: 'ForgotPassword',
    //   filePath: resolve('runtime/components/ForgotPassword.vue'),
    // })
    // addComponent({
    //   name: 'ResetPassword',
    //   filePath: resolve('runtime/components/ResetPassword.vue'),
    // })

    // 4. Add composables
    addImportsDir(resolve('runtime/composables'))

    addPlugin(resolve('./runtime/plugin'))

    logger.success(`${PACKAGE_NAME} module setup complete`)
  },
})
