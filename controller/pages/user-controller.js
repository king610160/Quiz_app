const userService = require('../../services/user-service')

const userController = {
    loginPage: (req, res) => {
        res.render('users/login')
    },
    login: (req, res) => {
        res.redirect('/quiz')
    },
    registerPage: (req, res) => {
        res.render('users/register')
    },
    register: async (req, res, next) => {
        userService.register(req, (err, data) => {
            if (err) next(err)
            res.redirect('/users/login')
        })
    },
}

module.exports = userController