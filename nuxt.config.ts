// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  app: {
    head: {
      // charset: 'utf-16',
      // viewport: 'width=device-width, initial-scale=1',
      // title: 'ACS - A Leading Supplier of PMA Parts',
      meta: [
        {
          name: 'description',
          content:
            'ACS seeks not only to provide the best pricing in the industry, but to create value by stocking 100% of our inventory for next day delivery, offering eCommerce solutions for online customers, utilizing the latest data management technology, and offering the latest manufacturing / design solutions <a href="https://acs-parts.com">Browse ACS Catalog</a>.',
        },
        // {
        //   name: 'robots',
        //   content: 'index, follow',
        // },
      ],

      link: [
        // { rel: 'icon', type: 'image/x-icon', href: '/assets/favicon.ico' },

        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Merriweather+Sans:wght@300;400;500;600;700;800&family=Merriweather:wght@300;400;700;900&display=swap',
        },

        // <link rel="stylesheet" href="https://use.typekit.net/yge8xsm.css">

        // // Montserrat sans serif from Adobe
        // {
        //   rel: 'stylesheet',
        //   href: 'https://use.typekit.net/nwr4chk.css',
        // },

        // Proxima Nova sans serif from Adobe
        {
          rel: 'stylesheet',
          href: 'https://use.typekit.net/yge8xsm.css',
        },

        // Proxima Nova sans serif from Adobe
        // {
        //   rel: 'stylesheet',
        //   href: 'https://use.typekit.net/dto7hnb.css',
        // },
      ],

      script: [
        { src: 'https://js.stripe.com/v3/' },
        { src: `https://maps.googleapis.com/maps/api/js?libraries=places&key=${process.env.NUXT_GOOGLE_MAPS_API_KEY}` },
      ],

      // Inter, Merriweather serif & Merriweather Sans serif from Google
      // @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Merriweather+Sans:wght@300;400;500;600;700;800&family=Merriweather:wght@300;400;700;900&display=swap');

      // // Montserrat sans serif from Adobe
      // @import url('https://use.typekit.net/nwr4chk.css');

      // {
      //   name: 'canonical',
      //   content:'href="http://example.com/"'
      // },
    },
  },

  css: ['@/assets/scss/main.scss'],

  vite: {
    ssr: {
      noExternal: ['vuetify'],
    },
  },

  modules: [
    '@nuxt/content',
    'nuxt-icon',

    async (options, nuxt) => {
      // @ts-ignore
      nuxt.hooks.hook('vite:extendConfig', (config) => config.plugins.push(vuetify()))
    },
    // '@invictus.codes/nuxt-vuetify',
    // 'nuxt-csurf',
    // '@sidebase/nuxt-auth',

    // './modules/mongodb',
    // './modules/nuxt-session/module',
    // './modules/nuxt-mailer/module',
    // './modules/nuxt-security/module',
    // './modules/nuxt-auth/module',
    // './modules/nuxt-commerce',

    // ['./modules/mailer/module', {}],
    // ['./modules/session/module', {}],
  ],

  // vuetify: {
  //   /* vuetify options */
  //   vuetifyOptions: {
  //     // @TODO: list all vuetify options

  //     theme: {
  //       themes: {
  //         colors: {
  //           primary: '#DEBA33',
  //         },
  //       },
  //     },
  //   },

  //   moduleOptions: {
  //     /* nuxt-vuetify module options */
  //     treeshaking: true,
  //     // useIconCDN: true | false,

  //     /* vite-plugin-vuetify options */
  //     // styles: true | 'none' | 'expose' | 'sass' | { configFile: string },
  //     // autoImport: true | false,
  //   },
  // },

  // nuxtCommerce: {},

  runtimeConfig: {
    // mongoDb: {
    url: process.env.NUXT_MONGO_DB_URL,
    // },
    // sendgrid: {
    apiKey: process.env.NUXT_SENDGRID_API_KEY,
    // },

    // amazon: {
    bucketAccessKey: process.env.NUXT_BUCKET_ACCESS_KEY,
    bucketSecretAccessKey: process.env.NUXT_BUCKET_SECRET_ACCESS_KEY,
    // },
    // stripe: {
    stripeSk: process.env.NUXT_STRIPE_SK,
    stripeWsk: process.env.NUXT_STRIPE_WSK,
    // },
    // stripeWsk: process.env.NUXT_STRIPE_WSK,
    // jwtSecret: process.env.NUXT_JWT_SECRET,
    // jwtSignupTokenMaxAge: process.env.NUXT_JWT_SIGNUP_TOKEN_MAX_AGE,
    // jwtAuthTokenMaxAge: process.env.NUXT_JWT_AUTH_TOKEN_MAX_AGE,

    public: {
      apiUrl: '/api/v1/',
      companyName: process.env.NUXT_PUBLIC_COMPNAY_NAME,
      stripe: {
        stripePk: process.env.NUXT_PUBLIC_STRIPE_PK,
      },

      // amazon: {
      s3BaseUrl: process.env.NUXT_PUBLIC_S3_BASE_URL,
      // },
    },
  },
})
