const redis = require('redis')

const client = redis.createClient({
    url: process.env.REDIS_URL
    // host: 'localhost',
    // port: 6379
})

module.exports = client