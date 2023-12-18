const userService = require('../../services/user-service')


const userController = {
    register: async (req, res, next) => {
        userService.register(req, (err, data) => {
            if (err) next(err)
            console.log(data)
            res.json({
                status:'success',
                data
            })
        })
    },
}


module.exports = userController