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
    },
    deleteUser: (req, res, next) => {
        adminService.deleteUser(req, (err, data) => {
            if (err) next(err)
            req.flash('warning_msg',`You have delete ${data.name}'s account`)
            res.redirect('/admin/users')
        })
    }
}

module.exports = adminController