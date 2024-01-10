const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User, Plan } = require('../models')
const { UnauthenticatedError } = require('../middleware/errors')

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
            include: [{ model: Plan }],
            attributes: { include: ['password'] } 
        })
        if (!user) return cb(new UnauthenticatedError('Email or password is not correct.'), null)          
        const compare = await bcrypt.compare(password, user.password)
        if (!compare) return cb(new UnauthenticatedError('Email or password is not correct.'), null)
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
        if (!user) return cb(new UnauthenticatedError('Email or password is not correct.'))
        // check token is expired or not, exp is second，Date.now() is minsecond, need to devide 1000
        const currentTime = Math.floor(Date.now() / 1000)
        if (currentTime > jwtPayload.exp) return cb(new UnauthenticatedError('Token has expired.'))
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
    let [plan, user] = await Promise.all([
        Plan.findAll({
            where: {
                userId: id
            },
            raw: true,
            nest: true
        }),
        User.findByPk(id, {
            include: [{model: Plan}]
        })
    ])
    user = {
        ...user.toJSON(),
        plan
    }
    return cb(null, user)
})

module.exports = passport