/* eslint-disable n/no-process-exit */
/**
 * Register graceful shutdown handlers for HTTP server and MongoDB.
 *
 * @param {Object} params
 * @param {import('http').Server} params.server - The Node.js HTTP server instance
 * @param {import('mongoose')} params.mongoose - The mongoose module/instance
 * @param {number} [params.timeoutMs=10000] - Force-exit timeout in milliseconds
 */
let _registered = false
let _shuttingDown = false
let _timer = null

function registerGracefulShutdown({ server, mongoose, timeoutMs = 10000 }) {
  if (!server) {
    throw new Error('registerGracefulShutdown requires a server instance')
  }
  if (!mongoose) {
    throw new Error('registerGracefulShutdown requires mongoose')
  }
  if (_registered) {
    return
  }
  _registered = true

  function shutdown(signal) {
    if (_shuttingDown) {
      return
    }
    _shuttingDown = true
    try {
      // eslint-disable-next-line no-console
      console.log(`Received ${signal}. Starting graceful shutdown...`)
      server.close(() => {
        // eslint-disable-next-line no-console
        console.log('HTTP server closed')
        mongoose.connection
          .close(false)
          .then(() => {
            // eslint-disable-next-line no-console
            console.log('MongoDB connection closed')
            if (_timer) {
              clearTimeout(_timer)
            }
            process.exit(0)
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.error('Error closing MongoDB connection:', err)
            if (_timer) {
              clearTimeout(_timer)
            }
            process.exit(1)
          })
      })
      _timer = setTimeout(() => {
        // eslint-disable-next-line no-console
        console.warn('Force exiting after shutdown timeout')
        process.exit(1)
      }, timeoutMs)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Graceful shutdown error:', err)
      if (_timer) {
        clearTimeout(_timer)
      }
      process.exit(1)
    }
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

module.exports = { registerGracefulShutdown }
