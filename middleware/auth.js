const { getUser, ensureAuthticated } = require('../helper/auth-helper')

const authenticated = (req, res, next) => {
    if (ensureAuthticated(req)) next()
}

const authenticatedAdmin = (req, res, next) => {
    if (ensureAuthticated(req)){
        if(getUser(req).isAdmin) return next()
        res.redirect('/')
    } else {
        res.redirect('/users/login')
    }
}

module.exports = {
    authenticated,
    authenticatedAdmin
}