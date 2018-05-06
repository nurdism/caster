import IPCRender from './ipc'

class MainError extends Error {
  constructor (object) {
    super()
    this.message = object.message || null
    this.stack = object.stack || null
  }
}

export default class Caster extends IPCRender {
  constructor (store) {
    super()

    this.store = store

    const data = this.callSync('init')
    if (data.ready) { this.store.dispatch('client/ready', { ready: true }) }
    if (data.connected) { this.store.dispatch('client/connected', { connected: true }) }

    this
      .on('client:ready', args => { this.store.dispatch('client/ready', args) })
      .on('client:connected', args => { this.store.dispatch('client/connected', args) })
      .on('session:started', args => { this.store.dispatch('session/status', args) })
      .on('session:paused', args => { this.store.dispatch('session/status', args) })
      .on('session:resumed', args => { this.store.dispatch('session/status', args) })
      .on('session:stopped', args => { this.store.dispatch('session/status', args) })
      // .on('session:saved', args => { this.store.dispatch('session/saved', args) })
      // .on('session:archived', args => { this.store.dispatch('session/saved', args) })

      .on('connection:ready', args => { this.store.dispatch('session/connection', args) })
      .on('connection:destroy', args => { this.store.dispatch('session/connection', args) })

      .on('member:joined', args => { })
      .on('member:left', args => { })

      .on('speaking:start', args => { })
      .on('speaking:end', args => { })

      .on('exporter:ready', args => { })
      .on('exporter:start', args => { })
      .on('exporter:extracting', args => { })
      .on('exporter:extracted', args => { })
      .on('exporter:loading', args => { })
      .on('exporter:processing', args => { })
      .on('exporter:processed', args => { })
      .on('exporter:file', args => { })
      .on('exporter:decoding', args => { })
      .on('exporter:saving', args => { })
      .on('exporter:saved', args => { })
      .on('exporter:done', args => { })

      .on('error', err => console.error(new MainError(err)))
      .on('warn', warn => console.warn(warn))
  }

  async login (token) {
    return this.callAsync('login', { token })
  }

  async invite () {
    return this.callAsync('invite')
  }

  async join (channel) {
    return this.callAsync('join', { channel })
  }

  async tts (text) {
    return this.callAsync('tts', { text })
  }

  async leave () {
    return this.callAsync('leave')
  }

  async start () {
    return this.callAsync('start')
  }

  async pause () {
    return this.callAsync('pause')
  }

  async resume () {
    return this.callAsync('resume')
  }

  async stop () {
    return this.callAsync('stop')
  }

  async open () {
    return this.callAsync('open')
  }

  user () {
    return this.callSync('user')
  }

  users () {
    return this.callSync('users')
  }

  guilds () {
    return this.callSync('guilds')
  }

  channels (guild) {
    return this.callSync('channels', { guild })
  }

  members (guild) {
    return this.callSync('members', { guild })
  }
}
