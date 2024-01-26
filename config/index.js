// Import the package.json file to grab the package name and the version
const pkg = require('../package.json')

// Export a configuration object
module.exports = {
  // Use the name field from package.json as the application name
  serviceName: pkg.name,
  serviceVersion: pkg.version,

  // Redis configuration
  redis: {
    // Connection options for the Redis server
    options: {
        // Host and port for the Redis server
        host: 'localhost',
        port: 6379
      },
    // Placeholder for the Redis client, to be connected elsewhere
    client: null
  }
}
