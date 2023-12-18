const bcrypt = require('bcryptjs')
const { User } = require('../../models')
const { BadRequestError, UnauthenticatedError } = require('../../errors')

const userService = require('../../services/user-service')

const userController = {
    loginPage: (req, res) => {
        res.render('users/login')
    },
    login: async (req, res) => {
        const { email, password } = req.body
        if(!email || !password) throw new BadRequestError('Please provide email, and password')

        let user = await User.findOne({
            where: {email : email},
            attributes: { include: ['password'] }
        })
        if (!user) throw new UnauthenticatedError('Invalid email or password')
        
        const compare = await bcrypt.compare(password, user.password)
        if (!compare) throw new UnauthenticatedError('Invalid email or password')
        
        res.redirect('/quiz')
    },
    registerPage: (req, res) => {
        res.render('users/register')
    },
    register: async (req, res, next) => {
        userService.register(req, (err, data) => {
            if (err) next(err)
            delete data.data.password
            res.redirect('/users/login')
        })
    },
}

module.exports = userController