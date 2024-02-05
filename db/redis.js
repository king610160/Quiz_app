const redis = require('redis')

let client

if (process.env.REDIS_URL) {
    client = redis.createClient({
        url: process.env.REDIS_URL
    })
} else {
    client = redis.createClient({
        host: 'redis',
        port: 6379
    })
}

module.exports = client