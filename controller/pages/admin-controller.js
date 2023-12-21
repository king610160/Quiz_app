const adminService = require('../../services/admin-service')

const adminController = {
    home: (req, res) => {
        res.render('admin/home')
    },
    getAllUsers: (req, res, next) => {
        adminService.getAllUsers(req, (err, data) => {
            if (err) next(err)
            res.render('admin/allUser', {users:data.users, setting:data.setting})
        })
    }
}

module.exports = adminController