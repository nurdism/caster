import EventEmmitter from 'events'
import fs from 'fs-extra'
import tar from 'tar'
import { join, parse } from 'path'
import { app, dialog } from 'electron'
import { SessionExporter, AuditionExporter } from './exporters'
import { FileWriter } from 'wav'
import opus from 'node-opus'

export default class Exporter extends EventEmmitter {
  constructor () {
    super()
    this.encoder = new opus.OpusEncoder(48000, 2)
    this.path = {
      temp: join(app.getPath('userData'), '/temp/exports/'),
      sessions: join(app.getPath('documents'), '/Caster/sessions/'),
      docs: join(app.getPath('documents'), '/Caster/exports/')
    }

    Promise.all(Object.keys(this.path).map(path => {
      return fs.ensureDir(this.path[path])
    }))
      .then(() => {
        return fs.emptyDir(this.path.temp)
      })
      .then(() => {
        this.emit('exporter:ready')
      })
      .catch(err => this.emit('error', err))
  }

  open () {
    return new Promise((resolve, reject) => {
      dialog.showOpenDialog({
        title: 'Open Caster Session',
        defaultPath: this.path.sessions,
        buttonLabel: 'Open Session',
        filters: [
          { name: 'Cater Sessions', extensions: ['cst'] }
        ],
        properties: [
          'openFile'
        ]
      }, files => {
        if (!files) { return reject(new Error('No session file selected.')) }
        return resolve(parse(files[0]))
      })
    })
      .then(file => {
        return new Promise((resolve, reject) => {
          dialog.showSaveDialog({
            title: 'Export Caster Session',
            defaultPath: join(this.path.docs, `${file.name}.sesx`),
            buttonLabel: 'Export Session',
            filters: [
              { name: 'Adobe Audition Session', extensions: ['sesx'] },
              { name: 'Raw Session', extensions: ['json'] }
            ]
          }, filename => {
            if (!filename) { return reject(new Error('No export file selected.')) }
            return resolve({
              open: file,
              save: parse(filename)
            })
          })
        })
      })
      .then(files => {
        return this.start(files.open, files.save)
      })
  }

  async start (open, save) {
    const path = join(save.dir, save.name)
    const audio = join(path, '/imported/')
    let exporter, session

    this.emit('exporter:start', open, save)
    return fs.emptyDir(this.path.temp)
      .then(() => {
        this.emit('exporter:extracting', open, this.path.temp)
        return tar.x({
          file: join(open.dir, open.base),
          cwd: this.path.temp
        })
      })
      .then(() => {
        this.emit('exporter:extracted', open, this.path.temp)
        return fs.readJson(join(this.path.temp, 'session.json'))
      })
      .then(sess => {
        this.emit('exporter:loading', sess)
        session = sess
        const options = { name: save.name }
        switch (save.ext) {
          case '.sesx':
            exporter = new AuditionExporter(options, session)
            break
          case '.json':
            exporter = new SessionExporter(options, session)
            break
          default:
            throw new Error(`Unknown Exporter '${save.ext}'`)
        }

        return fs.ensureDir(path)
      })
      .then(() => {
        return fs.ensureDir(audio)
      })
      .then(() => {
        return Promise.all(Object.keys(session.files).map(user => {
          this.emit('exporter:processing', user)
          return this.process(audio, session.files[user], exporter)
            .then(() => {
              this.emit('exporter:processed', user)
            })
        }))
      })
      .then(() => {
        this.emit('exporter:saving', path, save)
        return exporter.save(path)
      })
      .then(() => {
        this.emit('exporter:saved')
        return fs.emptyDir(this.path.temp)
      })
      .then(() => {
        this.emit('exporter:done', path, save)
      })
      .catch(err => this.emit('error', err))
  }

  process (path, files, exporter) {
    return Promise.all(files.map(async filename => {
      try {
        const file = parse(filename)
        const clip = await fs.readJson(join(this.path.temp, filename))
        this.emit('exporter:file', filename, clip)
        exporter.createClip(clip.user, {
          file: `./imported/${file.name}.wav`,
          start: clip.start,
          stop: clip.stop
        })
        return this.decode(join(path, `${file.name}.wav`), clip.buffers)
      } catch (e) {
        this.emit('error', e)
      }
    }))
  }

  decode (file, buffers) {
    return new Promise(async resolve => {
      const options = { sampleRate: 48000, bitDepth: 16, channels: 2 }
      const output = new FileWriter(file, options)
      this.emit('exporter:decoding', file, options)
      for (let buffer of buffers) {
        try {
          await output.write(await this.encoder.decode(Buffer.from(buffer, 'hex'), 960))
        } catch (err) {
          this.emit('error', err)
          resolve()
        }
      }
      output.end()
      output.once('end', () => resolve())
      output.on('error', err => {
        this.emit('error', err)
        resolve()
      })
    })
  }
}
