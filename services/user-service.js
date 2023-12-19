const { User } = require('../models')
const bcrypt = require('bcryptjs')

const userService = {
    register: async (req, cb) => {
        try {
            let { name, email, password, comfirmPassword } = req.body
            if (password !== comfirmPassword) {
                return cb(new Error('Password is not equal to Comfirm Password.'), null)
            }
            const hashPassword = await bcrypt.hash(req.body.password, 10)
    
            const user = await User.create({ 
                name,
                email,
                password: hashPassword
            })
            if (!user) return cb(new Error('Can not be created!'), null)
            return cb(null, { data: user.toJSON() })
        } catch(error) {
            cb(error)
        }

    },
}


module.exports = userService