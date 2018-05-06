import createLogger from 'vuex/dist/logger'

export default {
  plugins: process.env.NUXT_ENV !== 'production' ? [createLogger()] : []
}
