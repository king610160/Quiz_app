// require('dotenv').config
const redis = require('redis')

const client = redis.createClient({
    // url: process.env.REDIS_URL
    host: '127.0.0.1',
    port: '6379'
})

module.exports = client