const session = require('express-session')
const connectRedis = require('connect-redis')
const RedisStore = connectRedis(session)
const client = require('../db/redis')

module.exports = session({
    store: new RedisStore({
        client: client,
        ttl: 60 * 60 * 24 // this is count by second, give 1 days login permit
    }),
    secret: process.env.sessionSecret,
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: false, // when deploy, need to change it to true, to accept https only
        httpOnly: true, // if true, prevent client side JS from reading the cookie
    },
    shouldSaveSession: function(req) {
        return req.method !== 'HEAD'
    }
})
