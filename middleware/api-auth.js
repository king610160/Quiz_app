const passport = require('../config/passport')
const authenticated = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthority' }) 
        req.user = user
        next()
    })(req, res, next)
}
const authenticatedAdmin = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, data) => {
        if (!data) return res.status(403).json({ status: 'error', message: 'permission denied' })
        let userData = data.toJSON()
        if (!userData.isAdmin) return res.status(403).json({ status: 'error', message: 'permission denied' }) 
        req.user = userData
        next()
    })(req, res, next)
}
module.exports = {
  authenticated,
  authenticatedAdmin
}