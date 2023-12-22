const jwt = require('jsonwebtoken')
const userService = require('../../services/user-service')


const userController = {
    register: async (req, res, next) => {
        userService.register(req, (err, data) => {
            if (err) next(err)
            delete data.data.password
            res.json({
                status:'success',
                data
            })
        })
    },
    login: async(req, res, next) => {
        try {
            const userData = req.user.toJSON()
            delete userData.password
            delete userData.isAdmin
            const token = jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: '30d'})
            res.json({
                status: 'success',
                token: token,
                data: {
                    user: userData,
                }
            })
        } catch (error) {
            next(error)
        }
    }
}


module.exports = userController