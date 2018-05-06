export default ({ store, route, redirect }) => {
  if (route.name !== store.state.meta.route) {
    store.dispatch('meta/changed', { route: route.name, matched: route.meta, current: route.meta[route.meta.length - 1] || {} })
  }

  // if ((route.name !== 'index' || route.name!== 'setup') && !store.state.client.ready) {
  // do something?
  // }
}
