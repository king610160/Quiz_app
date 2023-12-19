const userService = require('../../services/user-service')

const userController = {
    loginPage: (req, res) => {
        // const data = req.session.flash
        const qq = req.flash('error_msg')
        const data = {
            error_msg : qq
        }
        res.render('users/login', data)
    },
    login: async (req, res) => {
        req.flash('success_msg', '成功登入！')
        res.redirect('/quiz')
    },
    registerPage: (req, res) => {
        const data = req.session.flash
        res.render('users/register', data)
    },
    register: async (req, res, next) => {
        userService.register(req, (err, data) => {
            console.log(data)
            if (err) next(err)
            delete data.data.password
            res.redirect('/users/login')
        })
    },
    logOut: (req, res) => {
        req.flash('success_messages', '登出成功！')
        req.logout()
        res.redirect('/users/login')
    },
}

module.exports = userController