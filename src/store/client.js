/* ============
 * Mutation types for the client module
 * ============
 *
 * The mutation types that are available
 * on the client module.
 */
export const types = {
  CLIENT_READY: 'CLIENT_READY',
  CLIENT_CONNECTED: 'CLIENT_CONNECTED'
}

/* ============
 * Actions for the client module
 * ============
 *
 * The actions that are available on the
 * client module.
 */
export const actions = {
  ready ({ commit }, payload) {
    commit(types.CLIENT_READY, payload)
    if (payload.connected) {
      commit(types.CLIENT_CONNECTED, payload)
    }
    this.$router.push({ name: 'home' })
  },

  connected ({ commit }, payload) {
    commit(types.CLIENT_CONNECTED, payload)
  }
}

/* ============
 * Mutations for the client module
 * ============
 *
 * The mutations that are available on the
 * client module.
 */
export const mutations = {
  [types.CLIENT_READY] (state, { ready }) {
    state.ready = ready
  },
  [types.CLIENT_CONNECTED] (state, { connected }) {
    state.connected = connected
  }
}

/* ============
 * Getters for the client module
 * ============
 *
 * The getters that are available on the
 * client module.
 */
export const getters = {}

/* ============
 * State of the client module
 * ============
 *
 * The initial state of the client module.
 */
export const state = () => ({
  ready: false,
  connected: false
})
