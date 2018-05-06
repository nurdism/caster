import fs from 'fs-extra'
import BufferManager from './buffer'
import EventEmitter from 'events'
import slugify from 'slugify'
import moment from 'moment'
import glob from 'glob'
import TTS from 'google-tts-api'
import tar from 'tar'

import _ from 'lodash'
import { VoiceChannel } from 'discord.js'
import { app } from 'electron'
import { join } from 'path'

import { version } from '~/package.json'

export default class SessionManager extends EventEmitter {
  constructor (client) {
    super()

    this.client = client
    this.channel = null
    this.connection = null
    this.receiver = null

    this.live = false
    this.started = false
    this.stopped = false
    this.path = {
      temp: join(app.getPath('userData'), '/temp/sessions/'),
      docs: join(app.getPath('documents'), '/Caster/sessions/')
    }

    Promise.all(Object.keys(this.path).map(path => {
      return fs.ensureDir(this.path[path])
    }))
      .then(() => {
        return fs.emptyDir(this.path.temp)
      })
      .then(() => {
        this.emit('session:ready')
      })
      .catch(err => this.emit('error', err))

    this.session = {
      path: null,
      files: {}
    }

    this.manager = new BufferManager()
    this.manager.on('error', error => { this.emit('error', error) })
    this.manager.on('file', file => {
      const { user } = file
      if (!this.session.files[user]) { this.session.files[user] = [] }
      this.session.files[user].push(file.filename)
    })

    this.listeners = {
      voiceStateUpdate: async (oldMember, newMember) => {
        if (!this.channel || oldMember.id === this.client.user.id || newMember.id === this.client.user.id) { return }
        const oldChan = oldMember.voiceChannel
        const newChan = newMember.voiceChannel
        if (oldChan && oldChan.id === this.channel.id && (!newChan || newChan.id !== this.channel.id)) {
          this.emit('member:left', oldMember)
        }
        if ((!oldChan || oldChan.id !== this.channel.id) && (newChan && newChan.id === this.channel.id)) {
          this.emit('member:joined', newMember)
        }
      }
    }

    for (const [event, listener] of Object.entries(this.listeners)) this.client.on(event, listener)

    this.on('speaking:start', user => {
      const id = user.id
      if (this.live && this.receiver && id !== this.client.user.id) {
        this.receiver.createStream(user)
          .on('data', (chunk) => {
            this.manager.push(id, chunk)
          })
          .once('end', async () => {
            await this.manager.end(this.session.path, id)
          })
      }
    })

    const managerEnd = async user => {
      await this.manager.end(this.session.path, user.id)
    }
    this.on('speaking:end', managerEnd)
    this.on('member:left', managerEnd)

    const managerFlush = async () => {
      await this.manager.flush(this.session.path)
    }
    this.on('connection:destroy', managerFlush)
    this.on('session:stop', managerFlush)
    this.on('session:pause', managerFlush)
  }

  async join (channel) {
    this.channel = this.client.channels.get(channel)
    if (!(this.channel instanceof VoiceChannel)) throw new TypeError('Channel not found or must be a voice channel!')

    if (this.connection !== null) { this.leave() }
    this.connection = await this.channel.join()
    this.connection.on('warn', warn => this.emit('warn', warn))
    this.connection.on('error', error => this.emit('error', error))

    this.session.path = join(this.path.temp, this.channel.id)
    await fs.ensureDir(this.session.path)

    this.emit('connection:ready', this.connection)

    this.receiver = this.connection.createReceiver()
    this.receiver.on('warn', warn => this.emit('warn', warn))
    this.receiver.on('error', error => this.emit('error', error))

    this.connection.on('speaking', async (user, speaking) => {
      if (speaking) {
        this.emit('speaking:start', user)
      } else {
        this.emit('speaking:end', user)
      }
    })

    this.connection.on('disconnect', this.leave)
    this.connection.on('failed', this.leave)
  }

  async leave () {
    if (this.connection === null) { return }
    try { this.connection.disconnect() } catch (e) {}
    this.emit('connection:destroy')
    this.connection = null
    if (this.receiver !== null) {
      this.receiver = null
    }
    if (this.live) {
      await this.pause()
    }
  }

  async start () {
    if (this.connection === null) { throw new Error('No connection, unable to start!') }
    if (this.live) { throw new Error('Already started') }
    await fs.emptyDir(this.session.path)
    await this.tts('starting in 3, 2, 1')
    this.emit('session:started')
    this.started = Date.now()
    this.live = true
  }

  async pause () {
    if (!this.started) { throw new Error('Session not started!') }
    if (!this.live) { throw new Error('Already paused!') }
    this.live = false
    this.emit('session:paused')
    if (this.connection !== null) { await this.tts('paused') }
  }

  async resume () {
    if (!this.started) { throw new Error('Session not started!') }
    if (this.live) { throw new Error('Already resumed!') }
    if (this.connection === null) { throw new Error('No connection, unable to start!') }
    await this.tts('resuming in 3, 2, 1')
    this.live = true
    this.emit('session:resumed')
  }

  async stop () {
    if (!this.started) { throw new Error('Session not started!') }
    this.live = false
    this.stopped = Date.now()
    this.emit('session:stopped')
    if (this.connection !== null) { await this.tts('stopped') }
    return this.save()
  }

  reset () {
    this.live = false
    this.started = false
    this.stopped = false
    this.session = { path: null, files: {} }
    this.emit('session:reset')
  }

  async save () {
    const channel = _.pick(this.channel, ['id', 'name'])
    const guild = _.pick(this.channel.guild, ['id', 'name', 'nameAcronym', 'region', 'ownerID', 'icon', 'iconURL'])

    let users = {}
    Object.keys(this.session.files).forEach(userid => {
      let user = this.client.users.get(userid)
      if (!user) { return }
      users[userid] = _.pick(user, ['id', 'avatar', 'avatarURL', 'defaultAvatarURL', 'discriminator', 'displayAvatarURL', 'tag', 'username'])

      let member = this.channel.guild.members.get(userid)
      if (!member) { return }
      users[userid].member = _.pick(member, ['displayHexColor', 'displayName', 'nickname'])
      users[userid].member.roles = {
        highest: member.highestRole ? _.pick(member.highestRole, ['hexColor', 'name']) : {},
        hoist: member.hoistRole ? _.pick(member.hoistRole, ['hexColor', 'name']) : {}
      }
    })

    const file = {
      name: slugify(`${guild.name}-${channel.name}-${moment(this.started).format('YYYY-MM-DD-HH-mm-ss')}.cst`, {
        remove: /[#$*_+~()'"!:@]/g,
        lower: true
      }),
      path: this.path.docs
    }

    return new Promise((resolve, reject) => {
      const session = join(this.session.path, `session.json`)
      const data = {
        version,
        start: this.started,
        stop: this.stopped,
        files: this.session.files,
        channel,
        guild,
        users
      }
      fs.writeFile(session, JSON.stringify(data), (err) => {
        if (err) return reject(err)
        resolve(data)
      })
    })
      .then(async data => {
        this.emit('session:saved', data)
        await fs.ensureDir(file.path)
        return new Promise((resolve, reject) => {
          glob('**/*.json', { cwd: this.session.path }, function (err, files) {
            if (err) return reject(err)
            return resolve(files)
          })
        })
      })
      .then(async files => {
        return tar.c({
          gzip: true,
          portable: true,
          file: join(file.path, file.name),
          cwd: this.session.path
        }, files)
      })
      .then(() => {
        this.emit('session:archived', join(file.path, file.name))
        return new Promise((resolve, reject) => {
          fs.emptyDir(this.session.path, err => {
            if (err) return reject(err)
            this.reset()
            resolve(join(file.path, file.name))
          })
        })
      })
      .catch(err => this.emit('error', err))
  }

  async tts (text) {
    const data = await TTS(text)
    this.emit('session:tts', text)
    return this.play(data)
  }

  play (file) {
    return new Promise(async (resolve, reject) => {
      if (!this.connection) { return reject(new Error('No connection available!')) }
      let dispatcher = this.connection.play(file)
      dispatcher.on('error', err => { reject(err) })
      dispatcher.once('finish', () => { resolve() })
    })
  }

  destroy () {
    for (const [event, listener] of Object.entries(this.listeners)) this.client.removeListener(event, listener)
  }
}
