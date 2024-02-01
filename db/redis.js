const redis = require('redis')

const client = redis.createClient({
    url: process.env.REDIS_URL,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
})

module.exports = client