const userService = require('../../services/user-service')

const userController = {
    // login page
    loginPage: (req, res) => {
        res.render('users/login')
    },
    // perform login function, will redirect to home
    login: (req, res) => {
        req.flash('success_msg', `Hi ${req.user.name}, let's start a quiz.`)
        res.redirect('/home')
    },
    // register page
    registerPage: (req, res) => {
        res.render('users/register')
    },
    // perform register function
    register: async (req, res, next) => {
        userService.register(req, (err, data) => {
            if (err) return next(err)
            if (data.user) delete data.user.password
            res.redirect('/users/login')
        })
    },
    // logout
    logout: (req, res, next) => {
        req.logout(function(err) {
            if (err) return next(err)
            req.flash('success_msg', 'Logout success')
            res.redirect('/users/login')
        })
    },
}

module.exports = userController