const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(new LocalStrategy(
    // customize user field
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },

    // authenticate user
    async (req, email, password, cb) => {
        const user = await User.findOne({ 
            where: { email },
            attributes: { include: ['password'] } 
        })
        if (!user) return cb(new Error('Email or password is not correct.'), null)          
        const compare = await bcrypt.compare(password, user.password)
        if (!compare) return cb(new Error('Email or password is not correct.'), null) 
        return cb(null, user)
    }
))

const jwtOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
    try {
        const user = await User.findByPk(jwtPayload.id)
        // if can't found user, it should be unauthenticated 
        if (!user) return cb(new Error('Email or password is not correct.'), null)
        // check token is expired or not, exp is second，Date.now() is minsecond, need to devide 1000
        const currentTime = Math.floor(Date.now() / 1000)
        if (currentTime > jwtPayload.exp) return cb(null, false, { message: 'Token has expired' })
        return cb(null, user)
    } catch(err) {
        return cb(err)
    }
}))

// serialize and deserialize user
passport.serializeUser((user, cb) => {
    cb(null, user.id)
})
passport.deserializeUser(async (id, cb) => {
    let user = await User.findByPk(id)
    user = user.toJSON()
    return cb(null, user)
})

module.exports = passport