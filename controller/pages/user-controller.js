const userService = require('../../services/user-service')

const userController = {
    loginPage: (req, res) => {
        res.render('users/login')
    },
    login: async (req, res) => {
        req.flash('success_msg', 'Login success.')
        res.redirect('/home')
    },
    registerPage: (req, res) => {
        res.render('users/register')
    },
    register: async (req, res, next) => {
        userService.register(req, (err, data) => {
            if (err) return next(err)
            delete data.data.password
            res.redirect('/users/login')
        })
    },
    logout: (req, res, next) => {
        req.logout(function(err) {
            if (err) return next(err)
            req.flash('success_msg', 'Logout success')
            res.redirect('/users/login')
        })
    },
}

module.exports = userController