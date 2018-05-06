/* ============
 * Mutation types for the session module
 * ============
 *
 * The mutation types that are available
 * on the session module.
 */
export const types = {
  SESSION_STATUS: 'SESSION_STATUS',
  SESSION_CONNECTED: 'SESSION_CONNECTED',
  SESSION_CHANNEL: 'SESSION_CHANNEL'
}

/* ============
 * Actions for the session module
 * ============
 *
 * The actions that are available on the
 * session module.
 */
export const actions = {
  connection ({ commit }, payload) {
    commit(types.SESSION_CHANNEL, payload)
    commit(types.SESSION_CONNECTED, payload)
  },
  status ({ commit }, payload) {
    commit(types.SESSION_STATUS, payload)
  }
}

/* ============
 * Mutations for the session module
 * ============
 *
 * The mutations that are available on the
 * session module.
 */
export const mutations = {
  [types.SESSION_STATUS] (state, { status }) {
    state.status = status
  },
  [types.SESSION_CHANNEL] (state, { channel }) {
    state.channel = channel
  },
  [types.SESSION_CONNECTED] (state, { connected }) {
    state.connected = connected
  }
}

/* ============
 * Getters for the session module
 * ============
 *
 * The getters that are available on the
 * session module.
 */
export const getters = {}

/* ============
 * State of the session module
 * ============
 *
 * The initial state of the session module.
 */
export const state = () => ({
  status: 'stopped',
  connected: false,
  channel: null,
  archive: null
})
