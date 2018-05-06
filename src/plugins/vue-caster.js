import Caster from '~/lib/renderer/caster'

export default ({ app: { store } }, inject) => {
  const client = new Caster(store)
  inject('caster', client)
}
