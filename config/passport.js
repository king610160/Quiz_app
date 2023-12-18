const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')

const User = require('../models')

passport.use(new LocalStrategy(
    // customize user field
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    
    // authenticate user
    async (req, email, password, cb, next) => {
        try {
            const user = await User.findOne({ 
                where: { email },
                attributes: { include: ['password'] } 
            })
            if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))       
            const compare = await bcrypt.compare(password, user.password)
            if (!compare) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
            return cb(null, user)
        } catch(err) {
            next(err)
        }
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