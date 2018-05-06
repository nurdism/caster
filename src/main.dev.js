import { app } from 'electron'
import { install } from 'source-map-support'
import debug from 'electron-debug'

/**
 process.noDeprecation :
 A Boolean that controls whether or not deprecation warnings are printed to stderr.
 Setting this to true will silence deprecation warnings.
 This property is used instead of the --no-deprecation command line flag.
 */
// process.noDeprecation = false

/**
 process.throwDeprecation :
 A Boolean that controls whether or not deprecation warnings will be thrown as exceptions.
 Setting this to true will throw errors for deprecations.
 This property is used instead of the --throw-deprecation command line flag.
 */
// process.throwDeprecation = false

/**
 process.traceDeprecation :
 A Boolean that controls whether or not deprecations printed to stderr include
 their stack trace. Setting this to true will print stack traces for deprecations.
 This property is instead of the --trace-deprecation command line flag.
 */
process.traceDeprecation = true

/**
 process.traceProcessWarnings :
 A Boolean that controls whether or not process warnings printed to stderr
 include their stack trace. Setting this to true will print stack traces for
 process warnings (including deprecations).
 This property is instead of the --trace-warnings command line flag.
 */
process.traceProcessWarnings = true

install()
debug()

app.on('ready', async () => {
  const installer = require('electron-devtools-installer')
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = [ 'VUEJS_DEVTOOLS' ]
  await Promise.all(extensions.map(name => installer.default(installer[name].id, forceDownload))).catch(console.log)
})

try { require('./main') } catch (e) { }
