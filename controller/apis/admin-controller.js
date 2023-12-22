const adminService = require('../../services/admin-service')

const adminController = {
    getAllUsers: (req, res, next) => {
        adminService.getAllUsers(req, (err, data) => {
            if (err) next(err)
            delete data.setting
            res.json({
                status: 'success',
                data
            })
        })
    },
    deleteUser: (req, res, next) => {
        adminService.deleteUser(req, (err, data) => {
            if (err) next(err)
            delete data.password
            res.json({
                status: 'success',
                data
            })
        })
    }
}

module.exports = adminController