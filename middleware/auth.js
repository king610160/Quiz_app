const { getUser, ensureAuthticated } = require('../helper/auth-helper')

const authenticated = (req, res, next) => {
    if (ensureAuthticated(req)) next()
    else {
        req.flash('error_msg','Please login to check the content.')
        res.redirect('/users/login')
    }
}

const authenticatedAdmin = (req, res, next) => {
    if (ensureAuthticated(req)){
        if(getUser(req).isAdmin) return next()
        req.flash('error_msg','You have no authenticated to enter this route.')
        res.redirect('/home')
    } else {
        req.flash('error_msg','Please login to check the content.')
        res.redirect('/users/login')
    }
}

module.exports = {
    authenticated,
    authenticatedAdmin
}