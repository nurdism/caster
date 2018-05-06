import { ipcMain } from 'electron'

export default class IPCMain {
  constructor (window) {
    this.window = window

    ipcMain.on('ipc-render-async-action', async (event, args) => {
      try {
        const data = await this.callAsync(args.request.action, args.args)
        event.sender.send('ipc-render-async-action-ack', { success: true, response: data, request: args.request })
      } catch (e) {
        console.error(e)
        event.sender.send('ipc-render-async-action-ack', { success: false, error: { message: e.message, stack: e.stack }, request: args.request })
      }
    })

    ipcMain.on('ipc-render-sync-action', async (event, args) => {
      try {
        let data = this.callSync(args.request.action, args.args)
        event.returnValue = { success: true, response: data, request: args.request }
      } catch (e) {
        console.error(e)
        event.returnValue = { success: false, error: { message: e.message, stack: e.stack }, request: args.request }
      }
    })
  }

  async callAsync (action, args) {
    const fn = this[action]
    if (fn && typeof fn === 'function') {
      return fn.bind(this)(args)
    }
    throw new Error(`Unknown async request action '${action}'.`)
  }

  callSync (action, args) {
    const fn = this[action]
    if (fn && typeof fn === 'function') {
      const data = fn.bind(this)(args)
      if (data instanceof Promise) {
        throw new Error(`Called an async action '${action}' in a sync call.`)
      }
      return data
    }
    throw new Error(`Unknown sync request action '${action}'.`)
  }

  emit (event, args) {
    this.window.webContents.send('ipc-main-event', { event, args })
  }
}
