import xml from 'xmlbuilder'
import SessionExporter from './base'
import slugify from 'slugify'
import { join } from 'path'
import { writeFile } from 'fs'

export default class AuditionExporter extends SessionExporter {
  constructor (options = {}, session) {
    super(options, session)
    this.version = '1.6'
    this.importerPrivateSettings = options.importerPrivateSettings || `Compression:0:0;LargeFileSupport:0:0;SampleType:0:40;`
    this.mediaHandler = options.mediaHandler || 'AmioWav'
  }

  save (path) {
    let sesx = xml
      .create('sesx', { version: '1.0', encoding: 'UTF-8', standalone: false })
      .att('version', this.version)

    let session = sesx
      .ele('session')
      .att('audioChannelType', this.audioChannelType)
      .att('bitDepth', this.bitDepth)
      .att('sampleRate', this.sampleRate)
      .att('duration', this.duration)

    session
      .ele('name')
      .txt(this.name)

    let files = sesx.ele('files')
    this.files.forEach((file, index) => {
      files
        .ele('file')
        .att('relativePath', file)
        .att('importerPrivateSettings', this.importerPrivateSettings)
        .att('mediaHandler', this.mediaHandler)
        .att('id', index + 1)
    })

    let tracks = session.ele('tracks')
    Object.keys(this.tracks).forEach((track, tindex) => {
      const tid = tindex + 1
      const name = this.users[track] ? slugify(this.users[track].username, {
        remove: /[#$*_+~()'"!:@]/g,
        lower: true
      }) : track
      let audio = tracks
        .ele('audioTrack')
        .att('index', tid)
        .att('id', tid + 1000)

      audio
        .ele('trackParameters')
        .ele('name')
        .txt(name)

      audio
        .ele('trackAudioParameters')
        .ele('trackOutput')
        .att('outputID', 1000)
        .att('type', 'trackID')

      this.tracks[track].forEach((clip, cindex) => {
        const cid = cindex + 1
        audio
          .ele('audioClip')
          .att('fileID', this.files.indexOf(clip.file) + 1)
          .att('id', cid)
          .att('zOrder', cid)
          .att('name', `${name} - ${cid}`)
          .att('startPoint', (clip.start) * (this.sampleRate / 1000))
          .att('endPoint', (clip.start + clip.duration) * (this.sampleRate / 1000))
          .att('sourceInPoint', 0)
          .att('sourceOutPoint', (clip.duration) * (this.sampleRate / 1000))
      })
    })

    tracks
      .ele('masterTrack')
      .att('id', 1000)
      .att('index', Object.keys(this.tracks).length + 1)

    return new Promise((resolve, reject) => {
      writeFile(join(path, `${this.name}.sesx`), sesx.end({ pretty: true, indent: '  ', newline: '\n', allowEmpty: false }), err => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }
}
