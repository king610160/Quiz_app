const { User } = require('../models')
const bcrypt = require('bcryptjs')
const { toPackage } = require('../helper/api-helper')

const userService = {
    register: async (req, cb) => {
        try {
            let { name, email, password, comfirmPassword } = req.body
            if (password !== comfirmPassword) {
                return cb(new Error('Password is not equal to Comfirm Password.'))
            } 
            const hashPassword = await bcrypt.hash(req.body.password, 10)
            let user = await User.create({ 
                name,
                email,
                password: hashPassword
            })
            // prevent something wrong
            if (!user) return cb(new Error('Can not be created!'))
            user = user.toJSON()
            const result = {
                ...toPackage('success', undefined),
                user: user
            }
            return cb(null, result)
        } catch(error) {
            return cb(error)
        }
    },
}


module.exports = userService