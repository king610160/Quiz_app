const { User } = require('../models')
const bcrypt = require('bcryptjs')

const userService = {
    register: async (req, cb) => {
        try {
            let { name, email, password, comfirmPassword } = req.body
            if (password !== comfirmPassword) {
                throw new Error('Password is not equal to Comfirm Password.')
            } 
            const hashPassword = await bcrypt.hash(req.body.password, 10)
            const user = await User.create({ 
                name,
                email,
                password: hashPassword
            })

            // prevent something wrong
            if (!user) throw new Error('Can not be created!')
            return cb(null, { data: user.toJSON() })
        } catch(error) {
            return cb(error)
        }

    },
}


module.exports = userService