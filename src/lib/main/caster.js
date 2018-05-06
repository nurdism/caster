import { Client } from 'discord.js'
import SessionManager from './session'
import Exporter from './exporter'
import IPCMain from './ipc'
import { install } from 'ffmpeg-binaries'
import _ from 'lodash'

export default class Caster extends IPCMain {
  constructor (window) {
    super(window)

    this.ready = false
    this.connected = false

    this.client = new Client()
    this.client
      .on('error', err => console.error) // eslint-disable-line handle-callback-err
      .on('warn', warn => console.warn)
      .on('ready', async () => {
        this.ready = true
        this.connected = true
        await install()
        this.emit('client:ready', { ready: true, connected: true })
      })
      .on('disconnect', () => {
        this.connected = false
        this.emit('client:connected', { connected: true })
      })
      .on('resume', () => {
        this.connected = true
        this.emit('client:connected', { connected: false })
      })

    this.session = new SessionManager(this.client)
    this.session
      .on('error', err => console.error) // eslint-disable-line handle-callback-err
      .on('warn', warn => console.warn)

      .on('session:ready', () => { this.emit('session:ready') })
      .on('session:started', () => { this.emit('session:started', { status: 'started' }) })
      .on('session:paused', () => { this.emit('session:paused', { status: 'paused' }) })
      .on('session:resumed', () => { this.emit('session:resumed', { status: 'resumed' }) })
      .on('session:stopped', () => { this.emit('session:stopped', { status: 'stopped' }) })
      .on('session:saved', data => { this.emit('session:saved', { session: data }) })
      .on('session:archived', archive => { this.emit('session:archived', { archive }) })
      .on('session:reset', () => { this.emit('session:reset') })

      .on('connection:ready', connection => {
        this.emit('connection:ready', { connected: true, channel: _.pick(connection.channel, ['id', 'name', 'bitrate', 'userLimit', 'full', 'speakable', 'joinable', 'parentID', 'position']) })
      })
      .on('connection:destroy', () => {
        this.emit('connection:destroy', { connected: false, channel: null })
      })

      .on('member:joined', member => { this.emit('member:joined', {}) })
      .on('member:left', member => { this.emit('member:left', {}) })

      .on('speaking:start', user => { this.emit('speaking:start', {}) })
      .on('speaking:end', user => { this.emit('speaking:end', {}) })

    this.exporter = new Exporter()
    this.exporter
      .on('error', err => console.error) // eslint-disable-line handle-callback-err
      .on('warn', warn => console.warn)

      .on('exporter:ready', () => { })
      .on('exporter:start', (open, save) => { })
      .on('exporter:extracting', (file, dest) => { })
      .on('exporter:extracted', (file, dest) => { })
      .on('exporter:loading', session => { })
      .on('exporter:processing', user => { })
      .on('exporter:processed', user => { })
      .on('exporter:file', (file, clip) => { })
      .on('exporter:decoding', (file, options) => { })
      .on('exporter:saving', (dest, file) => { })
      .on('exporter:saved', () => { })
      .on('exporter:done', (dest, file) => { })
  }

  async login (args) {
    const { token } = args
    if (!this.ready) {
      return this.client.login(token)
    }
  }

  async invite (args) {
    return this.client.generateInvite(['SEND_MESSAGES', 'VIEW_CHANNEL', 'ADD_REACTIONS', 'MENTION_EVERYONE', 'EMBED_LINKS', 'CONNECT', 'SPEAK', 'USE_VAD', 'CHANGE_NICKNAME'])
  }

  async join (args) {
    const { channel } = args
    return this.session.join(channel)
  }

  async tts (args) {
    const { text } = args
    return this.session.tts(text)
  }

  async leave (args) {
    return this.session.leave()
  }

  async start (args) {
    return this.session.start()
  }

  async pause (args) {
    return this.session.pause()
  }

  async resume (args) {
    return this.session.resume()
  }

  async stop (args) {
    return this.session.stop()
  }

  async open (args) {
    return this.exporter.open()
  }

  init (args) {
    return { ready: this.ready, connected: this.connected }
  }

  user (args) {
    return _.pick(this.client.user, ['id', 'avatar', 'avatarURL', 'defaultAvatarURL', 'discriminator', 'displayAvatarURL', 'tag', 'username'])
  }

  users (args) {
    return this
      .client
      .users
      .map(user => {
        return _.pick(user, ['id', 'avatar', 'avatarURL', 'defaultAvatarURL', 'discriminator', 'displayAvatarURL', 'tag', 'username'])
      })
  }

  guilds (args) {
    return this
      .client
      .guilds
      .map(guild => {
        return _.pick(guild, ['id', 'name'])
      })
  }

  channels (args) {
    return this
      .client
      .channels
      .filter(channel => {
        return ((args.guild ? channel.guild.id === args.guild : true) && channel.type === 'voice')
      })
      .map(channel => {
        return _.pick(channel, ['id', 'name', 'bitrate', 'userLimit', 'full', 'speakable', 'joinable', 'parentID', 'position'])
      })
      .sort(function (a, b) {
        const A = a.name.toLowerCase()
        const B = b.name.toLowerCase()
        if (A < B) { return -1 }
        if (A > B) { return 1 }
        return 0
      })
  }

  members (args) {
    const guild = this
      .client
      .guilds
      .get(args.guild)

    if (!guild) { throw new Error('Guild not found!') }

    return guild
      .members
      .map(member => {
        const data = _.pick(member, ['id', 'displayHexColor', 'displayName', 'nickname', 'joinedAt'])
        data.user = _.pick(member.user, ['id', 'avatar', 'avatarURL', 'defaultAvatarURL', 'discriminator', 'displayAvatarURL', 'tag', 'username'])
        data.roles = {
          highest: member.highestRole ? _.pick(member.highestRole, ['hexColor', 'name']) : {},
          hoist: member.hoistRole ? _.pick(member.hoistRole, ['hexColor', 'name']) : {}
        }
        return data
      })
  }
}
