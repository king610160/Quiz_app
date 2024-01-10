const passport = require('../config/passport')
const { UnauthenticatedError, NoPermissionError } = require('./errors')

const authenticated = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        // if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthority' }) 
        if (err || !user) return next(new UnauthenticatedError('You are unauthority!'))
        req.user = user
        next()
    })(req, res, next)
}
const authenticatedAdmin = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, data) => {
        if (!data) return next(new NoPermissionError('Permission denied!'))
        let userData = data.toJSON()
        if (!userData.isAdmin) return next(new NoPermissionError('Permission denied!'))
        req.user = userData
        next()
    })(req, res, next)
}
module.exports = {
  authenticated,
  authenticatedAdmin
}