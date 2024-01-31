const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const redisClient = require('../db/redis')
const { User, Plan } = require('../models')
const { UnauthenticatedError, NotFoundError } = require('../middleware/errors')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// local login
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
            include: [{ 
                model: Plan ,
                attributes: ['id', 'name'],
            }],
            attributes: { include: ['password'] },
            raw: true,
            nest: true 
        })
        // check user's info is right or not
        if (!user) return cb(new UnauthenticatedError('Email or password is not correct.'), null)          
        const compare = await bcrypt.compare(password, user.password)
        if (!compare) return cb(new UnauthenticatedError('Email or password is not correct.'), null)
        delete user.password
        
        // if right, then search plan for advance user's plan
        let plan = await Plan.findAll({
            where: {
                userId: user.id
            },
            attributes: ['id', 'name'],
            order: [['createdAt', 'DESC']],
            raw: true,
            nest: true
        })

        // set plan info into user
        user.plan = plan
        return cb(null, user)
    }
))

// facebook login
passport.use(new FacebookStrategy({
    clientID: process.env.FB_PROJECT_NO,
    clientSecret: process.env.FB_PROJECT_PASSWORD,
    callbackURL: `${process.env.WEB_URL}/auth/facebook/callback`,
    profileFields: ['email', 'displayName']
}, async (accessToken, refreshToken, profile, done) =>  {
    try {
        const { email, name } = profile._json
        const result = await User.findOne({ where: { email }})
        if (result) return done(null, result)
        const randomPassword = Math.random().toString(36).slice(-8)
        const hashPassword = await bcrypt.hash(randomPassword, 10)
        let user = await User.create({ 
            name: name,
            email: email,
            password: hashPassword
        })
        return done(null, user)
    } catch(err) {
        return done(err, false)
    }
}))

// google login, google cloud platform
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_PROJECT_NO,
    clientSecret: process.env.GOOGLE_PROJECT_PASSWORD,
    callbackURL: `${process.env.WEB_URL}/auth/google/callback`,
    profileFields: ['email', 'displayName']
}, async (accessToken, refreshToken, profile, done) =>  {
    try {
        const { email, name } = profile._json
        const result = await User.findOne({ where: { email }})
        if (result) return done(null, result)
        const randomPassword = Math.random().toString(36).slice(-8)
        const hashPassword = await bcrypt.hash(randomPassword, 10)
        let user = await User.create({ 
            name: name,
            email: email,
            password: hashPassword
        })
        return done(null, user)
    } catch(err) {
        return done(err, false)
    }
}))


// jwt login
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
passport.serializeUser(async(user, cb) => {
    redisClient.set(user.id, JSON.stringify(user), (err) => {
        if (err) return cb(err)
        return cb(null, user.id)
    })
})
passport.deserializeUser(async (id, cb) => {
    redisClient.get(id, (err, reply) => {
        if (err) return cb(err)
        if (!reply) return cb(new NotFoundError('There is no this user information in the database.'), null) // user not found
        const user = JSON.parse(reply)
        return cb(null, user)
    })
})

module.exports = passport