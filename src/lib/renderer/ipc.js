import { ipcRenderer } from 'electron'
import EventEmmiter from 'events'
import uuid from 'uuid/v4'

class MainError extends Error {
  constructor (object) {
    super()
    this.message = object.message || null
    this.stack = object.stack || null
  }
}

export default class IPCRender extends EventEmmiter {
  constructor () {
    super()

    ipcRenderer.on('ipc-main-event', async (event, args) => {
      try {
        this.emit(args.event, args.args)
      } catch (e) {
        console.error(e)
      }
    })

    this.requests = {}
    ipcRenderer.on('ipc-render-async-action-ack', (event, args) => {
      const request = this.requests[args.request.id]
      if (!request) { throw new Error(`Request id '${args.request.id}' not found!`) }
      const { resolve, reject } = request
      if (args.error) {
        return reject(new MainError(args.error))
      } else {
        return resolve(args.response)
      }
    })
  }

  callSync (action, args) {
    const request = { id: uuid(), action }
    const data = ipcRenderer.sendSync('ipc-render-sync-action', { request, args })
    if (data.error) {
      throw new MainError(data.error)
    } else {
      return data.response
    }
  }

  callAsync (action, args) {
    return new Promise((resolve, reject) => {
      const request = { id: uuid(), action }
      ipcRenderer.send('ipc-render-async-action', { request, args })
      this.requests[request.id] = { resolve, reject }
    })
  }
}
