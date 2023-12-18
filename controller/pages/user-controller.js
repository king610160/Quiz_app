const { User } = require('../../models')
const bcrypt = require('bcryptjs')

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
    register: async (req, res) => {
        let { name, email, password, comfirmPassword } = req.body
        if (password !== comfirmPassword) throw new Error('Password is not equal to Comfirm Password.')

        const hashPassword = await bcrypt.hash(req.body.password, 10)

        const user = await User.create({ 
            name,
            email,
            password: hashPassword
         })
        if(!user) throw new Error('Can not be created!')

        res.redirect('/users/login')
    },
}

module.exports = userController