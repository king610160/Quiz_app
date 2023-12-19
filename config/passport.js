const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')

const { User } = require('../models')

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
        if (!user) return cb(new Error('帳號或密碼輸入錯誤！'), null)          
        const compare = await bcrypt.compare(password, user.password)
        if (!compare) return cb(new Error('帳號或密碼輸入錯誤！'), null)   
        return cb(null, user)
    }
))

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