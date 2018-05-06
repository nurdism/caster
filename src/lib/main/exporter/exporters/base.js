import moment from 'moment'
import { join } from 'path'
import { writeFile } from 'fs'

export default class SessionExporter {
  constructor (options = {}, session) {
    if (!session || !session.start || !session.stop) throw new Error('Invalid Session Object!')

    this.name = options.name || `export-${moment(this.start).format('YYYY-MM-DD-HH-mm-ss')}`

    this.bitDepth = options.bitDepth || 16
    this.sampleRate = options.sampleRate || 48000
    this.audioChannels = options.audioChannels || 2
    this.audioChannelType = options.audioChannelType || 'stereo'

    this.start = session.start
    this.stop = session.stop
    this.duration = (session.stop - session.start) * (this.sampleRate / 1000)

    this.guild = session.guild || null
    this.channel = session.channel || null
    this.users = session.users || null

    this.tracks = {}
    this.files = []
  }

  createClip (trackid, clip) {
    if (!trackid) throw new Error('Missing trackid!')
    if (!clip || !clip.file || !clip.start || !clip.stop) throw new TypeError('Invalid clip object!')

    if (!this.files.includes(clip.file)) {
      if (!this.tracks[trackid]) { this.tracks[trackid] = [] }
      this.tracks[trackid].push({
        file: clip.file,
        start: clip.start - this.start,
        duration: clip.stop - clip.start
      })
      this.files.push(clip.file)
    }
  }

  save (path) {
    const session = {
      created: this.start,
      duration: this.duration,
      bitDepth: this.bitDepth,
      sampleRate: this.sampleRate,
      audioChannels: this.audioChannels,
      audioChannelType: this.audioChannelType,
      channel: this.channel,
      guild: this.guild,
      tracks: {},
      files: []
    }

    this.files.forEach((file) => {
      session.files.push({
        absolutePath: path.join(path, file),
        relativePath: file
      })
    })

    Object.keys(this.tracks).forEach((track) => {
      session.tracks[track] = {
        user: this.users && this.users[track] ? this.users[track] : null,
        clips: []
      }
      this.tracks[track].forEach((clip) => {
        session.tracks[track].clips.push({
          file: clip.file,
          start: (clip.start) * (this.sampleRate / 1000),
          stop: (clip.start + clip.duration) * (this.sampleRate / 1000),
          duration: (clip.duration) * (this.sampleRate / 1000)
        })
      })
    })

    return new Promise((resolve, reject) => {
      writeFile(join(path, `${this.name}.json`), JSON.stringify(session, null, 2), err => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }
}
