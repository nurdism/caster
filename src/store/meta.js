/* ============
 * Mutation types for the meta module
 * ============
 *
 * The mutation types that are available
 * on the meta module.
 */
export const types = {
  META_CHANGED: 'META_CHANGED'
}

/* ============
 * Actions for the meta module
 * ============
 *
 * The actions that are available on the
 * meta module.
 */
export const actions = {
  changed ({ commit }, meta) {
    commit(types.META_CHANGED, meta)
  }
}

/* ============
 * Mutations for the meta module
 * ============
 *
 * The mutations that are available on the
 * meta module.
 */
export const mutations = {
  [types.META_CHANGED] (state, {route, current, matched}) {
    state.route = route
    state.current = current
    state.matched = matched
  }
}

/* ============
 * Getters for the meta module
 * ============
 *
 * The getters that are available on the
 * meta module.
 */
export const getters = {}

/* ============
 * State of the meta module
 * ============
 *
 * The initial state of the meta module.
 */
export const state = () => ({
  route: null,
  current: {},
  matched: []
})
