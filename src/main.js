import { app, shell, BrowserWindow, Menu } from 'electron'
import Caster from '~/lib/main/caster'

const dev = process.env.NUXT_ENV === 'development'
const debug = process.env.NUXT_DEBUG === 'true'

let url = dev ? `http://localhost:${process.env.PORT}` : `file://${__dirname}/index.html`
let mainWindow

app.on('ready', async () => {
  mainWindow = new BrowserWindow({
    show: false,
    frame: false,
    transparent: true,
    width: 1024,
    height: 728
  })

  mainWindow.loadURL(url)

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }
    mainWindow.show()
    mainWindow.focus()

    if (debug) {
      mainWindow.openDevTools()
      mainWindow.webContents.on('context-menu', (e, props) => {
        const { x, y } = props

        Menu
          .buildFromTemplate([{
            label: 'Inspect element',
            click: () => {
              mainWindow.inspectElement(x, y)
            }
          }])
          .popup(mainWindow)
      })
    }
  })

  mainWindow.webContents.on('new-window', (e, url) => {
    e.preventDefault()
    shell.openExternal(url)
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  const caster = new Caster(mainWindow) // eslint-disable-line no-unused-vars
})

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
