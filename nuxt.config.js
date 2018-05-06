const { dependencies } = require('./src/package.json')
const { devDependencies } = require('./package.json')

module.exports = {
  mode: 'spa',
  router: {
    mode: 'hash',
    linkActiveClass: '',
    linkExactActiveClass: '',
    middleware: [
      'store'
    ]
  },

  loading: false,

  css: [
    '@/assets/css/global.scss'
  ],

  plugins: [
    '~/plugins/vue-caster.js',
    '~/plugins/vue-localstorage.js',
    '~/plugins/vue-sweetalert.js'
  ],

  modules: [
    ['nuxtjs-electron', {
      main: process.env.NUXT_ENV === 'development' ? 'main.dev.js' : 'main.js',
      build: {
        // warnings: false,
        extend (config, options, nuxt) {
          config.externals = [
            ...Object.keys(dependencies || {}),
            ...Object.keys(devDependencies || {})
          ]

          config.module.rules.push({
            enforce: 'pre',
            test: /\.(js)$/,
            loader: 'eslint-loader',
            exclude: /(node_modules)/
          })
        }
      }
    }]
  ],

  build: {
    vendor: [
      'sweetalert'
    ],

    postcss: {
      plugins: {
        'postcss-custom-properties': {
          warnings: false
        }
      }
    },

    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        // Run ESLint on save
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },

  dev: process.env.NUXT_ENV === 'development',
  debug: process.env.NUXT_DEBUG === 'true',
  srcDir: './src/'
}
