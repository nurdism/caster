import EventEmitter from 'events'
import { join } from 'path'
import { writeFile } from 'fs'

export default class BufferManager extends EventEmitter {
  constructor () {
    super()
    this.chunks = {}
  }

  push (id, chunk) {
    if (chunk.length > 3) {
      if (!this.chunks[id]) { this.chunks[id] = { start: Date.now(), buffers: [] } }
      this.chunks[id].buffers.push(chunk)
    }
  }

  async flush (path) {
    for (const id of Object.keys(this.chunks)) {
      await this.end(path, id)
    }
  }

  async end (path, id) {
    if (!this.chunks[id]) { return }

    const { start, buffers } = this.chunks[id]
    const chunk = {
      user: id,
      start,
      stop: Date.now(),
      buffers: buffers.map(buffer => { return buffer.toString('hex') })
    }

    delete this.chunks[id]

    return new Promise((resolve, reject) => {
      const filename = `${id}-${chunk.start}.json`
      if (chunk.buffers.length > 0) {
        writeFile(join(path, filename), JSON.stringify(chunk), (err) => {
          if (err) return reject(err)
          resolve({
            filename,
            user: id,
            start: chunk.start,
            stop: chunk.stop
          })
        })
      }
    })
      .then(data => {
        this.emit('file', data)
      })
      .catch(err => this.emit('error', err))
  }
}
